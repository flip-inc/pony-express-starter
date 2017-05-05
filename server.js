'use strict';

const _ = require('lodash');
const express = require('express');
const Promise = require('bluebird');

const config = require('./lib/config/env');
const app = express();

new Promise((resolve) => {
  console.log('Initializing server.js...');

  // Load initializers
  require('./lib/config/initializers');

  // Load Express config
  require('./lib/config/express')(app);

  // Load models
  require('./lib/models');

  // Load middleware
  require('./lib/config/middleware')(app);

  // Load routes
  require('./lib/routes')(app);

  // start the app
  app.listen(app.get('port'), (server) => {
    console.log('Done!\n\nServer listening on port %d in %s mode', app.get('port'), app.get('env'));
  });

});

module.exports = app;