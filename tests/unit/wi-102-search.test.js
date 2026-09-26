'use strict';

const request = require('supertest');
const { createStore, searchEvents } = require('../../src/eventService');
const { createApp } = require('../../src/app');

describe('Work item 102 — Search events by keyword', () => {
  describe('searchEvents (service)', () => {
    test('AC1: matches keyword in the title', () => {
      const titles = searchEvents(createStore(), 'hackathon').map((e) => e.title);
      expect(titles).toEqual(['Hackathon Kickoff']);
    });

    test('AC1: matches keyword in the description', () => {
      const titles = searchEvents(createStore(), 'internships').map((e) => e.title);
      expect(titles).toEqual(['Cloud Careers Panel']);
    });

    test('AC1: is case-insensitive', () => {
      expect(searchEvents(createStore(), 'MACHINE LEARNING').map((e) => e.id)).toEqual([1]);
    });

    test('AC1: ignores leading and trailing whitespace', () => {
      expect(searchEvents(createStore(), '   resume  ').map((e) => e.id)).toEqual([4]);
    });

    test('AC1 (scope): does not match on location', () => {
      // Product Owner comment: location and tags are out of scope.
      expect(searchEvents(createStore(), 'Ballroom')).toEqual([]);
    });

    test('AC2: blank, whitespace-only or missing keyword returns all events', () => {
      const all = createStore().length;
      expect(searchEvents(createStore(), '')).toHaveLength(all);
      expect(searchEvents(createStore(), '   ')).toHaveLength(all);
      expect(searchEvents(createStore(), undefined)).toHaveLength(all);
    });

    test('AC1 (negative): returns an empty list when nothing matches', () => {
      expect(searchEvents(createStore(), 'quantum basket weaving')).toEqual([]);
    });
  });

  describe('GET /api/events?q= (API)', () => {
    const app = createApp();

    test('AC1: returns only matching events', async () => {
      const res = await request(app).get('/api/events').query({ q: 'data' });
      expect(res.status).toBe(200);
      expect(res.body.map((e) => e.title)).toEqual(['Cloud Careers Panel', 'Data Visualization Workshop']);
    });

    test('AC1: trims whitespace in the query', async () => {
      const res = await request(app).get('/api/events').query({ q: '  robot ' });
      expect(res.body.map((e) => e.id)).toEqual([5]);
    });

    test('AC2: blank q returns all events', async () => {
      const all = await request(app).get('/api/events');
      const blank = await request(app).get('/api/events').query({ q: '  ' });
      expect(blank.body).toHaveLength(all.body.length);
    });

    test('AC1 (negative): no match returns 200 with an empty array', async () => {
      const res = await request(app).get('/api/events').query({ q: 'zzz-no-match' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});
