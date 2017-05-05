'use strict';

const _ = require('lodash');
const repl = require('repl');

const config = require('./lib/config');
const knex = require('./lib/config/database');
const models = require('./lib/models');

const cli = repl.start({
  prompt: 'cli > ',
});

cli.context._ = _;
cli.context.config = config;
cli.context.knex = knex;

_.each(models, (val, key) => {
  cli.context[key] = val;
});