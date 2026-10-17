import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Star, Clock } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

export default function SearchBar({
  onSelectCity,
  currentCity,
  favorites = [],
  onToggleFavorite,
  isFavorite,
  onGeoLocate,
  geoLoading = false,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchCities(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        setError('Failed to fetch cities. Check your network.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleGetLocation = () => {
    if (onGeoLocate) {
      onGeoLocate();
      return;
    }
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSelectCity({
          name: 'Current Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: 'Local GPS',
        });
      },
      (err) => {
        alert(`Location permission denied or unavailable: ${err.message}`);
      }
    );
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="city-search-input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="city-search-results"
            aria-label="Search city, region, or country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search city, region, or country (e.g. Tokyo, London, Chennai)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl glass-panel text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm md:text-base transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" aria-hidden="true" />
          {loading && (
            <Loader2 className="absolute right-3.5 top-3.5 w-5 h-5 text-cyan-400 animate-spin" aria-hidden="true" />
          )}
        </div>

        {/* Geolocation Button */}
        <button
          onClick={handleGetLocation}
          disabled={geoLoading}
          title="Use my current location"
          aria-label="Use my current GPS location"
          className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
        >
          <MapPin className={`w-5 h-5 ${geoLoading ? 'animate-spin text-emerald-400' : ''}`} aria-hidden="true" />
        </button>

        {/* Favorite toggle for current city */}
        {currentCity && (
          <button
            onClick={() => onToggleFavorite(currentCity)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? `Remove ${currentCity.name} from favorites` : `Add ${currentCity.name} to favorites`}
            className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-amber-400 transition-all flex items-center justify-center shrink-0"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          id="city-search-results"
          role="listbox"
          aria-label="City search suggestions"
          className="absolute top-full mt-2 w-full rounded-2xl glass-panel border shadow-2xl z-50 overflow-hidden divide-y divide-white/10 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {error && <div className="p-3 text-sm text-rose-400">{error}</div>}

          {results.length === 0 && !loading && !error && (
            <div className="p-4 text-center text-sm text-slate-400">No matching cities found.</div>
          )}

          {results.map((item) => (
            <button
              key={`${item.id}-${item.latitude}-${item.longitude}`}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-semibold text-white group-hover:text-cyan-400">
                  {item.name}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
