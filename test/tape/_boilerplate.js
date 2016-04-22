'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const test = require('blue-tape');

test('Example test', (t) => {

  // Setup
  t.plan(2);

  // Exercise
  let truthy = true;
  let falsy = 0;

  // Verify
  t.ok(truthy, 'should be truthy');
  t.notOk(falsy, 'should be falsy');

  // Teardown

});