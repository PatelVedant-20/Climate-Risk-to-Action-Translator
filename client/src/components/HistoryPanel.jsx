import { useState } from 'react';
import './HistoryPanel.css';

const severityColors = {
    low: 'var(--severity-low)',
    moderate: 'var(--severity-moderate)',
    high: 'var(--severity-high)',
    extreme: 'var(--severity-extreme)'
};

export default function HistoryPanel({ history }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!history || history.length === 0) return null;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className={`history-panel ${isOpen ? 'open' : ''}`}>
            <button
                className="history-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="history-toggle-icon">📋</span>
                <span>Recent Lookups</span>
                <span className="history-count">{history.length}</span>
                <span className={`history-chevron ${isOpen ? 'rotated' : ''}`}>▾</span>
            </button>

            {isOpen && (
                <div className="history-list animate-fade-in">
                    {history.map((entry, idx) => (
                        <div key={idx} className="history-item glass-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="history-item-header">
                                <span className="history-time">{formatTime(entry.timestamp)}</span>
                                <span
                                    className="history-severity-dot"
                                    style={{ background: severityColors[entry.highestSeverity] || severityColors.low }}
                                    title={`Highest severity: ${entry.highestSeverity}`}
                                ></span>
                            </div>
                            <div className="history-inputs">
                                {entry.inputs.temperature !== undefined && entry.inputs.temperature !== '' && entry.inputs.temperature !== null && (
                                    <span className="history-tag">🌡️ {entry.inputs.temperature}°C</span>
                                )}
                                {entry.inputs.aqi !== undefined && entry.inputs.aqi !== '' && entry.inputs.aqi !== null && (
                                    <span className="history-tag">😷 AQI {entry.inputs.aqi}</span>
                                )}
                                {entry.inputs.uvIndex !== undefined && entry.inputs.uvIndex !== '' && entry.inputs.uvIndex !== null && (
                                    <span className="history-tag">☀️ UV {entry.inputs.uvIndex}</span>
                                )}
                                {entry.inputs.windSpeed !== undefined && entry.inputs.windSpeed !== '' && entry.inputs.windSpeed !== null && (
                                    <span className="history-tag">💨 {entry.inputs.windSpeed} km/h</span>
                                )}
                                {entry.inputs.weather && (
                                    <span className="history-tag">⛅ {entry.inputs.weather}</span>
                                )}
                            </div>
                            <div className="history-footer">
                                <span className="history-advice-count">{entry.adviceCount} alert{entry.adviceCount !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
