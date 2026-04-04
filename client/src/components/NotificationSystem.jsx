import { useState, useEffect, useCallback, useRef } from 'react';
import './NotificationSystem.css';

// ── Severity thresholds for triggering notifications ──────────
const HARSH_CONDITIONS = {
  temperature: {
    check: (val) => val >= 42 || val <= -10,
    label: 'Extreme Temperature',
    getMsg: (val) => val >= 42
      ? `🌡️ Dangerous heat: ${val}°C! Stay indoors, hydrate, avoid sun exposure.`
      : `🥶 Extreme cold: ${val}°C! Layer up, risk of hypothermia and frostbite.`
  },
  aqi: {
    check: (val) => val > 150,
    label: 'Hazardous Air Quality',
    getMsg: (val) => val > 300
      ? `☠️ Hazardous air quality (AQI ${val})! Avoid all outdoor activity. Use air purifiers.`
      : `😷 Unhealthy air quality (AQI ${val})! Wear N95 mask outdoors, limit exposure.`
  },
  uvIndex: {
    check: (val) => val >= 8,
    label: 'Very High UV',
    getMsg: (val) => val >= 11
      ? `☀️ Extreme UV index (${val})! Severe sunburn risk. Stay indoors if possible.`
      : `🧴 Very high UV index (${val})! Apply SPF 50+, wear protective clothing.`
  },
  windSpeed: {
    check: (val) => val >= 50,
    label: 'Dangerous Wind',
    getMsg: (val) => val >= 90
      ? `🌪️ Hurricane-force winds (${val} km/h)! Take shelter immediately!`
      : `💨 Dangerous winds (${val} km/h)! Secure objects, avoid open areas.`
  },
  weather: {
    check: (val) => ['storm', 'tornado', 'hail'].includes(val),
    label: 'Severe Weather',
    getMsg: (val) => {
      const msgs = {
        storm: '⛈️ Severe storm alert! Seek shelter, avoid metal objects and tall trees.',
        tornado: '🌪️ Tornado warning! Move to interior room on lowest floor immediately!',
        hail: '🧊 Hail storm detected! Stay indoors, protect vehicles and property.'
      };
      return msgs[val] || `⚠️ Severe weather condition: ${val}`;
    }
  }
};

// ── Request browser notification permission ───────────────────
async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

// ── Send a browser notification ───────────────────────────────
function sendBrowserNotification(title, body, icon = '⚠️') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/images/hero-earth.png',
      badge: '/images/hero-earth.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'climate-alert',
      renotify: true,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 15 seconds
    setTimeout(() => notification.close(), 15000);
  } catch {
    // Service worker notification fallback for mobile
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, { body, vibrate: [200, 100, 200] });
      });
    }
  }
}

// ── In-app toast notification queue ───────────────────────────
export function useNotifications() {
  const [toasts, setToasts] = useState([]);
  const [permissionState, setPermissionState] = useState('default');
  const toastIdRef = useRef(0);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    } else {
      setPermissionState('unsupported');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermissionState(result);
    return result;
  }, []);

  const addToast = useCallback((toast) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { ...toast, id }]);
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 8000);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const checkAndNotify = useCallback((weatherData) => {
    if (!weatherData) return;

    const alerts = [];

    for (const [key, config] of Object.entries(HARSH_CONDITIONS)) {
      const value = weatherData[key];
      if (value !== undefined && value !== null && value !== '' && config.check(value)) {
        alerts.push({
          type: key,
          label: config.label,
          message: config.getMsg(value),
          severity: getSeverityLevel(key, value)
        });
      }
    }

    if (alerts.length === 0) return;

    // Send browser notifications
    if (permissionState === 'granted') {
      const criticalAlert = alerts.sort((a, b) => b.severity - a.severity)[0];
      sendBrowserNotification(
        `🚨 ${criticalAlert.label} Alert`,
        criticalAlert.message
      );
    }

    // Show in-app toasts for all alerts
    alerts.forEach((alert) => {
      addToast({
        type: alert.type,
        label: alert.label,
        message: alert.message,
        severity: alert.severity >= 3 ? 'extreme' : 'high'
      });
    });
  }, [permissionState, addToast]);

  return {
    toasts,
    permissionState,
    requestPermission,
    checkAndNotify,
    dismissToast
  };
}

function getSeverityLevel(key, value) {
  switch (key) {
    case 'temperature': return (value >= 45 || value <= -15) ? 4 : 3;
    case 'aqi': return value > 300 ? 4 : 3;
    case 'uvIndex': return value >= 11 ? 4 : 3;
    case 'windSpeed': return value >= 90 ? 4 : 3;
    case 'weather': return value === 'tornado' ? 4 : 3;
    default: return 3;
  }
}

// ── Toast Container Component ─────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="notification-toasts">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-notification toast-${toast.severity}`}
        >
          <div className="toast-pulse-ring" />
          <div className="toast-content">
            <div className="toast-header">
              <span className="toast-alert-icon">🚨</span>
              <span className="toast-label">{toast.label}</span>
              <button
                className="toast-close"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p className="toast-message">{toast.message}</p>
          </div>
          <div className="toast-timer" />
        </div>
      ))}
    </div>
  );
}

// ── Notification Permission Button ────────────────────────────
export function NotificationToggle({ permissionState, onRequest }) {
  if (permissionState === 'unsupported') return null;

  return (
    <button
      className={`notification-toggle ${permissionState === 'granted' ? 'enabled' : ''}`}
      onClick={onRequest}
      title={
        permissionState === 'granted'
          ? 'Notifications enabled'
          : permissionState === 'denied'
            ? 'Notifications blocked — enable in browser settings'
            : 'Enable climate alerts'
      }
      id="notification-toggle-btn"
    >
      <span className="notif-icon">
        {permissionState === 'granted' ? '🔔' : '🔕'}
      </span>
      <span className="notif-text">
        {permissionState === 'granted'
          ? 'Alerts On'
          : permissionState === 'denied'
            ? 'Blocked'
            : 'Enable Alerts'}
      </span>
      {permissionState === 'granted' && <span className="notif-active-dot" />}
    </button>
  );
}
