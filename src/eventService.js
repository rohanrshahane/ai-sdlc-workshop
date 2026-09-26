'use strict';

const seed = require('./data/events.json');

/**
 * Creates an in-memory event store. Each call returns an independent copy,
 * so tests never share state.
 */
function createStore(events = seed) {
  return events.map((e) => ({ ...e }));
}

/** Returns all events sorted by date, then time. */
function listEvents(store) {
  return [...store].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

/** Returns one event by id, or undefined. */
function getEvent(store, id) {
  return store.find((e) => e.id === Number(id));
}

/** Seats still available for an event. */
function seatsRemaining(event) {
  return Math.max(0, event.capacity - event.registered);
}

module.exports = { createStore, listEvents, getEvent, seatsRemaining };
