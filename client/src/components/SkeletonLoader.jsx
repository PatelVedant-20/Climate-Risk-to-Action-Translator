import './SkeletonLoader.css';

export function MetricSkeleton() {
    return (
        <div className="skeleton-container">
            <div className="skeleton-metrics">
                {[...Array(5)].map((_, i) => (
                    <div className="skeleton-metric-card" key={i}>
                        <div className="skeleton-circle"></div>
                        <div className="skeleton-line lg"></div>
                        <div className="skeleton-line md"></div>
                        <div className="skeleton-line sm"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AdviceSkeleton() {
    return (
        <div className="skeleton-container">
            <div className="skeleton-advice-grid">
                {[...Array(3)].map((_, i) => (
                    <div className="skeleton-advice-card" key={i}>
                        <div className="skeleton-advice-header">
                            <div className="skeleton-circle"></div>
                            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                <div className="skeleton-badge"></div>
                                <div className="skeleton-badge"></div>
                            </div>
                        </div>
                        <div className="skeleton-line full" style={{ height: '16px' }}></div>
                        <div className="skeleton-text-block">
                            <div className="skeleton-line full"></div>
                            <div className="skeleton-line three-quarter"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
