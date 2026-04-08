import { useState, useEffect } from 'react';
import './IntroScreen.css';

const slides = [
  { emoji: '☀️', city: 'Dubai', temp: '38°C', condition: 'Sunny', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(239, 68, 68, 0.8))', direction: 'left' },
  { emoji: '🌧️', city: 'London', temp: '14°C', condition: 'Rainy', img: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80', bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(30, 64, 175, 0.8))', direction: 'right' },
  { emoji: '❄️', city: 'Moscow', temp: '-5°C', condition: 'Snow', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80', bg: 'linear-gradient(135deg, rgba(147, 197, 253, 0.8), rgba(219, 234, 254, 0.8))', direction: 'up' },
  { emoji: '⛅', city: 'Tokyo', temp: '22°C', condition: 'Cloudy', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80', bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(99, 102, 241, 0.8))', direction: 'down' },
];

const IntroScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0-3 = slides, 4 = fade out

  useEffect(() => {
    const timings = [0, 1100, 2200, 3300, 4200];
    const timers = timings.map((delay, i) =>
      setTimeout(() => setPhase(i), delay)
    );
    // Total duration before calling onComplete
    const done = setTimeout(onComplete, 5200);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [onComplete]);

  return (
    <div className={`intro-screen ${phase === 4 ? 'intro-fadeout' : ''}`}>
      {/* Animated background particles */}
      <div className="intro-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.3}s`, '--size': `${10 + Math.random() * 20}px`, '--x': `${Math.random() * 100}%`, '--duration': `${3 + Math.random() * 4}s` }} />
        ))}
      </div>

      {/* Logo at the top */}
      <div className="intro-logo">
        <span className="intro-logo-icon">🏙️</span>
        <h1>NEOWEATHER</h1>
        <p>Smart City Intelligence Platform</p>
      </div>

      {/* Sliding panels */}
      <div className="slides-container">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`slide slide--${slide.direction} ${phase >= i ? 'slide--active' : ''} ${phase > i ? 'slide--exit' : ''}`}
            style={{ 
              background: slide.bg,
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="slide-content">
              <span className="slide-emoji">{slide.emoji}</span>
              <h2 className="slide-city">{slide.city}</h2>
              <p className="slide-temp">{slide.temp}</p>
              <p className="slide-cond">{slide.condition}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading bar */}
      <div className="intro-progress">
        <div className="intro-progress-bar" style={{ width: `${(phase / 4) * 100}%` }} />
      </div>

      <p className="intro-tagline">Initializing live weather data...</p>
    </div>
  );
};

export default IntroScreen;
