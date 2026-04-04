const mongoose = require('mongoose');
require('dotenv').config();
const Rule = require('./models/Rule');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/climate-risk';

const rules = [
    // ── AQI Rules ──────────────────────────────────────────
    {
        category: 'aqi', metric: 'AQI', minVal: 0, maxVal: 50,
        severity: 'low', title: 'Good Air Quality',
        advice: 'Air quality is great! Enjoy outdoor activities freely.',
        icon: '🌿'
    },
    {
        category: 'aqi', metric: 'AQI', minVal: 51, maxVal: 100,
        severity: 'moderate', title: 'Moderate Air Quality',
        advice: 'Air quality is acceptable. Sensitive groups should limit prolonged outdoor exertion.',
        icon: '😷'
    },
    {
        category: 'aqi', metric: 'AQI', minVal: 101, maxVal: 200,
        severity: 'high', title: 'Unhealthy Air — Wear a Mask',
        advice: 'Wear an N95 mask outdoors. Reduce outdoor activities. Keep windows closed and use air purifiers indoors.',
        icon: '😷'
    },
    {
        category: 'aqi', metric: 'AQI', minVal: 201, maxVal: 500,
        severity: 'extreme', title: 'Hazardous Air Quality',
        advice: 'Stay indoors at all costs. Use an N95/P100 mask if you must go outside. Run HEPA air purifiers. Seal windows and doors.',
        icon: '🚨'
    },

    // ── Temperature Rules ──────────────────────────────────
    {
        category: 'temperature', metric: 'Temperature', minVal: null, maxVal: -10,
        severity: 'extreme', title: 'Extreme Cold Alert',
        advice: 'Risk of frostbite and hypothermia. Wear heavy insulated layers, cover all exposed skin, and limit time outdoors.',
        icon: '🥶'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: -10, maxVal: 0,
        severity: 'high', title: 'Freezing Conditions',
        advice: 'Wear warm layers, insulated gloves, and a hat. Watch for icy roads and sidewalks.',
        icon: '❄️'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: 0, maxVal: 10,
        severity: 'moderate', title: 'Cold Weather',
        advice: 'Dress in warm layers. A jacket and scarf are recommended. Stay dry to prevent wind chill.',
        icon: '🧥'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: 10, maxVal: 25,
        severity: 'low', title: 'Comfortable Temperature',
        advice: 'Weather is pleasant! Great conditions for outdoor activities. Dress in light layers.',
        icon: '😊'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: 25, maxVal: 35,
        severity: 'moderate', title: 'Warm Weather',
        advice: 'Stay hydrated, drink plenty of water. Wear light, breathable clothing and take shade breaks.',
        icon: '☀️'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: 35, maxVal: 42,
        severity: 'high', title: 'Heat Warning',
        advice: 'High risk of heatstroke. Avoid outdoor exertion between 11 AM – 4 PM. Drink water every 15 minutes. Stay in AC if possible.',
        icon: '🔥'
    },
    {
        category: 'temperature', metric: 'Temperature', minVal: 42, maxVal: null,
        severity: 'extreme', title: 'Extreme Heat Emergency',
        advice: 'Life-threatening heat! Stay indoors in air conditioning. Wet towels on neck/wrists. Call emergency services if symptoms of heatstroke appear.',
        icon: '🌡️'
    },

    // ── UV Index Rules ─────────────────────────────────────
    {
        category: 'uvIndex', metric: 'UV Index', minVal: 0, maxVal: 2,
        severity: 'low', title: 'Low UV Exposure',
        advice: 'Minimal sun protection needed. Sunglasses on bright days are enough.',
        icon: '😎'
    },
    {
        category: 'uvIndex', metric: 'UV Index', minVal: 3, maxVal: 5,
        severity: 'moderate', title: 'Moderate UV — Apply Sunscreen',
        advice: 'Apply SPF 30+ sunscreen. Wear sunglasses and a hat during midday hours.',
        icon: '🧴'
    },
    {
        category: 'uvIndex', metric: 'UV Index', minVal: 6, maxVal: 7,
        severity: 'high', title: 'High UV — Protect Your Skin',
        advice: 'Apply SPF 50+ sunscreen every 2 hours. Wear protective clothing, wide-brim hat, and UV-blocking sunglasses. Seek shade between 10 AM – 4 PM.',
        icon: '🧴'
    },
    {
        category: 'uvIndex', metric: 'UV Index', minVal: 8, maxVal: 15,
        severity: 'extreme', title: 'Very High UV — Avoid Midday Sun',
        advice: 'Extreme burn risk! Avoid direct sun from 10 AM – 4 PM. Use SPF 50+, reapply every 90 min. Wear long sleeves and a wide-brim hat.',
        icon: '☢️'
    },

    // ── Wind Speed Rules ───────────────────────────────────
    {
        category: 'windSpeed', metric: 'Wind Speed', minVal: 0, maxVal: 20,
        severity: 'low', title: 'Light Breeze',
        advice: 'Winds are calm. No special precautions needed.',
        icon: '🍃'
    },
    {
        category: 'windSpeed', metric: 'Wind Speed', minVal: 20, maxVal: 40,
        severity: 'moderate', title: 'Breezy Conditions',
        advice: 'Secure loose outdoor items. Use a windbreaker jacket if cycling or walking.',
        icon: '💨'
    },
    {
        category: 'windSpeed', metric: 'Wind Speed', minVal: 40, maxVal: 70,
        severity: 'high', title: 'Strong Winds',
        advice: 'Avoid driving high-profile vehicles. Secure outdoor furniture. Stay away from trees and power lines.',
        icon: '🌬️'
    },
    {
        category: 'windSpeed', metric: 'Wind Speed', minVal: 70, maxVal: null,
        severity: 'extreme', title: 'Dangerous Wind — Take Shelter',
        advice: 'Take immediate shelter. Stay away from windows. Do not drive. Flying debris risk is high.',
        icon: '🌪️'
    },

    // ── Weather Condition Rules ────────────────────────────
    {
        category: 'weather', metric: 'Weather', matchValue: 'rain',
        severity: 'moderate', title: 'Rain Expected',
        advice: 'Carry an umbrella or rain jacket. Drive cautiously on wet roads. Watch for puddles and reduced visibility.',
        icon: '🌧️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'storm',
        severity: 'extreme', title: 'Thunderstorm Warning',
        advice: 'Stay indoors immediately. Avoid open fields, tall trees, and metal objects. Unplug electronics. Do not drive through flooded roads.',
        icon: '⛈️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'snow',
        severity: 'high', title: 'Snowfall Alert',
        advice: 'Wear insulated, waterproof boots. Drive slowly with snow tires. Keep an emergency kit in your car. Watch for black ice.',
        icon: '🌨️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'fog',
        severity: 'moderate', title: 'Foggy Conditions',
        advice: 'Use low-beam headlights while driving. Reduce speed and increase following distance. Be cautious at intersections.',
        icon: '🌫️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'hail',
        severity: 'extreme', title: 'Hailstorm — Seek Cover',
        advice: 'Move vehicles under cover. Stay indoors and away from windows. Do not go outside during active hail.',
        icon: '🧊'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'clear',
        severity: 'low', title: 'Clear Skies',
        advice: 'Perfect weather for outdoor activities! Remember sunscreen if UV is moderate or above.',
        icon: '☀️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'clouds',
        severity: 'low', title: 'Cloudy Skies',
        advice: 'Overcast conditions. Good for outdoor activities without harsh sun. Carry a light jacket.',
        icon: '☁️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'drizzle',
        severity: 'moderate', title: 'Light Drizzle',
        advice: 'Light rain expected. A waterproof jacket or umbrella is recommended. Roads may be slightly slippery.',
        icon: '🌦️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'dust',
        severity: 'high', title: 'Dust / Sandstorm',
        advice: 'Reduced visibility and poor air quality. Wear a mask outdoors. Keep car windows up. Avoid contact lenses.',
        icon: '🏜️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'sand',
        severity: 'high', title: 'Sandstorm Alert',
        advice: 'Dangerous visibility conditions. Stay indoors if possible. Protect eyes and respiratory system.',
        icon: '🏜️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'tornado',
        severity: 'extreme', title: 'Tornado Warning',
        advice: 'Seek shelter immediately in an interior room on the lowest floor. Stay away from windows. Monitor emergency alerts.',
        icon: '🌪️'
    },
    {
        category: 'weather', metric: 'Weather', matchValue: 'squall',
        severity: 'high', title: 'Wind Squall Alert',
        advice: 'Sudden strong gusts expected. Secure outdoor items. Avoid boating or open water activities. Drive cautiously.',
        icon: '💨'
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Rule.deleteMany({});
        console.log('🗑️  Cleared existing rules');

        await Rule.insertMany(rules);
        console.log(`✅ Seeded ${rules.length} rules successfully`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
