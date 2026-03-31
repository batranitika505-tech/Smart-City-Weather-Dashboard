import { useState, useEffect } from 'react'

/**
 * HeroSlider Component
 * Auto-sliding carousel at the top with weather tips and info.
 * Features: auto-play, dot navigation, and arrow buttons.
 */

const slides = [
  {
    id: 1,
    className: 'hero-slide--weather',
    emoji: '🌤️',
    title: 'Smart City Weather Dashboard',
    desc: 'Track real-time weather across multiple cities. Get intelligent lifestyle advice based on current conditions.',
  },
  {
    id: 2,
    className: 'hero-slide--tips',
    emoji: '💡',
    title: 'Smart Lifestyle Tips',
    desc: 'Rain? We remind you to carry an umbrella. Cold outside? Wear a jacket. Heat wave? Use sunscreen & stay hydrated!',
  },
  {
    id: 3,
    className: 'hero-slide--cities',
    emoji: '🏙️',
    title: 'Multi-City Tracking',
    desc: 'Add multiple cities, compare weather side by side. Search, filter by condition, sort by temperature — all in one view.',
  },
  {
    id: 4,
    className: 'hero-slide--smart',
    emoji: '⚡',
    title: 'Interactive & Dynamic',
    desc: 'Favorite your top cities, toggle dark mode, expand cards for detailed stats. A fully interactive weather experience.',
  },
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => setCurrent(index)
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="hero-slider" id="hero-slider">
      {/* Slide track */}
      <div
        className="hero-slider__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`hero-slide ${slide.className}`}>
            <div className="hero-slide__content">
              <div className="hero-slide__emoji">{slide.emoji}</div>
              <h2 className="hero-slide__title">{slide.title}</h2>
              <p className="hero-slide__desc">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="hero-slider__arrow hero-slider__arrow--left" onClick={goPrev}>
        ◀
      </button>
      <button className="hero-slider__arrow hero-slider__arrow--right" onClick={goNext}>
        ▶
      </button>

      {/* Dots */}
      <div className="hero-slider__dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-slider__dot ${index === current ? 'hero-slider__dot--active' : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
