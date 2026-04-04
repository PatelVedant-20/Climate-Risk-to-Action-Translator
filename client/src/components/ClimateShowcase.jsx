import { useState, useEffect, useRef } from 'react';
import './ClimateShowcase.css';

const showcaseItems = [
  {
    image: '/images/climate-forest.png',
    title: 'Forest Ecosystems',
    description: 'Forests absorb 2.6 billion tonnes of CO₂ annually — nearly 30% of human emissions. Monitoring temperature and air quality helps protect these vital carbon sinks.',
    stat: '30%',
    statLabel: 'CO₂ absorbed by forests',
    icon: '🌲'
  },
  {
    image: '/images/climate-ocean.png',
    title: 'Ocean Health',
    description: 'Oceans have absorbed 90% of excess heat from global warming. Rising sea temperatures affect marine ecosystems, weather patterns, and billions of people.',
    stat: '90%',
    statLabel: 'Excess heat absorbed',
    icon: '🌊'
  },
  {
    image: '/images/climate-impact.png',
    title: 'Climate Resilience',
    description: 'Extreme weather events have increased 5x in the last 50 years. Real-time monitoring and early warning systems save lives and livelihoods.',
    stat: '5×',
    statLabel: 'Increase in extreme events',
    icon: '🛡️'
  },
  {
    image: '/images/climate-city.png',
    title: 'Sustainable Future',
    description: 'Cities generate over 70% of global CO₂ emissions. Green infrastructure and climate-smart planning can reduce urban vulnerability significantly.',
    stat: '70%',
    statLabel: 'Emissions from cities',
    icon: '🏙️'
  }
];

export default function ClimateShowcase() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = document.querySelectorAll('.showcase-card');
    cards.forEach((card) => observerRef.current.observe(card));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="climate-showcase" id="climate-awareness">
      <div className="showcase-header">
        <span className="showcase-label">Why It Matters</span>
        <h2 className="showcase-title">
          Understanding <span className="gradient-text">Climate Risks</span>
        </h2>
        <p className="showcase-subtitle">
          Climate change affects every corner of our planet. Stay informed, take action, and be part of the solution.
        </p>
      </div>

      <div className="showcase-grid">
        {showcaseItems.map((item, idx) => (
          <div
            key={idx}
            className={`showcase-card ${visibleCards.has(idx) ? 'visible' : ''}`}
            data-index={idx}
            style={{ transitionDelay: `${idx * 0.15}s` }}
          >
            <div className="showcase-image-wrap">
              <img
                src={item.image}
                alt={item.title}
                className="showcase-image"
                loading="lazy"
              />
              <div className="showcase-image-overlay" />
              <div className="showcase-stat-badge">
                <span className="showcase-stat-number">{item.stat}</span>
                <span className="showcase-stat-label">{item.statLabel}</span>
              </div>
            </div>

            <div className="showcase-card-body">
              <div className="showcase-card-icon">{item.icon}</div>
              <h3 className="showcase-card-title">{item.title}</h3>
              <p className="showcase-card-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
