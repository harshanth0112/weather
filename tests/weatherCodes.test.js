import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeatherCondition, formatTemperature, formatWindSpeed, formatPrecipitation, getWindDirectionLabel } from '../src/utils/weatherCodes.js';

test('WMO code 0 mappings (Clear Day / Clear Night)', () => {
  const day = getWeatherCondition(0, 1);
  assert.equal(day.description, 'Sunny & Clear');
  assert.equal(day.theme, 'clear-day');
  assert.equal(day.iconName, 'Sun');

  const night = getWeatherCondition(0, 0);
  assert.equal(night.description, 'Clear Night');
  assert.equal(night.theme, 'clear-night');
  assert.equal(night.iconName, 'Moon');
});

test('WMO rain and thunderstorm conditions', () => {
  const rain = getWeatherCondition(63, 1);
  assert.equal(rain.description, 'Moderate Rain');
  assert.equal(rain.theme, 'rain');

  const thunder = getWeatherCondition(95, 0);
  assert.equal(thunder.description, 'Thunderstorm');
  assert.equal(thunder.theme, 'thunderstorm');
});

test('Temperature conversions and formatting', () => {
  assert.equal(formatTemperature(20, 'celsius'), '20°C');
  assert.equal(formatTemperature(0, 'fahrenheit'), '32°F');
  assert.equal(formatTemperature(20, 'fahrenheit'), '68°F');
  assert.equal(formatTemperature(undefined), '--');
  assert.equal(formatTemperature(null), '--');
  assert.equal(formatTemperature(NaN), '--');
});

test('Wind speed unit conversions', () => {
  assert.equal(formatWindSpeed(36, 'kmh'), '36 km/h');
  assert.equal(formatWindSpeed(36, 'ms'), '10.0 m/s');
  assert.equal(formatWindSpeed(10, 'mph'), '6.2 mph');
  assert.equal(formatWindSpeed(null), '--');
});

test('Precipitation unit conversions', () => {
  assert.equal(formatPrecipitation(12.5, 'mm'), '12.5 mm');
  assert.equal(formatPrecipitation(25.4, 'inch'), '1.00 in');
  assert.equal(formatPrecipitation(null), '0.0 mm');
});

test('Wind compass direction labels', () => {
  assert.equal(getWindDirectionLabel(0), 'N');
  assert.equal(getWindDirectionLabel(90), 'E');
  assert.equal(getWindDirectionLabel(180), 'S');
  assert.equal(getWindDirectionLabel(270), 'W');
  assert.equal(getWindDirectionLabel(360), 'N');
  assert.equal(getWindDirectionLabel(null), 'N');
});
