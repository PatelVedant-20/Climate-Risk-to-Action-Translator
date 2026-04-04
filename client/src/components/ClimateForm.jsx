import { useState } from 'react';
import './ClimateForm.css';

const weatherOptions = [
    { value: '', label: 'Select condition...' },
    { value: 'clear', label: '☀️ Clear' },
    { value: 'rain', label: '🌧️ Rain' },
    { value: 'storm', label: '⛈️ Storm' },
    { value: 'snow', label: '🌨️ Snow' },
    { value: 'fog', label: '🌫️ Fog' },
    { value: 'hail', label: '🧊 Hail' }
];

export default function ClimateForm({ onSubmit, isLoading }) {
    const [inputs, setInputs] = useState({
        temperature: '',
        aqi: '',
        uvIndex: '',
        windSpeed: '',
        weather: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasInput = Object.values(inputs).some(v => v !== '');
        if (!hasInput) return;
        onSubmit(inputs);
    };

    const handleClear = () => {
        setInputs({
            temperature: '',
            aqi: '',
            uvIndex: '',
            windSpeed: '',
            weather: ''
        });
    };

    return (
        <form className="climate-form glass-card" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2 className="form-title">Enter Climate Conditions</h2>
                <p className="form-subtitle">Fill in one or more fields to get personalized safety advice</p>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label" htmlFor="temperature">
                        <span className="label-icon">🌡️</span>
                        Temperature (°C)
                    </label>
                    <input
                        type="number"
                        id="temperature"
                        name="temperature"
                        className="form-input"
                        placeholder="e.g. 35"
                        value={inputs.temperature}
                        onChange={handleChange}
                        step="0.1"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="aqi">
                        <span className="label-icon">😷</span>
                        Air Quality Index
                    </label>
                    <input
                        type="number"
                        id="aqi"
                        name="aqi"
                        className="form-input"
                        placeholder="e.g. 150"
                        value={inputs.aqi}
                        onChange={handleChange}
                        min="0"
                        max="500"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="uvIndex">
                        <span className="label-icon">☀️</span>
                        UV Index
                    </label>
                    <input
                        type="number"
                        id="uvIndex"
                        name="uvIndex"
                        className="form-input"
                        placeholder="e.g. 7"
                        value={inputs.uvIndex}
                        onChange={handleChange}
                        min="0"
                        max="15"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="windSpeed">
                        <span className="label-icon">💨</span>
                        Wind Speed (km/h)
                    </label>
                    <input
                        type="number"
                        id="windSpeed"
                        name="windSpeed"
                        className="form-input"
                        placeholder="e.g. 45"
                        value={inputs.windSpeed}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <div className="form-group form-group-wide">
                    <label className="form-label" htmlFor="weather">
                        <span className="label-icon">⛅</span>
                        Weather Condition
                    </label>
                    <select
                        id="weather"
                        name="weather"
                        className="form-input form-select"
                        value={inputs.weather}
                        onChange={handleChange}
                    >
                        {weatherOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClear}
                >
                    Clear All
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            🔍 Get Advice
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
