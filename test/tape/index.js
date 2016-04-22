'use strict';

const test = require('blue-tape');

const orm = require('../../lib/models').orm;

// Load the tests

// When all the tests are done, we have to tear down the
// knex connection manually or the tests hang.
test.onFinish(() => {
  orm.knex.destroy();
});