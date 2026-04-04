import './ForecastStrip.css';

const weatherIcons = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    drizzle: '🌦️',
    storm: '⛈️',
    snow: '🌨️',
    fog: '🌫️',
    hail: '🧊',
    dust: '🏜️',
    sand: '🏜️',
    tornado: '🌪️',
    squall: '💨'
};

export default function ForecastStrip({ forecast }) {
    if (!forecast || forecast.length === 0) return null;

    return (
        <div className="forecast-strip">
            <div className="forecast-header">
                <h3 className="forecast-title">📅 5-Day Forecast</h3>
                <span className="forecast-label">Upcoming Weather</span>
            </div>

            <div className="forecast-scroll">
                {forecast.map((day, idx) => (
                    <div className="forecast-card glass-card" key={idx}>
                        <span className="forecast-day">{day.dayName}</span>
                        <span className="forecast-icon">
                            {weatherIcons[day.condition] || '⛅'}
                        </span>
                        <div className="forecast-temps">
                            <span className="forecast-high">{day.tempHigh}°</span>
                            <span className="forecast-low">{day.tempLow}°</span>
                        </div>
                        <span className="forecast-condition">{day.conditionLabel}</span>
                        <span className="forecast-wind">💨 {day.windSpeed} km/h</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
