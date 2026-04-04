import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ClimateShowcase from './components/ClimateShowcase';
import LocationFetcher from './components/LocationFetcher';
import ForecastStrip from './components/ForecastStrip';
import AdviceGrid from './components/AdviceGrid';
import HistoryPanel from './components/HistoryPanel';
import { MetricSkeleton, AdviceSkeleton } from './components/SkeletonLoader';
import { useNotifications, ToastContainer } from './components/NotificationSystem';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [adviceList, setAdviceList] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // Notification system
  const { toasts, permissionState, requestPermission, checkAndNotify, dismissToast } = useNotifications();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/advice/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.log('History fetch skipped:', err.message);
    }
  };

  const handleDataFetched = async (climateData, forecastData) => {
    setError(null);
    setShowResults(false);

    // Check for harsh conditions and send notifications
    checkAndNotify(climateData);

    try {
      const res = await fetch(`${API_URL}/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(climateData)
      });

      if (!res.ok) throw new Error('Failed to get advice');

      const data = await res.json();
      setAdviceList(data.advice);
      setForecast(forecastData || []);
      setShowResults(true);

      fetchHistory();
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running on port 5000.');
      console.error('API Error:', err);
    }
  };

  return (
    <div className="app">
      <Header
        permissionState={permissionState}
        onRequestPermission={requestPermission}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <HeroSection />

      <main className="main-content" id="monitor">
        {/* Climate Awareness Section */}
        <ClimateShowcase />

        {/* Divider */}
        <div className="section-divider">
          <div className="divider-line" />
          <span className="divider-label">Monitor Your Climate</span>
          <div className="divider-line" />
        </div>

        <LocationFetcher
          onDataFetched={handleDataFetched}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Skeleton Loading States */}
        {isLoading && (
          <>
            <MetricSkeleton />
            <AdviceSkeleton />
          </>
        )}

        {error && (
          <div className="error-banner animate-fade-in-up">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <ForecastStrip forecast={showResults ? forecast : []} />

        <AdviceGrid adviceList={adviceList} isVisible={showResults} />

        <HistoryPanel history={history} />
      </main>

      <footer className="footer" id="app-footer">
        <div className="footer-bg-image" />
        <div className="footer-content-wrap">
          <div className="footer-brand">
            <span className="footer-logo">🌿</span>
            <span className="footer-brand-text">Climate Risk to Action</span>
          </div>
          <p className="footer-tagline">Protecting you and the planet through real-time climate intelligence</p>

          <div className="footer-links">
            <a href="#hero" className="footer-link">Home</a>
            <a href="#climate-awareness" className="footer-link">Awareness</a>
            <a href="#monitor" className="footer-link">Monitor</a>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Climate Risk to Action</span>
            <span className="footer-built">Built with 💚 for the planet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
