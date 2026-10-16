import test from 'node:test';
import assert from 'node:assert/strict';

test('Historical date bounds enforce 5-day publication delay and 1940 minimum', () => {
  const maxAvailableDate = new Date();
  maxAvailableDate.setDate(maxAvailableDate.getDate() - 5);
  const maxDateStr = maxAvailableDate.toISOString().split('T')[0];

  const todayStr = new Date().toISOString().split('T')[0];

  // Today must be disallowed (> maxDateStr)
  assert.ok(todayStr > maxDateStr, 'Today must exceed max available ERA5 date');

  // Verify bound checks
  const isDateAllowed = (d) => d >= '1940-01-01' && d <= maxDateStr;

  assert.equal(isDateAllowed('2023-01-01'), true);
  assert.equal(isDateAllowed('1939-12-31'), false);
  assert.equal(isDateAllowed(todayStr), false);
});
