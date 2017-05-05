'use strict';

if (process.env.NODE_ENV !== 'test') throw new Error('Tests can only be run with NODE_ENV=test');

const argv = require('minimist')(process.argv.slice(2));
const express = require('express');
const Promise = require('bluebird');
const test = require('blue-tape');

const app = express();
const config = require('../../lib/config');
const orm = require('../../lib/models').orm;

if (config.env === 'production') throw new Error('BRUH DON\'T RUN TESTS IN PRODUCTION MODE... WTF U THINKIN');

// Load scaffolding to populate database
const scaffolds = require('./scaffolds');

let cleanUp = (err) => {
  process.nextTick(() => {
    if (err) return process.exit(1);
    return process.exit(0);
  });
};

if (!argv.debug) console.trace = () => {};

// Start the API server
new Promise((resolve) => {
  console.log('Initializing app...');
  // Load initializers
  require('../../lib/config/initializers');

  // Load Express config
  require('../../lib/config/express')(app);

  // Load models and events
  require('../../lib/models');

  // Load middleware
  require('../../lib/config/middleware')(app);

  // Load routes
  require('../../lib/routes')(app);

  // start the app
  app.listen(app.get('port'), (server) => {
    console.log('Done!\n\nServer listening on port %d in %s mode', app.get('port'), app.get('env'));
    resolve();
  });
}).then(() => {
  if (argv.scaffold) console.log('Populating the test database, this may take a hot minute...');
  scaffolds.tearDown().then(scaffolds.setUp).then(() => {
    // Maybe this helps model events from scaffold setUp run before the tests... maybe it doesn't ¯\_(ツ)_/¯
    process.nextTick(() => {
      if (argv.scaffold) console.log('Populated af!');

      // Load the tests
      if (argv.only) {
        require('./' + argv.only);
      } else {
        require('./integration');
        require('./unit');
      }

      // When all the tests are done, we have to tear down the
      // knex connection manually or the tests hang.
      test.onFinish(cleanUp);
    });
  }).catch((err) => {
    console.log(err);
    cleanUp(err);
  });
});


