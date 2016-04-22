'use strict';

const _ = require('lodash');
const express = require('express');
const Promise = require('bluebird');
const git = require('git-rev');

const config = require('./lib/config/env');
const app = express();

new Promise((resolve) => {
  
  // get the current git version and set it as config.VERSION
  // good for cache-busting
  git.tag((tag) => { config.VERSION = tag; resolve(); });

}).then(() => {
  // Load initializers
  require('./lib/config/initializers');

  // Load Express config
  require('./lib/config/express')(app);

  // Load the models
  require('./lib/models');

  // Load middleware
  require('./lib/config/middleware')(app);

  // Load routes
  require('./lib/routes')(app);

  // start the app
  app.listen(app.get('port'), (server) => {
    console.log('Server listening on port %d in %s mode', app.get('port'), app.get('env'));
  });

});

module.exports = app;