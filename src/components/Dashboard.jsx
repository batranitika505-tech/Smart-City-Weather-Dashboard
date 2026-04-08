import { useState, useEffect } from 'react';
import './Dashboard.css';

const API_KEY = '545b6c81e14f2dcd20b0a1711d62ed1a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const Dashboard = ({ isDarkMode }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem('neo_favorites') || '["Mumbai","London","Tokyo"]')
  );

  const fetchAll = async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE_URL}?q=${encodeURIComponent(targetCity)}&appid=${API_KEY}&units=metric`),
        fetch(`${FORECAST_URL}?q=${encodeURIComponent(targetCity)}&appid=${API_KEY}&units=metric&cnt=40`)
      ]);
      if (!wRes.ok) throw new Error('City not found');
      const wData = await wRes.json();
      const fData = await fRes.json();
      setWeather(wData);
      setForecast(fData.list || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(city); }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) { setCity(searchInput.trim()); setSearchInput(''); }
  };

  const addFavorite = () => {
    if (weather && !favorites.includes(weather.name)) {
      const next = [...favorites, weather.name];
      setFavorites(next);
      localStorage.setItem('neo_favorites', JSON.stringify(next));
    }
  };

  const removeFavorite = (name) => {
    const next = favorites.filter(f => f !== name);
    setFavorites(next);
    localStorage.setItem('neo_favorites', JSON.stringify(next));
  };

  // Derive hourly forecast (next 6 slots = 18 hours)
  const hourly = forecast.slice(0, 6);

  // Derive weekly (one per day)
  const weekly = forecast.filter((_, i) => i % 8 === 0).slice(0, 7);

  const getAQI = () => {
    if (!weather) return { label: '—', value: 0, color: '#10b981' };
    const humidity = weather.main.humidity;
    if (humidity < 40) return { label: 'Good', value: 42, color: '#10b981' };
    if (humidity < 60) return { label: 'Moderate', value: 85, color: '#f59e0b' };
    if (humidity < 80) return { label: 'Unhealthy', value: 154, color: '#ef4444' };
    return { label: 'Hazardous', value: 210, color: '#7c3aed' };
  };

  const aqi = getAQI();

  const aqizones = [
    { name: 'Hinjewadi', val: 48, status: 'good' },
    { name: 'Shivajinagar', val: 112, status: 'unhealthy' },
    { name: 'Kothrud', val: 76, status: 'moderate' },
    { name: 'Hadapsar', val: 154, status: 'hazardous' },
    { name: 'Baner', val: 58, status: 'moderate' },
    { name: 'Viman Nagar', val: 108, status: 'unhealthy' }
  ];

  const getUV = (temp) => {
    if (temp > 35) return { label: 'Very High', value: 9, color: '#ef4444' };
    if (temp > 25) return { label: 'High', value: 7, color: '#f97316' };
    if (temp > 15) return { label: 'Moderate', value: 4, color: '#f59e0b' };
    return { label: 'Low', value: 2, color: '#10b981' };
  };

  const getAlerts = () => {
    if (!weather) return [];
    const alerts = [];
    const temp = weather.main.temp;
    const condition = weather.weather[0].main;
    if (temp > 35) alerts.push({ icon: '🌡️', title: 'Heat Advisory', desc: `Temperature reaching ${Math.round(temp)}°C. Stay hydrated and avoid outdoor activity 12–4 PM.`, severity: 'high' });
    if (['Rain', 'Thunderstorm', 'Drizzle'].includes(condition)) alerts.push({ icon: '⛈️', title: 'Rain Alert', desc: `${condition} expected. Carry an umbrella and drive carefully.`, severity: 'medium' });
    if (temp < 5) alerts.push({ icon: '🥶', title: 'Cold Warning', desc: 'Temperatures near freezing. Wear warm layers and limit exposure.', severity: 'high' });
    if (weather.wind.speed > 10) alerts.push({ icon: '💨', title: 'Wind Advisory', desc: `Strong winds at ${weather.wind.speed} m/s. Secure loose objects outdoors.`, severity: 'medium' });
    if (alerts.length === 0) alerts.push({ icon: '✅', title: 'All Clear', desc: 'No active weather alerts for your area.', severity: 'low' });
    return alerts;
  };

  const conditionIcon = (main) => {
    const map = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️' };
    return map[main] || '🌡️';
  };

  const windDir = (deg) => {
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  if (loading && !weather) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <p>Loading weather intelligence...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* ── TOP NAV ── */}
      <nav className="dash-nav">
        <div className="dash-brand">🏙️ <span>NEO</span>WEATHER</div>
        <form className="dash-search" onSubmit={handleSearch}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search city..."
          />
          <button type="submit">🔍</button>
        </form>
        <div className="dash-nav-right">
          {loading && <span className="dash-syncing">⟳ Syncing...</span>}
          <span className="dash-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </nav>

      {error && <div className="dash-error">⚠️ {error}</div>}

      {weather && (
        <div className="dash-grid">

          {/* ── HERO CURRENT WEATHER ── */}
          <div className="card card--hero">
            <div className="hero-left">
              <div className="hero-city">
                {weather.name}, <span>{weather.sys.country}</span>
                <button className="fav-star" onClick={addFavorite} title="Add to favorites">
                  {favorites.includes(weather.name) ? '★' : '☆'}
                </button>
              </div>
              <div className="hero-temp">{Math.round(weather.main.temp)}<sup>°C</sup></div>
              <div className="hero-desc">{weather.weather[0].description}</div>
              <div className="hero-stats">
                <span>💧 {weather.main.humidity}%</span>
                <span>💨 {weather.wind.speed} m/s {windDir(weather.wind.deg)}</span>
                <span>👁️ {((weather.visibility || 10000) / 1000).toFixed(1)} km</span>
                <span>🌡️ Feels {Math.round(weather.main.feels_like)}°</span>
              </div>
            </div>
            <div className="hero-right">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].main}
                className="hero-icon"
              />
              <div className="hero-meta">
                <div><span>Sunrise</span><strong>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                <div><span>Sunset</span><strong>{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                <div><span>Max</span><strong>{Math.round(weather.main.temp_max)}°</strong></div>
                <div><span>Min</span><strong>{Math.round(weather.main.temp_min)}°</strong></div>
              </div>
            </div>
          </div>

          {/* ── HOURLY FORECAST ── */}
          <div className="card card--hourly">
            <h3 className="card-title">⏱ Hourly Forecast</h3>
            <div className="hourly-list">
              {hourly.map((h, i) => (
                <div key={i} className="hourly-item">
                  <span className="hourly-time">{i === 0 ? 'Now' : new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="hourly-icon">{conditionIcon(h.weather[0].main)}</span>
                  <span className="hourly-temp">{Math.round(h.main.temp)}°</span>
                  <span className="hourly-rain">{Math.round((h.pop || 0) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── VISIBILITY & PRESSURE ── */}
          <div className="card card--vispres">
            <h3 className="card-title">📊 Visibility & Pressure</h3>
            <div className="vispres-grid">
              <div className="vispres-item">
                <span className="vp-label">VISIBILITY</span>
                <span className="vp-val">{((weather.visibility || 10000) / 1000).toFixed(1)} <small>km</small></span>
              </div>
              <div className="vispres-item">
                <span className="vp-label">PRESSURE</span>
                <span className="vp-val">{weather.main.pressure} <small>hPa</small></span>
              </div>
            </div>
          </div>

          {/* ── AIR QUALITY ── */}
          <div className="card card--aqi">
            <h3 className="card-title">🌬️ Air Quality — Zone Map</h3>
            <div className="aqi-meter">
               <div className="aqi-meter-indicator" style={{ left: `${(aqi.value / 300) * 100}%` }} />
               <div className="aqi-meter-labels">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                  <span>Hazardous</span>
               </div>
            </div>
            <div className="aqi-zones">
              {aqizones.map(zone => (
                <div key={zone.name} className="aqi-zone-row">
                  <span className="zone-name">{zone.name}</span>
                  <span className={`zone-val zone-${zone.status}`}>{zone.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── UV & WIND ── */}
          <div className="card card--uv">
            <h3 className="card-title">☀️ UV & Wind</h3>
            {(() => {
              const uv = getUV(weather.main.temp);
              return (
                <>
                  <div className="uv-display">
                    <div>
                      <span className="uv-value">{uv.value}</span>
                      <span className="uv-label" style={{ color: uv.color }}>{uv.label}</span>
                    </div>
                    <div className="wind-compass">
                      <div className="compass-outer">
                        <div className="compass-needle" style={{ transform: `rotate(${weather.wind.deg || 0}deg)` }} />
                        <span className="compass-dir">{windDir(weather.wind.deg || 0)}</span>
                      </div>
                      <span className="wind-speed">{weather.wind.speed} m/s</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* ── 7-DAY RAINFALL ── */}
          <div className="card card--rainfall">
            <h3 className="card-title">📅 7-Day Rainfall (mm)</h3>
            <div className="rainfall-list">
              {weekly.map((day, i) => {
                const rain = day.rain?.['3h'] || (Math.random() * 5); // Fallback for demo
                return (
                  <div key={i} className="rainfall-item">
                    <span className="rainfall-day">{new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</span>
                    <div className="rainfall-bar-container">
                      <div className="rainfall-bar" style={{ width: `${(rain / 15) * 100}%` }} />
                    </div>
                    <span className="rainfall-val">{rain.toFixed(1)} mm</span>
                  </div>
                );
              })}
            </div>
            <div className="rainfall-footer">
              <span>7-day total</span>
              <strong>{weekly.reduce((acc, day) => acc + (day.rain?.['3h'] || 1.5), 0).toFixed(1)} mm</strong>
            </div>
          </div>

          {/* ── ACTIVE ALERTS ── */}
          <div className="card card--alerts">
            <h3 className="card-title">🚨 Active Alerts</h3>
            <div className="alerts-list">
              {getAlerts().map((alert, i) => (
                <div key={i} className={`alert-item alert--${alert.severity}`}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div>
                    <strong className="alert-title">{alert.title}</strong>
                    <p className="alert-desc">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAVORITES ── */}
          <div className="card card--favorites">
            <h3 className="card-title">❤️ Favorites</h3>
            <div className="fav-list">
              {favorites.map((fav, i) => (
                <div key={i} className={`fav-item ${fav === weather.name ? 'fav-active' : ''}`} onClick={() => setCity(fav)}>
                  <span className="fav-name">{fav}</span>
                  <button className="fav-remove" onClick={(e) => { e.stopPropagation(); removeFavorite(fav); }}>✕</button>
                </div>
              ))}
              {favorites.length === 0 && <p className="fav-empty">No favorites yet. Click ☆ to add.</p>}
            </div>
          </div>

          {/* ── SENSOR NETWORK ── */}
          <div className="card card--sensors">
            <h3 className="card-title">📡 Sensor Network Status</h3>
            <div className="sensor-summary">
               <span className="summary-item"><em className="dot dot-green">●</em> Online: 31</span>
               <span className="summary-item"><em className="dot dot-orange">●</em> Warning: 3</span>
            </div>
            <div className="sensor-grid">
              {[
                { id: 'SN-01', name: 'Temp/Humid', location: 'Shivajinagar Plaza', val: `${Math.round(weather.main.temp)}°C · ${weather.main.humidity}%`, status: 'ok' },
                { id: 'SN-04', name: 'AQI Node', location: 'Hadapsar Industrial', val: 'AQI 154', status: 'warn' },
                { id: 'SN-07', name: 'Wind Station', location: 'Baner Hill', val: `${weather.wind.speed} km/h NW`, status: 'ok' },
                { id: 'SN-12', name: 'Rain Gauge', location: 'Kothrud Station', val: '0.0 mm/hr', status: 'ok' },
                { id: 'SN-18', name: 'UV Sensor', location: 'Hinjewadi IT Park', val: 'UV Idx 8.2', status: 'warn' },
                { id: 'SN-22', name: 'Pressure', location: 'Airport Perimeter', val: `${weather.main.pressure} hPa`, status: 'ok' },
              ].map(s => (
                <div key={s.id} className="sensor-tile">
                  <div className="sensor-meta">
                    <span className="s-id">{s.id} {s.name}</span>
                    <span className="s-loc">{s.location}</span>
                  </div>
                  <span className={`s-val s-${s.status}`}>● {s.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      <footer className="dash-footer">
        NEO WEATHER INTELLIGENCE PLATFORM • MILESTONE 3 • DATA: OPENWEATHERMAP
      </footer>
    </div>
  );
};

export default Dashboard;
