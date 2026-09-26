'use strict';

const request = require('supertest');
const { formatEventDateTime } = require('../../src/eventService');
const { createApp } = require('../../src/app');

describe('Work item 104 — Event date and time shown in raw format (regression)', () => {
  test('AC1: formats date and time as "Ddd, Mmm D, YYYY · h:mm AM/PM"', () => {
    expect(formatEventDateTime('2026-10-12', '18:00')).toBe('Mon, Oct 12, 2026 · 6:00 PM');
    expect(formatEventDateTime('2026-11-09', '09:30')).toBe('Mon, Nov 9, 2026 · 9:30 AM');
  });

  test('AC2: midnight shows as 12:00 AM', () => {
    expect(formatEventDateTime('2026-01-01', '00:00')).toBe('Thu, Jan 1, 2026 · 12:00 AM');
  });

  test('AC2: noon shows as 12:00 PM', () => {
    expect(formatEventDateTime('2026-10-15', '12:30')).toBe('Thu, Oct 15, 2026 · 12:30 PM');
  });

  test('AC1 (edge): single-digit day and minute padding', () => {
    expect(formatEventDateTime('2026-03-05', '07:05')).toBe('Thu, Mar 5, 2026 · 7:05 AM');
  });

  test('AC3: result does not depend on the process time zone', () => {
    const original = process.env.TZ;
    try {
      process.env.TZ = 'Pacific/Kiritimati'; // UTC+14
      expect(formatEventDateTime('2026-10-12', '18:00')).toBe('Mon, Oct 12, 2026 · 6:00 PM');
      process.env.TZ = 'Pacific/Pago_Pago'; // UTC-11
      expect(formatEventDateTime('2026-10-12', '18:00')).toBe('Mon, Oct 12, 2026 · 6:00 PM');
    } finally {
      process.env.TZ = original;
    }
  });

  test('AC1: API returns the formatted "when" field', async () => {
    const res = await request(createApp()).get('/api/events/1');
    expect(res.body.when).toBe('Mon, Oct 12, 2026 · 6:00 PM');
  });
});
