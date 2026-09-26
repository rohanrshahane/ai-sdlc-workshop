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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Work item 104: formats "2026-10-12" + "18:00" as "Mon, Oct 12, 2026 · 6:00 PM".
 * Pure and time-zone independent: the date is interpreted as a calendar date (UTC).
 */
function formatEventDateTime(date, time) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const weekday = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  const suffix = hh < 12 ? 'AM' : 'PM';
  return `${weekday}, ${MONTHS[m - 1]} ${d}, ${y} · ${hour12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

module.exports = { createStore, listEvents, getEvent, seatsRemaining, searchEvents, formatEventDateTime };
