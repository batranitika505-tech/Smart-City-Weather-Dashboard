import React from 'react';

const WeatherCard = ({ data, isFavorite, onToggleFavorite }) => {
  const { name, sys, main, wind, weather } = data;
  const temp = Math.round(main.temp);
  const humidity = main.humidity;
  const windSpeed = wind.speed;
  const condition = weather[0].main;
  const description = weather[0].description;
  const iconCode = weather[0].icon;

  const getSmartAdvice = () => {
    let wear = [];
    let carry = [];

    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) {
      carry.push('Umbrella 🌂', 'Raincoat 🧥');
      wear.push('Waterproof shoes 👞');
    } else if (condition === 'Snow') {
      wear.push('Heavy woolens 🧥', 'Gloves 🧤');
      carry.push('Heat packs 🔥');
    } else if (condition === 'Clear' || condition === 'Clouds') {
      if (temp > 25) {
        wear.push('Light cotton 👕');
        carry.push('Sunglasses 🕶️');
      } else if (temp > 15) {
        wear.push('Comfortable layers 🧥');
      } else {
        wear.push('Warm jacket 🧥');
      }
    }

    if (temp > 30) carry.push('Water 💧', 'Sunscreen 🧴');
    if (temp < 10) wear.push('Thermals 🧣');
    if (windSpeed > 10) wear.push('Windbreaker 🧥');
    
    if (wear.length === 0) wear.push('Casual outfit 👕');
    if (carry.length === 0) carry.push('Essentials 🎒');

    return { wear, carry };
  };

  const advice = getSmartAdvice();

  return (
    <article className="weather-card">
      <div className="city-header">
        <div className="city-info">
          <h2 className="city-name">
            {name}<span className="country">{sys.country}</span>
          </h2>
        </div>
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`} 
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="temp-display">
        <div className="temp-value">
          {temp}<span className="temp-unit">°C</span>
        </div>
        <p className="description">{description}</p>
      </div>

      <img 
        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`} 
        alt={condition} 
        className="weather-icon"
      />

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{humidity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Wind</span>
          <span className="stat-value">{windSpeed} <small>m/s</small></span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Feels Like</span>
          <span className="stat-value">{Math.round(main.feels_like)}°</span>
        </div>
      </div>

      <div className="advice-grid">
        <div className="advice-card">
          <h3>👕 Recommendations</h3>
          <div className="tags">
            {advice.wear.map((item, i) => (
              <span key={i} className="tag">{item}</span>
            ))}
          </div>
        </div>
        <div className="advice-card">
          <h3>🎒 Essentials</h3>
          <div className="tags">
            {advice.carry.map((item, i) => (
              <span key={i} className="tag">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default WeatherCard;



