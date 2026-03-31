import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HeroSlider from './components/HeroSlider';

// ============================================================
// 🔑 CONFIGURATION
// Replace 'YOUR_API_KEY' with your OpenWeatherMap key
// ============================================================
const API_KEY = 'YOUR_API_KEY_HERE'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Core Fetch Function
   * Works for both City names and Coordinates
   */
  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${BASE_URL}?appid=${API_KEY}&units=metric&`;
      
      // Determine if query is coordinates or city name
      if (typeof query === 'object') {
        url += `lat=${query.lat}&lon=${query.lon}`;
      } else {
        url += `q=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error("City not found. Please try again.");
        if (response.status === 401) throw new Error("Invalid API Key. Please check App.js.");
        throw new Error("Could not fetch data. Try again later.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bonus: Load Default City (Pune) on Start
   */
  useEffect(() => {
    fetchWeather('Pune');
  }, []);

  /**
   * Feature: Browser Geolocation
   */
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather({ lat: latitude, lon: longitude });
      },
      () => setError("Location access denied.")
    );
  };

  /**
   * UI: Dynamic Background Calculator
   */
  const getBackgroundClass = () => {
    if (!weather) return 'bg-default';
    const temp = weather.main.temp;
    if (temp < 10) return 'bg-blue';   // Cold
    if (temp <= 25) return 'bg-green'; // Pleasant
    if (temp <= 35) return 'bg-orange'; // Warm
    return 'bg-red';                  // Hot
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <header className="navbar">
        <div className="logo">🏙️ SmartCity<span>Weather</span></div>
        <button className="geo-btn" onClick={handleAutoLocation} title="Use My Location">
          📍 Detect Location
        </button>
      </header>

      {/* Sliding Feature requested - Hero Section */}
      <HeroSlider />

      <main className="content">
        <SearchBar onSearch={fetchWeather} isLoading={loading} />

        {/* Loading State */}
        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        )}

        {/* Error / No Data State */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Main Weather Display */}
        {weather && !loading && !error && (
          <WeatherCard data={weather} />
        )}
      </main>

      <footer className="footer">
        Milestone 2 Submission • Designed by Smart City Dashboard © 2026
      </footer>
    </div>
  );
}

export default App;
