import { useState, useEffect } from 'react';
import './HeroSection.css';

const heroSlides = [
  {
    image: '/images/hero-earth.png',
    title: 'Protecting Our Planet',
    subtitle: 'Real-time climate intelligence for a safer tomorrow'
  },
  {
    image: '/images/climate-forest.png',
    title: 'Preserving Ecosystems',
    subtitle: 'Understanding environmental risks to take meaningful action'
  },
  {
    image: '/images/climate-arctic.png',
    title: 'Climate Awareness',
    subtitle: 'Monitoring the pulse of our changing world'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 600);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="hero-section" id="hero">
      {/* Background image slideshow */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}
      <div className="hero-overlay" />

      {/* Floating particles */}
      <div className="hero-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className={`hero-content ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="hero-badge animate-fade-in-up">
          <span className="hero-badge-dot" />
          <span>Live Climate Monitoring</span>
        </div>

        <h1 className="hero-title">
          Climate Risk <span className="hero-gradient-text">to Action</span>
        </h1>

        <p className="hero-subtitle">{slide.subtitle}</p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">5</span>
            <span className="hero-stat-label">Climate Metrics</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-number">24/7</span>
            <span className="hero-stat-label">Real-time Data</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-number">AI</span>
            <span className="hero-stat-label">Powered Advice</span>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-indicator ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSlide(idx);
                  setIsTransitioning(false);
                }, 300);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint">
        <span>Scroll to explore</span>
        <div className="hero-scroll-arrow" />
      </div>
    </section>
  );
}
