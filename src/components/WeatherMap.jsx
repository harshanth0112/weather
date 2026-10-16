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

export default function WeatherMap({ city, units, onSelectCoordinates }) {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [clickedWeather, setClickedWeather] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [pointError, setPointError] = useState(null);

  const center = [city.latitude, city.longitude];
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const handleMapClick = async (lat, lon) => {
    setClickedCoord([lat, lon]);
    setLoadingPoint(true);
    setPointError(null);
    setClickedWeather(null);
    try {
      const data = await fetchWeatherForecast(lat, lon);
      setClickedWeather(data);
    } catch (e) {
      setPointError('Weather data unavailable at these coordinates.');
    } finally {
      setLoadingPoint(false);
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
              Point Inspection
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Click anywhere on the world map to inspect real Open-Meteo numerical predictions at those coordinates.
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
          ℹ️ <strong>Overlay Notice:</strong> Visual layers represent multi-model weather forecasts from Open-Meteo, not live Doppler radar.
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
      <div className="h-[320px] sm:h-[400px] md:h-[460px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
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
              <div className="text-slate-900 p-1">
                <div className="font-bold text-sm">{city.name}</div>
                <div className="text-xs text-slate-600">
                  Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Clicked Coordinate Marker */}
          {clickedCoord && (
            <Marker position={clickedCoord}>
              <Popup>
                <div className="text-slate-900 p-2 min-w-[140px]">
                  {loadingPoint ? (
                    <div className="text-xs font-medium text-slate-700">Fetching real weather...</div>
                  ) : pointError ? (
                    <div className="text-xs text-rose-600 font-medium">{pointError}</div>
                  ) : clickedWeather ? (
                    <div>
                      <div className="font-bold text-sm">Inspected Point</div>
                      <div className="text-base font-black text-cyan-600 mt-1">
                        {formatTemperature(clickedWeather.current.temperature_2m, units.temperatureUnit)}
                      </div>
                      <div className="text-xs text-slate-600">
                        {getWeatherCondition(clickedWeather.current.weather_code, clickedWeather.current.is_day).description}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Wind: {clickedWeather.current.wind_speed_10m} km/h • Humidity: {clickedWeather.current.relative_humidity_2m}%
                      </div>
                    </div>
                  ) : null}
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
