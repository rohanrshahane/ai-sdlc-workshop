'use strict';

const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => {
  console.log(`Campus Events running at http://localhost:${port}`);
});
