const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const History = require('../models/History');

// POST /api/advice — get matching advice for given climate inputs
router.post('/', async (req, res) => {
    try {
        const { temperature, aqi, uvIndex, windSpeed, weather } = req.body;

        // ── Input Validation ──────────────────────────────────
        const numericFields = { temperature, aqi, uvIndex, windSpeed };
        for (const [key, val] of Object.entries(numericFields)) {
            if (val !== undefined && val !== null && val !== '') {
                const num = Number(val);
                if (!Number.isFinite(num)) {
                    return res.status(400).json({ error: `${key} must be a valid number` });
                }
            }
        }

        const allowedWeather = ['clear', 'rain', 'storm', 'snow', 'fog', 'hail', 'clouds', 'drizzle', 'dust', 'sand', 'tornado', 'squall'];
        if (weather && !allowedWeather.includes(weather.toLowerCase())) {
            return res.status(400).json({ error: `weather must be one of: ${allowedWeather.join(', ')}` });
        }
        // ──────────────────────────────────────────────────────

        const matchedAdvice = [];
        const severityOrder = { low: 1, moderate: 2, high: 3, extreme: 4 };
        let highestSeverity = 'low';

        // Get all rules from DB
        const rules = await Rule.find();

        for (const rule of rules) {
            let matched = false;

            switch (rule.category) {
                case 'temperature':
                    if (temperature !== undefined && temperature !== '') {
                        const temp = Number(temperature);
                        if ((rule.minVal === null || temp >= rule.minVal) &&
                            (rule.maxVal === null || temp <= rule.maxVal)) {
                            matched = true;
                        }
                    }
                    break;

                case 'aqi':
                    if (aqi !== undefined && aqi !== '') {
                        const aqiVal = Number(aqi);
                        if ((rule.minVal === null || aqiVal >= rule.minVal) &&
                            (rule.maxVal === null || aqiVal <= rule.maxVal)) {
                            matched = true;
                        }
                    }
                    break;

                case 'uvIndex':
                    if (uvIndex !== undefined && uvIndex !== '') {
                        const uv = Number(uvIndex);
                        if ((rule.minVal === null || uv >= rule.minVal) &&
                            (rule.maxVal === null || uv <= rule.maxVal)) {
                            matched = true;
                        }
                    }
                    break;

                case 'windSpeed':
                    if (windSpeed !== undefined && windSpeed !== '') {
                        const wind = Number(windSpeed);
                        if ((rule.minVal === null || wind >= rule.minVal) &&
                            (rule.maxVal === null || wind <= rule.maxVal)) {
                            matched = true;
                        }
                    }
                    break;

                case 'weather':
                    if (weather && rule.matchValue &&
                        weather.toLowerCase() === rule.matchValue.toLowerCase()) {
                        matched = true;
                    }
                    break;
            }

            if (matched) {
                matchedAdvice.push({
                    category: rule.category,
                    severity: rule.severity,
                    title: rule.title,
                    advice: rule.advice,
                    icon: rule.icon
                });

                if (severityOrder[rule.severity] > severityOrder[highestSeverity]) {
                    highestSeverity = rule.severity;
                }
            }
        }

        // Sort by severity (extreme first)
        matchedAdvice.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

        // Log to history
        await History.create({
            inputs: { temperature, aqi, uvIndex, windSpeed, weather },
            adviceCount: matchedAdvice.length,
            highestSeverity
        });

        res.json({ advice: matchedAdvice, count: matchedAdvice.length });
    } catch (err) {
        console.error('Error processing advice:', err);
        res.status(500).json({ error: 'Failed to process advice request' });
    }
});

// GET /api/history — return recent lookups
router.get('/history', async (req, res) => {
    try {
        const history = await History.find()
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;
