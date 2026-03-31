# 🌦️ Smart City Weather Dashboard

## 📌 Description
Smart City Weather Dashboard is a modern weather web application that provides real-time weather updates along with smart lifestyle suggestions.  
Instead of showing only temperature, the app also gives **What to Wear / What to Carry advice** based on weather conditions.

Examples:
- 🌧️ Rain → Bring an umbrella
- ❄️ Cold → Wear a jacket
- ☀️ Hot → Use sunscreen
- 💨 Windy → Wear full sleeves

The app uses OpenWeatherMap API and browser Geolocation API to automatically detect the user’s location and show weather data with a dynamic UI.

---

## 🚀 Core Features

- 🔍 Search weather by city name
- 📍 Auto detect location using Geolocation API
- 📅 5-day weather forecast
- 🌤️ Dynamic weather icons
- 👕 Smart clothing advice based on weather
- 🎨 Background color changes based on temperature
- 📱 Responsive UI design

---

## 🌡️ Dynamic Background Colors

| Temperature | Background |
|-----------|------------|
| < 10°C | Blue |
| 10°C – 25°C | Green |
| 25°C – 35°C | Orange |
| > 35°C | Red |

---

## 🌐 Public API Used

OpenWeatherMap API  
https://openweathermap.org/api

Used APIs:
- Current Weather API
- 5 Day Forecast API
- Weather Icons API

---

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript
- React.js (optional)
- OpenWeatherMap API
- Browser Geolocation API

---

## 📍 Geolocation Feature

The app automatically detects user location using:

```js
navigator.geolocation.getCurrentPosition()
```

This allows:
- Auto weather loading
- No need to type city
- Real-time local weather

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/smart-city-weather-dashboard.git
cd smart-city-weather-dashboard
npm install
npm start
```

---

## 🔑 API Setup

1. Go to https://openweathermap.org/api  
2. Create account  
3. Generate API key  
4. Add in your code

Example:

```js
const API_KEY = "YOUR_API_KEY"
```

---

## 🎨 UI Ideas

- Blue background → Cold
- Orange background → Hot
- Grey → Rainy
- Dark → Night mode
- Icons change based on weather code

---

## 🎯 Challenge Implemented

✅ Use OpenWeatherMap API  
✅ Use Geolocation API  
✅ Show 5 day forecast  
✅ Smart advice system  
✅ Dynamic UI colors  

---

## 🚀 Future Improvements

- Dark mode toggle
- Air Quality Index
- Hourly forecast chart
- Save favorite cities
- Voice search
- PWA support
- Weather animations

---

## 👨‍💻 Author

Nitika
CSE Student | Frontend Developer | React Learner

---

## ⭐ If you like this project

Star the repo  
Fork it  
Improve it  
Build your own version 🚀
