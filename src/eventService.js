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

/**
 * Work item 102: events whose title or description contains the keyword
 * (case-insensitive, surrounding whitespace ignored). A missing or blank
 * keyword returns every event.
 */
function searchEvents(store, keyword) {
  const q = String(keyword ?? '').trim().toLowerCase();
  const events = listEvents(store);
  if (!q) return events;
  return events.filter((e) => `${e.title}\n${e.description}`.toLowerCase().includes(q));
}

module.exports = { createStore, listEvents, getEvent, seatsRemaining, searchEvents };
