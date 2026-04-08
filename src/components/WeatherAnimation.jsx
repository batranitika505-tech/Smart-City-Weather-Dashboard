import React from 'react';
import './WeatherAnimation.css';

const WeatherAnimation = ({ condition }) => {
  const renderRain = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div key={i} className="drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }}></div>
    ));
  };

  const renderSnow = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div key={i} className="snowflake" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 2}s`, opacity: Math.random() }}></div>
    ));
  };

  const renderClouds = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="cloud" style={{ top: `${10 + Math.random() * 30}%`, animationDelay: `${i * 2}s`, animationDuration: `${15 + Math.random() * 10}s` }}></div>
    ));
  };

  const renderMist = () => {
    return <div className="mist"></div>;
  };

  return (
    <div className="weather-animation-container">
      {['Rain', 'Drizzle'].includes(condition) && renderRain()}
      {condition === 'Thunderstorm' && (
        <>
          {renderRain()}
          <div className="lightning"></div>
        </>
      )}
      {condition === 'Snow' && renderSnow()}
      {['Clouds', 'Clear'].includes(condition) && renderClouds()}
      {['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'].includes(condition) && renderMist()}
    </div>
  );
};

export default WeatherAnimation;
