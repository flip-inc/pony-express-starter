'use strict';

const config = require('./env');

const knex = require('knex')({
  client: config.database.client,
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  }
});

module.exports = knex;