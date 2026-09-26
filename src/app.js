'use strict';

const path = require('path');
const express = require('express');
const { createStore, searchEvents, getEvent, seatsRemaining } = require('./eventService');

function createApp({ store = createStore() } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const toDto = (e) => ({ ...e, seatsRemaining: seatsRemaining(e) });

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/events', (req, res) => {
    res.json(searchEvents(store, req.query.q).map(toDto));
  });

  app.get('/api/events/:id', (req, res) => {
    const event = getEvent(store, req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(toDto(event));
  });

  return app;
}

module.exports = { createApp };
