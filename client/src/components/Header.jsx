import { useState, useEffect } from 'react';
import { NotificationToggle } from './NotificationSystem';
import './Header.css';

export default function Header({ permissionState, onRequestPermission }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-header ${scrolled ? 'scrolled' : ''}`} id="main-nav">
      <div className="nav-content">
        <a href="#hero" className="nav-brand">
          <div className="nav-logo">
            <span className="nav-logo-icon">🌿</span>
            <div className="nav-logo-glow" />
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-name">Climate Risk</span>
            <span className="nav-brand-accent">to Action</span>
          </div>
        </a>

        <div className="nav-links">
          <a href="#climate-awareness" className="nav-link">
            <span className="nav-link-icon">🌍</span>
            <span>Awareness</span>
          </a>
          <a href="#monitor" className="nav-link">
            <span className="nav-link-icon">📊</span>
            <span>Monitor</span>
          </a>

          <NotificationToggle
            permissionState={permissionState}
            onRequest={onRequestPermission}
          />

          <div className="nav-status">
            <span className="nav-status-dot" />
            <span className="nav-status-text">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
