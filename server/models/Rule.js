const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['aqi', 'temperature', 'uvIndex', 'windSpeed', 'weather']
  },
  metric: {
    type: String,
    required: true
  },
  minVal: {
    type: Number,
    default: null
  },
  maxVal: {
    type: Number,
    default: null
  },
  matchValue: {
    type: String,
    default: null
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high', 'extreme']
  },
  title: {
    type: String,
    required: true
  },
  advice: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Rule', ruleSchema);
