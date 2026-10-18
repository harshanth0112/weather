import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { fetchWeatherForecast } from '../services/weatherApi';
import { getWeatherCondition, formatTemperature } from '../utils/weatherCodes';

// Fix Leaflet's default icon path issues in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (e.latlng) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function WeatherMap({ city, units, onSelectCoordinates, onSelectCity, favorites = [] }) {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [clickedWeather, setClickedWeather] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [pointError, setPointError] = useState(null);
  const [pointLocationName, setPointLocationName] = useState('');

  const center = [city.latitude, city.longitude];
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const handleMapClick = async (lat, lon) => {
    setClickedCoord([lat, lon]);
    setLoadingPoint(true);
    setPointError(null);
    setClickedWeather(null);
    setPointLocationName('');

    if (onSelectCoordinates) {
      onSelectCoordinates({ latitude: lat, longitude: lon });
    }

    try {
      // Fetch both weather and reverse geocoded place name in parallel
      const [data, geoRes] = await Promise.all([
        fetchWeatherForecast(lat, lon),
        fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&language=en&format=json`
        ).then((r) => r.json()).catch(() => null),
      ]);

      setClickedWeather(data);
      const name = geoRes?.results?.[0]?.name;
      const admin = geoRes?.results?.[0]?.admin1;
      const country = geoRes?.results?.[0]?.country;
      if (name) {
        setPointLocationName(`${name}${admin ? `, ${admin}` : ''}${country ? `, ${country}` : ''}`);
      }
    } catch (e) {
      setPointError('Weather data unavailable at these coordinates.');
    } finally {
      setLoadingPoint(false);
    }
  };

  const openInGoogleMaps = (lat, lon) => {
    if (lat === undefined || lon === undefined) return;
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectLocationAsCity = (targetCity) => {
    if (onSelectCity && targetCity) {
      onSelectCity(targetCity);
    }
  };

  return (
    <div className="weather-card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
              Interactive Weather Map
            </h2>
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/25 font-semibold">
              Live Location Navigator
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Click anywhere to inspect real atmospheric conditions, open in Google Maps, or load full city forecasts.
          </p>
        </div>

        {/* Forecast Layer Selector */}
        <div className="inline-flex items-center gap-1 p-1 weather-subcard rounded-xl self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveLayer('temp')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'temp' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'wind' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            Wind
          </button>
          <button
            onClick={() => setActiveLayer('precip')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'precip' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            Precipitation
          </button>
        </div>
      </div>

      {/* Notice on Forecast overlays vs Live Radar */}
      <div className="mb-4 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl weather-subcard text-xs text-slate-300 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5">
        <span>
          ℹ️ <strong>Tip:</strong> Click pins or any map coordinate to view live details and navigation options.
        </span>
        <a
          href="https://open-meteo.com/en/docs"
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold text-xs shrink-0"
        >
          API Docs <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Leaflet Map Frame */}
      <div className="h-[360px] sm:h-[440px] md:h-[500px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={center} zoom={10} />
          <MapClickHandler onMapClick={handleMapClick} />
          <TileLayer
            attribution={tileAttribution}
            url={tileUrl}
            maxZoom={18}
          />

          {/* Marker for Current City */}
          <Marker position={center}>
            <Popup>
              <div className="text-slate-900 p-2 min-w-[180px]">
                <div className="flex items-center gap-1.5 text-cyan-700 font-semibold text-xs uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Current City</span>
                </div>
                <div className="font-bold text-base text-slate-900">{city.name}</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country || ''}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  {city.latitude.toFixed(4)}°, {city.longitude.toFixed(4)}°
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => openInGoogleMaps(city.latitude, city.longitude)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-all shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Markers for Favorite Saved Cities */}
          {favorites
            .filter((fav) => fav.name !== city.name && fav.latitude && fav.longitude)
            .map((fav, idx) => (
              <Marker key={`fav-${fav.id || idx}`} position={[fav.latitude, fav.longitude]}>
                <Popup>
                  <div className="text-slate-900 p-2 min-w-[180px]">
                    <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs uppercase tracking-wider mb-1">
                      <span>★ Saved City</span>
                    </div>
                    <div className="font-bold text-base text-slate-900">{fav.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {fav.admin1 ? `${fav.admin1}, ` : ''}{fav.country || ''}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      {fav.latitude.toFixed(4)}°, {fav.longitude.toFixed(4)}°
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectLocationAsCity(fav)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        <span>View Weather Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openInGoogleMaps(fav.latitude, fav.longitude)}
                        className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-all"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Open in Maps</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Clicked Coordinate Marker */}
          {clickedCoord && (
            <Marker position={clickedCoord}>
              <Popup>
                <div className="text-slate-900 p-2 min-w-[200px]">
                  <div className="flex items-center gap-1 text-cyan-600 font-semibold text-xs uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Selected Location</span>
                  </div>

                  {pointLocationName && (
                    <div className="font-bold text-sm text-slate-900 mb-0.5">
                      {pointLocationName}
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-500">
                    Lat: {clickedCoord[0].toFixed(4)}°, Lon: {clickedCoord[1].toFixed(4)}°
                  </div>

                  {loadingPoint ? (
                    <div className="text-xs font-medium text-slate-700 py-2">
                      Fetching live weather & address...
                    </div>
                  ) : pointError ? (
                    <div className="text-xs text-rose-600 font-medium py-1">{pointError}</div>
                  ) : clickedWeather ? (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-cyan-600 tabular-nums">
                          {formatTemperature(clickedWeather.current.temperature_2m, units.temperatureUnit)}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {getWeatherCondition(clickedWeather.current.weather_code, clickedWeather.current.is_day).description}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Wind: {clickedWeather.current.wind_speed_10m} km/h • Humidity: {clickedWeather.current.relative_humidity_2m}%
                      </div>
                    </div>
                  ) : null}

                  {/* Navigation Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectLocationAsCity({
                          id: Date.now(),
                          name: pointLocationName ? pointLocationName.split(',')[0] : `Point (${clickedCoord[0].toFixed(2)}, ${clickedCoord[1].toFixed(2)})`,
                          latitude: clickedCoord[0],
                          longitude: clickedCoord[1],
                          country: pointLocationName ? pointLocationName.split(',').pop()?.trim() : '',
                          admin1: '',
                        })
                      }
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      <span>Set as Active City & View Forecast</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openInGoogleMaps(clickedCoord[0], clickedCoord[1])}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Attribution footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Map Data: © OpenStreetMap contributors</span>
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 hover:underline"
        >
          Weather data by Open-Meteo.com (CC BY 4.0)
        </a>
      </div>
    </div>
  );
}
