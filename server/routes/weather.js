const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_KEY;

// ── In-memory cache (lat,lon → response, 5-min TTL) ──────────
const weatherCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(lat, lon) {
    return `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
}

function getCached(key) {
    const entry = weatherCache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data;
    }
    weatherCache.delete(key);
    return null;
}

function setCache(key, data) {
    weatherCache.set(key, { data, timestamp: Date.now() });
    // Evict old entries if cache grows too large
    if (weatherCache.size > 500) {
        const oldest = weatherCache.keys().next().value;
        weatherCache.delete(oldest);
    }
}

// ── Map OpenWeatherMap conditions to our rule categories ──────
function mapWeatherCondition(weatherMain) {
    const main = (weatherMain || '').toLowerCase();
    if (main.includes('thunder')) return 'storm';
    if (main.includes('drizzle')) return 'drizzle';
    if (main.includes('rain')) return 'rain';
    if (main.includes('snow')) return 'snow';
    if (main.includes('fog') || main.includes('mist') || main.includes('haze')) return 'fog';
    if (main.includes('tornado')) return 'tornado';
    if (main.includes('squall')) return 'squall';
    if (main.includes('dust') || main.includes('sand') || main.includes('ash')) return 'dust';
    if (main.includes('cloud') || main.includes('overcast')) return 'clouds';
    return 'clear';
}

// ── Try to get real UV index from One Call API 3.0 ────────────
async function fetchRealUV(lat, lon) {
    try {
        const res = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`,
            { timeout: 3000 }
        );
        if (res.data?.current?.uvi !== undefined) {
            return Math.round(res.data.current.uvi);
        }
    } catch {
        // One Call 3.0 may require a subscription — fall back silently
    }
    return null;
}

// ── Estimate UV from cloud cover (fallback) ──────────────────
function estimateUV(clouds) {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) return 0;
    const solarFactor = 1 - Math.abs(hour - 12) / 6;
    const uv = Math.round(solarFactor * 11 * (1 - (clouds || 0) / 150));
    return Math.max(0, Math.min(uv, 12));
}

// ══════════════════════════════════════════════════════════════
// GET /api/weather?lat=&lon= — current weather for coordinates
// ══════════════════════════════════════════════════════════════
router.get("/", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "lat and lon query parameters are required" });
    }

    // Check cache
    const cacheKey = getCacheKey(lat, lon);
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        const [weather, aqi] = await Promise.all([
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            ),
            axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            )
        ]);

        const condition = mapWeatherCondition(weather.data.weather[0]?.main);

        // Try real UV, fall back to estimate
        const clouds = weather.data.clouds?.all || 0;
        let uvIndex = await fetchRealUV(lat, lon);
        if (uvIndex === null) {
            uvIndex = estimateUV(clouds);
        }

        // Convert EU AQI (1–5) to US AQI scale
        const euAqi = aqi.data.list[0]?.main?.aqi || 2;
        const aqiMap = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 300 };
        const usAqi = aqiMap[euAqi] || 75;

        const result = {
            city: weather.data.name,
            country: weather.data.sys?.country || '',
            temperature: Math.round(weather.data.main.temp),
            feelsLike: Math.round(weather.data.main.feels_like),
            humidity: weather.data.main.humidity,
            windSpeed: Math.round(weather.data.wind.speed * 3.6), // m/s → km/h
            weather: condition,
            description: weather.data.weather[0]?.description || '',
            aqi: usAqi,
            uvIndex
        };

        setCache(cacheKey, result);
        res.json(result);

    } catch (err) {
        console.error('Weather API error:', err.message);
        res.status(500).json({ error: "Failed to fetch climate data" });
    }
});

// ══════════════════════════════════════════════════════════════
// GET /api/weather/forecast?lat=&lon= — 5-day daily forecast
// ══════════════════════════════════════════════════════════════
router.get("/forecast", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "lat and lon query parameters are required" });
    }

    // Check cache (separate namespace)
    const cacheKey = `forecast_${getCacheKey(lat, lon)}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        const forecastRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        // Group 3-hour intervals by date and pick one summary per day
        const dailyMap = new Map();

        for (const item of forecastRes.data.list) {
            const date = item.dt_txt.split(' ')[0]; // "2026-02-18"
            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    temps: [],
                    conditions: [],
                    descriptions: [],
                    winds: [],
                    icon: item.weather[0]?.icon || '01d'
                });
            }
            const day = dailyMap.get(date);
            day.temps.push(item.main.temp);
            day.conditions.push(item.weather[0]?.main || '');
            day.descriptions.push(item.weather[0]?.description || '');
            day.winds.push(item.wind?.speed || 0);
        }

        const forecast = [];
        for (const [date, data] of dailyMap) {
            // Skip today (we already show current weather)
            const today = new Date().toISOString().split('T')[0];
            if (date === today) continue;

            // Find most frequent condition
            const condCount = {};
            for (const c of data.conditions) {
                condCount[c] = (condCount[c] || 0) + 1;
            }
            const dominantCondition = Object.entries(condCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Clear';

            forecast.push({
                date,
                dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                tempHigh: Math.round(Math.max(...data.temps)),
                tempLow: Math.round(Math.min(...data.temps)),
                condition: mapWeatherCondition(dominantCondition),
                conditionLabel: dominantCondition,
                windSpeed: Math.round((data.winds.reduce((a, b) => a + b, 0) / data.winds.length) * 3.6),
                icon: data.icon
            });
        }

        // Limit to 5 days
        const result = forecast.slice(0, 5);
        setCache(cacheKey, result);
        res.json(result);

    } catch (err) {
        console.error('Forecast API error:', err.message);
        res.status(500).json({ error: "Failed to fetch forecast data" });
    }
});

// ══════════════════════════════════════════════════════════════
// GET /api/weather/geocode?city= — city name → coordinates
// ══════════════════════════════════════════════════════════════
router.get("/geocode", async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: "city query parameter is required" });
    }

    try {
        const geoRes = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );

        if (!geoRes.data || geoRes.data.length === 0) {
            return res.status(404).json({ error: "City not found" });
        }

        res.json({
            lat: geoRes.data[0].lat,
            lon: geoRes.data[0].lon,
            name: geoRes.data[0].name,
            country: geoRes.data[0].country
        });
    } catch (err) {
        console.error('Geocode error:', err.message);
        res.status(500).json({ error: "Failed to geocode city" });
    }
});

module.exports = router;
