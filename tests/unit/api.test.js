'use strict';

const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Events API (work item 101)', () => {
  const app = createApp();

  test('GET /api/health reports ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /api/events returns all events with seatsRemaining', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('seatsRemaining');
  });

  test('GET /api/events/:id returns 404 for an unknown event', async () => {
    const res = await request(app).get('/api/events/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Event not found');
  });
});
