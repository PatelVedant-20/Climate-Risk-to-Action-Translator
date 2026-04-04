const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    inputs: {
        temperature: Number,
        aqi: Number,
        uvIndex: Number,
        windSpeed: Number,
        weather: String
    },
    adviceCount: {
        type: Number,
        default: 0
    },
    highestSeverity: {
        type: String,
        default: 'low'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', historySchema);
