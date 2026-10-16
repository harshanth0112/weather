import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAirQuality, searchCities } from '../src/services/weatherApi.js';

test('searchCities returns empty array for queries under 2 characters', async () => {
  const empty = await searchCities('');
  const single = await searchCities('a');
  assert.deepEqual(empty, []);
  assert.deepEqual(single, []);
});

test('fetchAirQuality parses nulls properly when sensor fields are absent', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      hourly: {
        us_aqi: [null],
        european_aqi: [null],
        pm2_5: [null],
        pm10: [null],
      },
    }),
  });

  try {
    const data = await fetchAirQuality(99.99, 99.99);
    assert.equal(data.current.us_aqi, null);
    assert.equal(data.current.pm2_5, null);
    assert.equal(data.current.category, 'Unmeasured');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
