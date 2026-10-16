import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWeatherForecast, fetchAirQuality, searchCities, fetchHistoricalWeather } from '../src/services/weatherApi.js';

test('fetchWeatherForecast respects AbortSignal and aborts immediately', async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    async () => {
      await fetchWeatherForecast(51.5, -0.12, controller.signal);
    },
    (err) => err.name === 'AbortError'
  );
});

test('searchCities respects AbortSignal', async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    async () => {
      await searchCities('Paris', controller.signal);
    },
    (err) => err.name === 'AbortError'
  );
});

test('fetchAirQuality respects AbortSignal', async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    async () => {
      await fetchAirQuality(48.85, 2.35, controller.signal);
    },
    (err) => err.name === 'AbortError'
  );
});

test('fetchHistoricalWeather respects AbortSignal', async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    async () => {
      await fetchHistoricalWeather(51.5, -0.12, '2023-01-01', '2023-01-01', controller.signal);
    },
    (err) => err.name === 'AbortError'
  );
});
