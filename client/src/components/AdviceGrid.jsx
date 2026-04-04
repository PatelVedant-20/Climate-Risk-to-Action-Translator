import AdviceCard from './AdviceCard';
import './AdviceGrid.css';

export default function AdviceGrid({ adviceList, isVisible }) {
    if (!isVisible) return null;

    if (adviceList.length === 0) {
        return (
            <div className="advice-grid-container animate-fade-in-up">
                <div className="advice-empty glass-card">
                    <span className="empty-icon">✅</span>
                    <h3>All Clear!</h3>
                    <p>No significant climate risks detected for the given conditions. Stay safe!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="advice-grid-container animate-fade-in-up">
            <div className="advice-grid-header">
                <h2 className="advice-grid-title">
                    🎯 Your Action Plan
                </h2>
                <span className="advice-count">{adviceList.length} recommendation{adviceList.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="advice-grid">
                {adviceList.map((item, idx) => (
                    <AdviceCard key={idx} advice={item} index={idx} />
                ))}
            </div>
        </div>
    );
}
