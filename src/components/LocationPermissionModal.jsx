import React, { useState } from 'react';
import { MapPin, Navigation, Check, Search, X, Loader2 } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

export default function LocationPermissionModal({ isOpen, onClose, onConfirmLocation, defaultCity }) {
  if (!isOpen) return null;

  const [detecting, setDetecting] = useState(false);
  const [detectedCity, setDetectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Detect device GPS location via browser API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode with Open-Meteo
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&language=en&format=json`
          );
          const data = await res.json();
          const loc = data.results?.[0];
          const newCity = {
            id: loc?.id || Date.now(),
            name: loc?.name || 'My Location',
            latitude,
            longitude,
            country: loc?.country || '',
            admin1: loc?.admin1 || '',
          };
          setDetectedCity(newCity);
        } catch {
          // Fallback location object if reverse geocoding has delay
          setDetectedCity({
            id: Date.now(),
            name: 'Current Location',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: '',
            admin1: '',
          });
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        if (err.code === 1) {
          setErrorMsg('Location permission was denied. You can search your city below or keep the default.');
        } else {
          setErrorMsg('Unable to retrieve current location. Please pick or search your city below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 2. City search within modal
  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await searchCities(val);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearched = (item) => {
    const selected = {
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      admin1: item.admin1 || '',
    };
    setDetectedCity(selected);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleApply = (targetCity) => {
    onConfirmLocation(targetCity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl glass-panel p-6 md:p-8 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Set Default Location</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Choose your local city for automatic forecasts and atmospheric data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location setup modal"
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 py-5">
          {/* Quick GPS Auto-Detection Option */}
          <div className="p-4 rounded-2xl weather-subcard border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
                <Navigation className={`w-5 h-5 ${detecting ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Use Device GPS Location</div>
                <div className="text-xs text-slate-300">Fastest and most accurate local forecast</div>
              </div>
            </div>
            <button
              onClick={handleDetectGPS}
              disabled={detecting}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 self-start sm:self-auto disabled:opacity-50 flex items-center gap-1.5"
            >
              {detecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting...</span>
                </>
              ) : (
                <span>Detect Now</span>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Detected City Confirmation Box */}
          {detectedCity && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  Detected Location
                </div>
                <div className="text-lg font-black text-white mt-0.5">
                  {detectedCity.name}
                  {detectedCity.admin1 ? `, ${detectedCity.admin1}` : ''}
                  {detectedCity.country ? ` (${detectedCity.country})` : ''}
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                  Lat: {detectedCity.latitude.toFixed(3)}, Lon: {detectedCity.longitude.toFixed(3)}
                </div>
              </div>
              <button
                onClick={() => handleApply(detectedCity)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Set Default</span>
              </button>
            </div>
          )}

          {/* Manual Search Section */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Or Search Any City
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type city name (e.g. Chennai, London, Tokyo, New York)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl weather-subcard text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {searching && (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto weather-subcard rounded-xl p-1 border border-white/10 space-y-0.5 scrollbar-thin">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearched(item)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-cyan-500/15 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current / Stored Default City info */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>
              Current default: <strong className="text-white">{defaultCity.name}</strong>
              {defaultCity.country ? ` (${defaultCity.country})` : ''}
            </span>
            <button
              onClick={() => handleApply(defaultCity)}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Keep {defaultCity.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
