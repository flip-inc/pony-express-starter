'use strict';

const config = require('./lib/config');

module.exports = {

  development: {
    client: config.database.client,
    connection: {
      database: config.database.database,
      host: config.database.host,
      password: config.database.password,
      port: config.database.port,
      user: config.database.user,
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: config.database.client,
    connection: {
      database: config.database.database,
      host: config.database.host,
      password: config.database.password,
      port: config.database.port,
      user: config.database.user,
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: config.database.client,
    connection: {
      database: config.database.database,
      host: config.database.host,
      password: config.database.password,
      port: config.database.port,
      user: config.database.user,
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  }

};
