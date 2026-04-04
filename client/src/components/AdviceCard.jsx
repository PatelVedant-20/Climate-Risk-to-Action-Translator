import './AdviceCard.css';

const severityConfig = {
    low: { label: 'Low Risk', className: 'severity-low' },
    moderate: { label: 'Moderate', className: 'severity-moderate' },
    high: { label: 'High Risk', className: 'severity-high' },
    extreme: { label: 'Extreme', className: 'severity-extreme' }
};

const categoryLabels = {
    aqi: 'Air Quality',
    temperature: 'Temperature',
    uvIndex: 'UV Index',
    windSpeed: 'Wind',
    weather: 'Weather'
};

export default function AdviceCard({ advice, index }) {
    const config = severityConfig[advice.severity] || severityConfig.low;
    const categoryLabel = categoryLabels[advice.category] || advice.category;

    return (
        <div
            className={`advice-card glass-card ${config.className}`}
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <div className="advice-card-header">
                <span className="advice-icon">{advice.icon}</span>
                <div className="advice-badges">
                    <span className="advice-category">{categoryLabel}</span>
                    <span className={`advice-severity ${config.className}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            <h3 className="advice-title">{advice.title}</h3>
            <p className="advice-text">{advice.advice}</p>

            <div className={`advice-indicator ${config.className}`}></div>
        </div>
    );
}
