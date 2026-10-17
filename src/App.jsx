import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  MapPin,
  Sliders,
  RefreshCw,
  Star,
  ExternalLink,
  LocateFixed,
  Bot,
  Sparkles,
} from 'lucide-react';

import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastSection from './components/ForecastSection';
import WeatherMap from './components/WeatherMap';
import AirQualityAlerts from './components/AirQualityAlerts';
import WeatherAssistant from './components/WeatherAssistant';
import CityComparison from './components/CityComparison';
import HistoricalWeather from './components/HistoricalWeather';
import SettingsModal from './components/SettingsModal';
import ThemePreviewBar from './components/ThemePreviewBar';
import LocationPermissionModal from './components/LocationPermissionModal';
import { DesktopNavigation, MobileBottomNavigation } from './components/Navigation';

import { fetchWeatherForecast, fetchAirQuality } from './services/weatherApi';

// Default fallback city if no location is selected
const DEFAULT_CITY = {
  id: 1261481,
  name: 'New Delhi',
  latitude: 28.6139,
  longitude: 77.2090,
  country: 'India',
  admin1: 'Delhi',
};

export default function App() {
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem('atmos_default_city');
    return saved ? JSON.parse(saved) : DEFAULT_CITY;
  });

  // Location prompt popup opens automatically if user hasn't set their default location yet
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(() => {
    return !localStorage.getItem('atmos_default_city_confirmed');
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTheme, setPreviewTheme] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Groq API Key: Checks localStorage first, then falls back to VITE_GROQ_API_KEY from .env
  const [groqKey, setGroqKey] = useState(() => {
    return localStorage.getItem('atmos_groq_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  });

  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('atmos_favorites');
    return saved ? JSON.parse(saved) : [DEFAULT_CITY];
  });

  // User preferences & units
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('atmos_units');
    return saved
      ? JSON.parse(saved)
      : {
          theme: 'dark',
          temperatureUnit: 'celsius',
          windSpeedUnit: 'kmh',
          precipitationUnit: 'mm',
          timeFormat: '12h',
          reducedMotion: false,
        };
  });

  useEffect(() => {
    localStorage.setItem('atmos_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('atmos_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('atmos_groq_key', groqKey);
  }, [groqKey]);

  const activeRequestRef = React.useRef(null);

  // Load weather and air quality whenever city changes with AbortController cancellation
  const loadWeather = async (targetCity = city) => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const [weatherData, aqData] = await Promise.all([
        fetchWeatherForecast(targetCity.latitude, targetCity.longitude, controller.signal),
        fetchAirQuality(targetCity.latitude, targetCity.longitude, controller.signal).catch(() => null),
      ]);
      setWeather(weatherData);
      setAirQuality(aqData);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Stale request cancelled; ignore
      }
      setError(err.message || 'Failed to fetch weather data. Please retry.');
    } finally {
      if (activeRequestRef.current === controller) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadWeather(city);
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [city.latitude, city.longitude]);

  // Toggle favorite
  const handleToggleFavorite = (loc) => {
    const exists = favorites.some((f) => f.name === loc.name && Math.abs(f.latitude - loc.latitude) < 0.1);
    if (exists) {
      setFavorites(favorites.filter((f) => !(f.name === loc.name && Math.abs(f.latitude - loc.latitude) < 0.1)));
    } else {
      setFavorites([...favorites, loc]);
    }
  };

  const isFavorite = favorites.some((f) => f.name === city.name && Math.abs(f.latitude - city.latitude) < 0.1);

  // Geolocation: detect user's current location using browser GPS
  const handleGeoLocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode using Open-Meteo's geocoding
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&language=en&format=json`
          );
          const data = await res.json();
          const loc = data.results?.[0];
          const geoCity = {
            id: loc?.id || Date.now(),
            name: loc?.name || 'My Location',
            latitude,
            longitude,
            country: loc?.country || '',
            admin1: loc?.admin1 || '',
          };
          setCity(geoCity);
          setPreviewTheme(null);
        } catch {
          setCity({ id: Date.now(), name: 'My Location', latitude: pos.coords.latitude, longitude: pos.coords.longitude, country: '', admin1: '' });
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false)
    );
  };

  const currentTheme = units.theme || 'dark';

  // Synchronize data-theme on documentElement for global CSS variables and full theme consistency
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-[#F4F8FC]', 'text-[#172B4D]');
    } else {
      document.body.classList.remove('bg-[#F4F8FC]', 'text-[#172B4D]');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
    }
  }, [currentTheme]);

  return (
    <div
      data-theme={currentTheme}
      className={`min-h-screen min-h-[100dvh] relative selection:bg-cyan-500/30 selection:text-cyan-200 safe-bottom-content md:pb-14 transition-colors duration-300 ${
        currentTheme === 'light' ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      {/* 1. Dynamic Animated Weather Background */}
      <WeatherBackground
        weatherCode={weather?.current?.weather_code || 0}
        isDay={weather?.current?.is_day !== undefined ? weather.current.is_day : 1}
        previewTheme={previewTheme}
        reducedMotion={units.reducedMotion}
        isDarkMode={currentTheme === 'dark'}
      />

      {/* Skip to Main Content Link for Keyboard and Screen-Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-cyan-500 focus:text-slate-950 focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-8 relative z-10">
        {/* Top Header Navbar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-3 self-start md:self-auto cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-lg shadow-cyan-500/10">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Atmos <span className="text-cyan-400 font-extralight">Weather</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Live Open-Meteo Observation & Intelligence
              </div>
            </div>
          </div>

          {/* Autocomplete City Search */}
          <SearchBar
            onSelectCity={(newCity) => {
              setCity(newCity);
              setPreviewTheme(null); // Return to auto real weather mode whenever city changes
            }}
            currentCity={city}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onGeoLocate={handleGeoLocate}
            geoLoading={geoLoading}
          />

          {/* Top Actions: Geolocate, Settings and Refresh */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleGeoLocate}
              disabled={geoLoading}
              title="Use my current GPS location"
              aria-label="Detect and use current GPS location"
              className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-emerald-300 hover:border-emerald-400/40 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <LocateFixed className={`w-5 h-5 ${geoLoading ? 'animate-spin text-emerald-400' : ''}`} aria-hidden="true" />
            </button>
            <button
              onClick={() => loadWeather(city)}
              disabled={loading}
              title="Refresh weather"
              aria-label="Refresh current weather data"
              className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Preferences & Groq Key"
              aria-label="Open settings and preferences modal"
              className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all flex items-center justify-center"
            >
              <Sliders className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Favorite Cities Bar */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Saved:
            </span>
            {favorites.map((fav, i) => (
              <button
                key={i}
                onClick={() => {
                  setCity(fav);
                  setPreviewTheme(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                  fav.name === city.name
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                }`}
              >
                {fav.name}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Navigation Tabs */}
        <DesktopNavigation
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
        />

        {/* Screen-reader Live Region */}
        <div className="sr-only" role="status" aria-live="polite">
          {loading ? `Updating weather for ${city.name}` : `Weather loaded for ${city.name}`}
        </div>

        {/* Error Notification */}
        {error && (
          <div role="alert" className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => loadWeather(city)}
              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dynamic Tab Views */}
        {loading && !weather ? (
          <div className="py-12 space-y-4">
            {/* Skeleton shimmer for main card */}
            <div className="weather-card p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-4">
                <div className="skeleton w-16 h-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-8 w-48 rounded-xl" />
                  <div className="skeleton h-4 w-32 rounded-lg" />
                </div>
              </div>
              <div className="skeleton h-24 w-full rounded-2xl" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl text-sm text-slate-300">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Open-Meteo servers…</span>
              </div>
            </div>
          </div>
        ) : weather ? (
          <main id="main-content" tabIndex="-1" className="transition-all duration-200 outline-none">
            {/* VIEW 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <CurrentWeatherCard weather={weather} city={city} units={units} />
                <ForecastSection weather={weather} units={units} />
              </div>
            )}

            {/* VIEW 2: FORECAST & DETAILED TRENDS */}
            {activeTab === 'forecast' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ForecastSection weather={weather} units={units} />
              </div>
            )}

            {/* VIEW 3: INTERACTIVE LEAFLET MAP */}
            {activeTab === 'map' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <WeatherMap city={city} units={units} onSelectCoordinates={(coords) => console.log(coords)} />
              </div>
            )}

            {/* VIEW 4: AIR QUALITY & RISK ASSESSMENTS */}
            {activeTab === 'airquality' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <AirQualityAlerts city={city} weather={weather} />
              </div>
            )}

            {/* VIEW 5: WEATHER-AWARE AI ASSISTANT (GROQ + RULE FALLBACK) */}
            {activeTab === 'assistant' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <WeatherAssistant
                  city={city}
                  weather={weather}
                  airQuality={airQuality}
                  units={units}
                  groqKey={groqKey}
                  onSaveGroqKey={(key) => setGroqKey(key)}
                />
              </div>
            )}

            {/* VIEW 6: CITY COMPARISON & HISTORICAL ARCHIVE */}
            {activeTab === 'compare' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <CityComparison baseCity={city} baseWeather={weather} units={units} />
                <HistoricalWeather city={city} units={units} />
              </div>
            )}
          </main>
        ) : null}

        {/* Mandatory Open-Meteo & OpenStreetMap Legal Attribution Footer */}
        <footer className="mt-12 py-6 border-t border-white/10 text-center text-xs text-slate-400 space-y-1.5">
          <p>
            Weather, Geocoding, Air Quality & Archives powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline font-semibold"
            >
              Open-Meteo.com
            </a>{' '}
            (CC BY 4.0).
          </p>
          <p>
            Map data &copy;{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              OpenStreetMap contributors
            </a>
            .
          </p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        units={units}
        onChangeUnits={setUnits}
        city={city}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Location Setup & Confirmation Modal */}
      <LocationPermissionModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        defaultCity={city}
        onConfirmLocation={(newLoc) => {
          setCity(newLoc);
          localStorage.setItem('atmos_default_city', JSON.stringify(newLoc));
          localStorage.setItem('atmos_default_city_confirmed', 'true');
          setPreviewTheme(null);
        }}
      />

      {/* Floating Chatbot Assistant Icon (Global Shortcut) — Hidden when already viewing Assistant tab */}
      {activeTab !== 'assistant' && (
        <aside aria-label="Quick AI Assistant shortcut" className="fixed safe-floating-btn md:bottom-8 right-4 md:right-6 z-40">
          <button
            onClick={() => setActiveTab('assistant')}
            aria-label="Open Atmos AI Weather Assistant"
            title="Chat with Atmos AI Weather Assistant"
            className="group relative flex items-center justify-center p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-tr from-cyan-500 to-sky-400 text-slate-950 hover:scale-110 hover:shadow-cyan-500/50 hover:ring-4 hover:ring-cyan-400/40 active:scale-95 animate-pulse"
          >
            {/* Subtle ping indicator ring */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-400 border-2 border-slate-950"></span>
            </span>
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-6 transition-transform" aria-hidden="true" />
            
            {/* Floating Tooltip Pill */}
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-slate-950/90 text-cyan-300 text-xs font-bold py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Atmos AI</span>
            </span>
          </button>
        </aside>
      )}

      {/* Floating Background Themes QA Switcher */}
      <ThemePreviewBar
        currentTheme={previewTheme}
        onSelectTheme={(t) => setPreviewTheme(t)}
      />
    </div>
  );
}
