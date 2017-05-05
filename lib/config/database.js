'use strict';

const config = require('./env');

const knex = require('knex')({
  client: config.database.client,
  connection: {
    database: config.database.database,
    host: config.database.host,
    password: config.database.password,
    port: config.database.port,
    user: config.database.user,
  }
});

module.exports = knex;