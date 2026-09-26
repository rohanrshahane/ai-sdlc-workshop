'use strict';

const { createStore, listEvents, getEvent, seatsRemaining } = require('../../src/eventService');

describe('eventService (work item 101)', () => {
  test('listEvents returns every event sorted by date and time', () => {
    const store = createStore();
    const events = listEvents(store);
    expect(events).toHaveLength(store.length);
    const keys = events.map((e) => `${e.date} ${e.time}`);
    expect(keys).toEqual([...keys].sort());
  });

  test('getEvent finds an event by numeric or string id', () => {
    const store = createStore();
    expect(getEvent(store, 1).title).toBe('Intro to Machine Learning');
    expect(getEvent(store, '2').title).toBe('Cloud Careers Panel');
  });

  test('getEvent returns undefined for an unknown id', () => {
    expect(getEvent(createStore(), 999)).toBeUndefined();
  });

  test('seatsRemaining never goes below zero', () => {
    expect(seatsRemaining({ capacity: 10, registered: 4 })).toBe(6);
    expect(seatsRemaining({ capacity: 10, registered: 10 })).toBe(0);
    expect(seatsRemaining({ capacity: 10, registered: 12 })).toBe(0);
  });

  test('createStore returns an independent copy', () => {
    const a = createStore();
    const b = createStore();
    a[0].registered = 999;
    expect(b[0].registered).not.toBe(999);
  });
});
