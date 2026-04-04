import { useState } from 'react';
import './LocationFetcher.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Severity color helpers for metric card borders ──────
function getTempSeverity(temp) {
    if (temp <= -10 || temp >= 42) return 'extreme';
    if ((temp > -10 && temp <= 0) || (temp >= 35 && temp < 42)) return 'high';
    if ((temp > 0 && temp <= 10) || (temp >= 25 && temp < 35)) return 'moderate';
    return 'low';
}

function getAqiSeverity(aqi) {
    if (aqi > 200) return 'extreme';
    if (aqi > 100) return 'high';
    if (aqi > 50) return 'moderate';
    return 'low';
}

function getUvSeverity(uv) {
    if (uv >= 8) return 'extreme';
    if (uv >= 6) return 'high';
    if (uv >= 3) return 'moderate';
    return 'low';
}

function getWindSeverity(wind) {
    if (wind >= 70) return 'extreme';
    if (wind >= 40) return 'high';
    if (wind >= 20) return 'moderate';
    return 'low';
}

const severityBorderColors = {
    low: 'var(--severity-low)',
    moderate: 'var(--severity-moderate)',
    high: 'var(--severity-high)',
    extreme: 'var(--severity-extreme)'
};

export default function LocationFetcher({ onDataFetched, isLoading, setIsLoading }) {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('idle');
    const [citySearch, setCitySearch] = useState('');
    const [showManual, setShowManual] = useState(false);

    // Fallback: IP-based geolocation (no permissions needed)
    const getLocationByIP = async () => {
        // Try multiple HTTPS services in order
        const services = [
            {
                url: 'https://ipapi.co/json/',
                parse: (data) => ({ lat: data.latitude, lon: data.longitude })
            },
            {
                url: 'https://ipwho.is/',
                parse: (data) => ({ lat: data.latitude, lon: data.longitude })
            },
            {
                url: 'http://ip-api.com/json/?fields=lat,lon,city,country',
                parse: (data) => ({ lat: data.lat, lon: data.lon })
            }
        ];

        for (const service of services) {
            try {
                const res = await fetch(service.url, { signal: AbortSignal.timeout(4000) });
                if (!res.ok) continue;
                const data = await res.json();
                const coords = service.parse(data);
                if (coords.lat && coords.lon) return coords;
            } catch {
                continue;
            }
        }
        throw new Error('All IP location services failed');
    };

    // Try GPS first, fallback to IP geolocation
    const detectLocation = async () => {
        setError(null);
        setFetchStatus('locating');
        setIsLoading(true);

        try {
            let coords;

            // Try browser GPS first
            try {
                coords = await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('not supported'));
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                        (err) => reject(err),
                        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
                    );
                });
            } catch {
                // GPS failed — fallback to IP-based location
                console.log('GPS unavailable, using IP geolocation...');
                coords = await getLocationByIP();
            }

            await fetchWeatherFromBackend(coords.lat, coords.lon);
        } catch (err) {
            console.error('Location detection error:', err);
            setError('Could not detect location. Try searching your city below.');
            setShowManual(true);
            setFetchStatus('idle');
            setIsLoading(false);
        }
    };

    // Search by city name — uses OpenWeatherMap geocoding via backend
    const searchByCity = async (e) => {
        e.preventDefault();
        if (!citySearch.trim()) return;

        setError(null);
        setFetchStatus('fetching');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/weather/geocode?city=${encodeURIComponent(citySearch.trim())}`);
            if (!res.ok) throw new Error('City not found');
            const data = await res.json();
            await fetchWeatherFromBackend(data.lat, data.lon);
        } catch (err) {
            setError('City not found. Try a different name.');
            setFetchStatus('idle');
            setIsLoading(false);
        }
    };

    // Core: fetch weather + forecast from backend
    const fetchWeatherFromBackend = async (lat, lon) => {
        setFetchStatus('fetching');

        // Fetch current weather and forecast in parallel
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}`),
            fetch(`${API_URL}/weather/forecast?lat=${lat}&lon=${lon}`).catch(() => null)
        ]);

        if (!weatherRes.ok) throw new Error('Weather fetch failed');

        const data = await weatherRes.json();
        let forecastData = [];
        try {
            if (forecastRes && forecastRes.ok) {
                forecastData = await forecastRes.json();
            }
        } catch {
            // Forecast is non-critical — silently ignore
        }

        const displayData = {
            city: data.city,
            country: data.country,
            description: data.description,
            temperature: data.temperature,
            feelsLike: data.feelsLike,
            humidity: data.humidity,
            aqi: data.aqi,
            uvIndex: data.uvIndex,
            windSpeed: data.windSpeed,
            weather: data.weather
        };

        const climateData = {
            temperature: data.temperature,
            aqi: data.aqi,
            uvIndex: data.uvIndex,
            windSpeed: data.windSpeed,
            weather: data.weather
        };

        setWeatherData(displayData);
        setFetchStatus('done');
        setIsLoading(false);
        onDataFetched(climateData, forecastData);
    };

    const weatherIcons = {
        clear: '☀️', clouds: '☁️', rain: '🌧️', drizzle: '🌦️',
        storm: '⛈️', snow: '🌨️', fog: '🌫️', hail: '🧊',
        dust: '🏜️', sand: '🏜️', tornado: '🌪️', squall: '💨'
    };

    const getMetricBorderStyle = (severity) => ({
        borderColor: severityBorderColors[severity],
        boxShadow: `0 0 12px ${severityBorderColors[severity]}33`
    });

    return (
        <div className="location-fetcher">
            {/* GPS / Auto-detect Button */}
            <div className="fetch-card glass-card">
                <div className="fetch-header">
                    <h2 className="fetch-title">📍 Detect Your Climate</h2>
                    <p className="fetch-subtitle">
                        Auto-detect your location to fetch real-time weather, air quality, UV index, and wind data
                    </p>
                </div>

                <button
                    className="fetch-btn"
                    onClick={detectLocation}
                    disabled={isLoading}
                >
                    {fetchStatus === 'locating' && (
                        <><span className="fetch-spinner"></span> Detecting location...</>
                    )}
                    {fetchStatus === 'fetching' && (
                        <><span className="fetch-spinner"></span> Fetching weather data...</>
                    )}
                    {(fetchStatus === 'idle' || fetchStatus === 'done') && (
                        <>
                            <span className="fetch-btn-icon">🌍</span>
                            {fetchStatus === 'done' ? 'Refresh Data' : 'Detect My Location'}
                        </>
                    )}
                </button>

                {/* Manual city search */}
                <div className={`city-search ${showManual ? 'highlighted' : ''}`}>
                    <p className="city-search-label">
                        {showManual ? '👇 Search your city instead:' : 'Or search by city name:'}
                    </p>
                    <form className="city-search-form" onSubmit={searchByCity}>
                        <input
                            type="text"
                            className="city-input"
                            placeholder="e.g. Mumbai, Delhi, London..."
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                        />
                        <button type="submit" className="city-btn" disabled={isLoading || !citySearch.trim()}>
                            Search
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="fetch-error">
                        <span>⚠️</span> {error}
                    </div>
                )}
            </div>

            {/* Weather Data Display with Severity-Colored Borders */}
            {weatherData && (
                <div className="weather-display animate-fade-in-up">
                    <div className="weather-location">
                        <span className="weather-city">{weatherData.city}, {weatherData.country}</span>
                        <span className="weather-desc">{weatherData.description}</span>
                    </div>

                    <div className="weather-metrics">
                        <div
                            className="metric-card glass-card"
                            style={getMetricBorderStyle(getTempSeverity(weatherData.temperature))}
                        >
                            <span className="metric-icon">🌡️</span>
                            <span className="metric-value">{weatherData.temperature}°C</span>
                            <span className="metric-label">Temperature</span>
                            <span className="metric-extra">Feels like {weatherData.feelsLike}°C</span>
                        </div>

                        <div
                            className="metric-card glass-card"
                            style={getMetricBorderStyle(getAqiSeverity(weatherData.aqi))}
                        >
                            <span className="metric-icon">😷</span>
                            <span className="metric-value">{weatherData.aqi}</span>
                            <span className="metric-label">Air Quality</span>
                            <span className="metric-extra">US AQI Scale</span>
                        </div>

                        <div
                            className="metric-card glass-card"
                            style={getMetricBorderStyle(getUvSeverity(weatherData.uvIndex))}
                        >
                            <span className="metric-icon">☀️</span>
                            <span className="metric-value">{weatherData.uvIndex}</span>
                            <span className="metric-label">UV Index</span>
                            <span className="metric-extra">{weatherData.uvIndex <= 2 ? 'Low' : weatherData.uvIndex <= 5 ? 'Moderate' : weatherData.uvIndex <= 7 ? 'High' : 'Very High'}</span>
                        </div>

                        <div
                            className="metric-card glass-card"
                            style={getMetricBorderStyle(getWindSeverity(weatherData.windSpeed))}
                        >
                            <span className="metric-icon">💨</span>
                            <span className="metric-value">{weatherData.windSpeed}</span>
                            <span className="metric-label">Wind (km/h)</span>
                            <span className="metric-extra">{weatherData.windSpeed < 20 ? 'Calm' : weatherData.windSpeed < 40 ? 'Breezy' : 'Strong'}</span>
                        </div>

                        <div className="metric-card glass-card">
                            <span className="metric-icon">{weatherIcons[weatherData.weather] || '⛅'}</span>
                            <span className="metric-value capitalize">{weatherData.weather}</span>
                            <span className="metric-label">Condition</span>
                            <span className="metric-extra">💧 {weatherData.humidity}% humidity</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
