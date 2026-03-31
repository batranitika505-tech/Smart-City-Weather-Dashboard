import React from 'react';

const WeatherCard = ({ data }) => {
  const { name, sys, main, wind, weather } = data;
  const temp = Math.round(main.temp);
  const humidity = main.humidity;
  const windSpeed = wind.speed;
  const condition = weather[0].main;
  const description = weather[0].description;
  const iconCode = weather[0].icon;

  /**
   * Logic: Smart Lifestyle Advice (Milestone 2 Requirement)
   */
  const getAdvice = () => {
    // Condition-based: Rain
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) {
      return { icon: '☂️', msg: 'Carry an umbrella! Rain is expected.' };
    }
    
    // Condition-based: Snow
    if (condition === 'Snow') {
      return { icon: '🧤', msg: 'Bundle up! Snow is expected, stay warm.' };
    }

    // Temperature-based: Cold (< 10°C)
    if (temp < 10) {
      return { icon: '🧥', msg: 'Wear a jacket! It\'s quite cold outside.' };
    }

    // Temperature-based: Hot (> 30°C)
    if (temp > 30) {
      return { icon: '🧴', msg: 'Use sunscreen & stay hydrated! Extreme heat.' };
    }

    // Wind-based: Windy (> 8 m/s)
    if (windSpeed > 8) {
      return { icon: '🧣', msg: 'Wear full sleeves! It\'s quite windy today.' };
    }

    // Default: Pleasant
    return { icon: '😊', msg: 'Great weather! Enjoy your day outdoors.' };
  };

  const advice = getAdvice();

  return (
    <div className="weather-card">
      <div className="city-info">
        <h2 className="city-name">{name}, <span className="country-code">{sys.country}</span></h2>
      </div>

      <div className="temp-section">
        <h1 className="temp-main">{temp}<span>°C</span></h1>
        <p className="weather-desc">{description}</p>
        <img 
          src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`} 
          alt={condition} 
          width="120"
        />
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-lbl">Humidity</span>
          <span className="stat-val">{humidity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-lbl">Wind Speed</span>
          <span className="stat-val">{windSpeed} m/s</span>
        </div>
      </div>

      {/* Smart Advice Container */}
      <div className="advice-box">
        <span className="advice-icon">{advice.icon}</span>
        <div className="advice-content">
          <span className="advice-lbl">Smart Advice</span>
          <p className="advice-msg">{advice.msg}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
