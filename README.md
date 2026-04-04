# 🌿 Climate Risk to Action

> **Real-time climate intelligence that translates environmental data into actionable safety advice for your location.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?logo=icloud&logoColor=white)](https://openweathermap.org/api)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

**Climate Risk to Action** is a full-stack web application that monitors real-time climate conditions at your location and provides personalized, actionable safety advice. It combines live weather data from the OpenWeatherMap API with a rule-based advice engine backed by MongoDB to deliver severity-rated recommendations covering temperature, air quality, UV exposure, wind speed, and weather conditions.

The application automatically detects the user's location via GPS or IP-based geolocation, fetches current environmental data, and matches it against a comprehensive set of climate safety rules to generate context-aware advice — ranging from "enjoy the outdoors" to "seek shelter immediately."

---

## ✨ Features

### 🔍 Real-Time Climate Monitoring
- **Auto-detect location** via browser GPS with IP-based fallback
- **City search** for manual location lookup using OpenWeatherMap geocoding
- **Live weather data**: temperature, feels-like, humidity, weather condition
- **Air Quality Index (AQI)** mapped to US AQI scale
- **UV Index** with real UV data (One Call API 3.0) and cloud-based estimation fallback
- **Wind speed** in km/h with severity classification

### 🧠 Intelligent Advice Engine
- **Rule-based system** with 28+ climate safety rules stored in MongoDB
- **5 categories**: Temperature, AQI, UV Index, Wind Speed, Weather Conditions
- **4 severity levels**: Low → Moderate → High → Extreme
- **Automatic matching** of current conditions against all rules
- **Sorted results** with highest severity first

### 📊 5-Day Weather Forecast
- Daily forecast strip showing high/low temperatures
- Dominant weather condition per day
- Average wind speed projections

### 🔔 Smart Notifications
- **Browser push notifications** for harsh climate conditions
- **In-app toast notifications** with severity-based styling
- Permission management with user-friendly prompts

### 🎨 Modern UI/UX
- **Immersive hero section** with climate-themed imagery slideshow
- **Climate awareness showcase** section
- **Glassmorphism design** with frosted-glass cards
- **Severity-colored metric borders** (green → yellow → orange → red)
- **Skeleton loaders** for smooth loading states
- **Dark theme** with environmental green palette
- **Responsive design** for all screen sizes
- **Smooth animations** and micro-interactions

### 📜 Query History
- Logs all climate lookups to MongoDB
- Displays recent 20 queries with timestamps and severity

### ⚡ Performance & Resilience
- **In-memory caching** with 5-minute TTL on weather data
- **Rate limiting** (100 requests per 15 minutes per IP)
- **Input validation** on all API endpoints
- **Error boundaries** for graceful failure handling
- **Parallel API calls** for weather + forecast + AQI

---

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| **Frontend** | React 19.2, Vite 7.3, Vanilla CSS                          |
| **Backend**  | Node.js, Express 5, Mongoose 9                              |
| **Database** | MongoDB                                                     |
| **APIs**     | OpenWeatherMap (Weather, AQI, UV, Forecast, Geocoding)      |
| **Other**    | Axios, express-rate-limit, dotenv, CORS                     |

---

## 📁 Project Structure

```
Climate Risk to Action/
├── client/                          # React frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images & media
│   │   ├── components/
│   │   │   ├── Header.jsx           # Sticky frosted-glass navbar
│   │   │   ├── Header.css
│   │   │   ├── HeroSection.jsx      # Hero slideshow section
│   │   │   ├── HeroSection.css
│   │   │   ├── ClimateShowcase.jsx   # Climate awareness cards
│   │   │   ├── ClimateShowcase.css
│   │   │   ├── LocationFetcher.jsx   # GPS/IP/city location + weather display
│   │   │   ├── LocationFetcher.css
│   │   │   ├── ForecastStrip.jsx     # 5-day forecast strip
│   │   │   ├── ForecastStrip.css
│   │   │   ├── AdviceCard.jsx        # Individual advice card
│   │   │   ├── AdviceCard.css
│   │   │   ├── AdviceGrid.jsx        # Grid layout for advice cards
│   │   │   ├── AdviceGrid.css
│   │   │   ├── HistoryPanel.jsx      # Recent query history
│   │   │   ├── HistoryPanel.css
│   │   │   ├── NotificationSystem.jsx # Push + toast notifications
│   │   │   ├── NotificationSystem.css
│   │   │   ├── SkeletonLoader.jsx    # Loading skeleton components
│   │   │   ├── SkeletonLoader.css
│   │   │   ├── ErrorBoundary.jsx     # React error boundary
│   │   │   └── ClimateForm.jsx       # Manual input form (legacy)
│   │   ├── App.jsx                   # Main application component
│   │   ├── App.css                   # App-level styles
│   │   ├── index.css                 # Global styles & design tokens
│   │   └── main.jsx                  # React entry point
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── package.json
│   └── .env                         # Client environment variables
│
├── server/                          # Express backend
│   ├── models/
│   │   ├── Rule.js                  # Climate rule schema
│   │   └── History.js               # Query history schema
│   ├── routes/
│   │   ├── weather.js               # Weather, forecast & geocoding routes
│   │   └── advice.js                # Advice matching & history routes
│   ├── index.js                     # Express app entry point
│   ├── seed.js                      # Database seeding script
│   ├── package.json
│   └── .env                         # Server environment variables
│
└── README.md                        # This file
```

---

## 📌 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** (comes with Node.js)
- **OpenWeatherMap API Key** — [Get free key](https://openweathermap.org/api)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/climate-risk-to-action.git
cd climate-risk-to-action
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Configure Environment Variables

See the [Environment Variables](#-environment-variables) section below.

### 4. Seed the Database

```bash
cd server
node seed.js
```

### 5. Start the Application

```bash
# Terminal 1 — Start backend
cd server
node index.js

# Terminal 2 — Start frontend
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable          | Description                          | Example                                     |
|-------------------|--------------------------------------|---------------------------------------------|
| `MONGO_URI`       | MongoDB connection string            | `mongodb://localhost:27017/climate-risk`     |
| `PORT`            | Server port                          | `5000`                                      |
| `OPENWEATHER_KEY` | OpenWeatherMap API key               | `your_api_key_here`                         |

```env
MONGO_URI=mongodb://localhost:27017/climate-risk
PORT=5000
OPENWEATHER_KEY=your_openweathermap_api_key
```

### Client (`client/.env`)

| Variable       | Description           | Example                          |
|----------------|-----------------------|----------------------------------|
| `VITE_API_URL` | Backend API base URL  | `http://localhost:5000/api`      |

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌱 Database Seeding

The `seed.js` script populates MongoDB with **28+ climate safety rules** across 5 categories:

| Category        | Rules | Severity Range       |
|-----------------|-------|----------------------|
| Temperature     | 7     | Low → Extreme        |
| Air Quality     | 4     | Low → Extreme        |
| UV Index        | 4     | Low → Extreme        |
| Wind Speed      | 4     | Low → Extreme        |
| Weather Cond.   | 11    | Low → Extreme        |

```bash
cd server
node seed.js
```

**Output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing rules
✅ Seeded 30 rules successfully
👋 Disconnected from MongoDB
```

> ⚠️ Running seed.js clears all existing rules before inserting fresh data.

---

## ▶️ Running the Application

### Development Mode

```bash
# Terminal 1 — Backend (port 5000)
cd server
node index.js

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### Production Build

```bash
cd client
npm run build
npm run preview
```

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-03T18:42:00.000Z"
}
```

---

### Get Current Weather

```
GET /api/weather?lat={latitude}&lon={longitude}
```

**Query Parameters:**

| Param | Type   | Required | Description          |
|-------|--------|----------|----------------------|
| `lat` | number | ✅       | Latitude coordinate  |
| `lon` | number | ✅       | Longitude coordinate |

**Response:**
```json
{
  "city": "Mumbai",
  "country": "IN",
  "temperature": 32,
  "feelsLike": 36,
  "humidity": 70,
  "windSpeed": 15,
  "weather": "clouds",
  "description": "scattered clouds",
  "aqi": 125,
  "uvIndex": 7
}
```

---

### Get 5-Day Forecast

```
GET /api/weather/forecast?lat={latitude}&lon={longitude}
```

**Response:**
```json
[
  {
    "date": "2026-04-04",
    "dayName": "Sat",
    "tempHigh": 35,
    "tempLow": 27,
    "condition": "clouds",
    "conditionLabel": "Clouds",
    "windSpeed": 12,
    "icon": "04d"
  }
]
```

---

### Geocode City Name

```
GET /api/weather/geocode?city={city_name}
```

**Query Parameters:**

| Param  | Type   | Required | Description |
|--------|--------|----------|-------------|
| `city` | string | ✅       | City name   |

**Response:**
```json
{
  "lat": 19.0760,
  "lon": 72.8777,
  "name": "Mumbai",
  "country": "IN"
}
```

---

### Get Climate Advice

```
POST /api/advice
Content-Type: application/json
```

**Request Body:**
```json
{
  "temperature": 38,
  "aqi": 150,
  "uvIndex": 8,
  "windSpeed": 25,
  "weather": "clear"
}
```

**Response:**
```json
{
  "advice": [
    {
      "category": "uvIndex",
      "severity": "extreme",
      "title": "Very High UV — Avoid Midday Sun",
      "advice": "Extreme burn risk! Avoid direct sun from 10 AM – 4 PM...",
      "icon": "☢️"
    },
    {
      "category": "temperature",
      "severity": "high",
      "title": "Heat Warning",
      "advice": "High risk of heatstroke...",
      "icon": "🔥"
    }
  ],
  "count": 5
}
```

---

### Get Query History

```
GET /api/advice/history
```

**Response:** Array of recent 20 lookups with inputs, advice count, and severity.

---

## 🏗️ Architecture

```
┌────────────────────────────┐
│       React Frontend       │
│  (Vite + React 19)        │
│                            │
│  ┌──────────────────────┐  │
│  │  LocationFetcher     │  │  GPS / IP / City Search
│  │  (Auto-detect)       │──│──────────────────────────┐
│  └──────────────────────┘  │                          │
│  ┌──────────────────────┐  │                          ▼
│  │  Metric Cards        │  │              ┌───────────────────┐
│  │  (Severity-colored)  │  │              │  Express Backend  │
│  └──────────────────────┘  │              │  (Port 5000)      │
│  ┌──────────────────────┐  │              │                   │
│  │  AdviceGrid          │  │◄────────────►│  ┌─────────────┐  │
│  │  ForecastStrip       │  │   REST API   │  │ /api/weather │──│──► OpenWeatherMap API
│  │  HistoryPanel        │  │              │  │ /api/advice  │  │    (Weather, AQI, UV,
│  └──────────────────────┘  │              │  │ /api/health  │  │     Forecast, Geocoding)
│  ┌──────────────────────┐  │              │  └─────────────┘  │
│  │  NotificationSystem  │  │              │         │         │
│  │  (Push + Toast)      │  │              │         ▼         │
│  └──────────────────────┘  │              │  ┌─────────────┐  │
└────────────────────────────┘              │  │  MongoDB     │  │
                                            │  │  - Rules     │  │
                                            │  │  - History   │  │
                                            │  └─────────────┘  │
                                            │                   │
                                            │  ⚡ Rate Limiting  │
                                            │  📦 In-Memory Cache│
                                            │  ✅ Input Validation│
                                            └───────────────────┘
```

### Data Flow

1. **User opens app** → Hero section + climate showcase load
2. **User clicks "Detect My Location"** → GPS/IP geolocation → coordinates obtained
3. **Frontend sends coordinates** → `GET /api/weather?lat=&lon=` + `GET /api/weather/forecast?lat=&lon=`
4. **Backend fetches from OpenWeatherMap** → Current weather + AQI + UV + Forecast
5. **Frontend displays metrics** with severity-colored borders
6. **Frontend sends climate data** → `POST /api/advice` with temperature, AQI, UV, wind, weather
7. **Backend matches rules** from MongoDB → Returns sorted advice (extreme first)
8. **Frontend renders** advice cards + forecast strip + push/toast notifications for harsh conditions
9. **History saved** to MongoDB → Shown in History panel

---

## 🖼️ Screenshots

> Add screenshots of your running application here.

| Section | Description |
|---------|-------------|
| **Hero** | Full-screen climate-themed slideshow with call-to-action |
| **Climate Showcase** | Awareness cards about climate topics |
| **Location Detection** | GPS auto-detect with city search fallback |
| **Metric Dashboard** | Severity-colored cards for temp, AQI, UV, wind |
| **Advice Grid** | Severity-sorted actionable safety recommendations |
| **5-Day Forecast** | Daily weather forecast strip |
| **History Panel** | Recent query log with severity badges |

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Guidelines
- Follow existing code style and naming conventions
- Add appropriate comments for complex logic
- Test your changes before submitting
- Update the README if adding new features

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) — Weather, AQI, UV, and Forecast APIs
- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Frontend build tool
- [MongoDB](https://www.mongodb.com/) — Database
- [Express](https://expressjs.com/) — Backend framework

---

<div align="center">

**Built with 💚 for the planet**

🌿 *Climate Risk to Action — Turning real-time data into life-saving decisions*

</div>
