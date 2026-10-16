import test from 'node:test';
import assert from 'node:assert/strict';
import { askGroqAssistant } from '../src/services/groqApi.js';

test('askGroqAssistant throws MISSING_API_KEY when key is empty', async () => {
  await assert.rejects(
    async () => {
      await askGroqAssistant({
        apiKey: '',
        userPrompt: 'Hello',
        city: { name: 'London' },
        weather: null,
      });
    },
    { message: 'MISSING_API_KEY' }
  );
});

test('askGroqAssistant throws MISSING_API_KEY when key is only whitespace', async () => {
  await assert.rejects(
    async () => {
      await askGroqAssistant({
        apiKey: '   ',
        userPrompt: 'Hello',
        city: { name: 'London' },
        weather: null,
      });
    },
    { message: 'MISSING_API_KEY' }
  );
});
