'use strict';

const config = require('./lib/config');

module.exports = {

  development: {
    client: '',
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: '',
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: '',
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    },
    migrations: {
      directory: 'lib/migrations',
      tableName: 'knex_migrations'
    }
  }

};
