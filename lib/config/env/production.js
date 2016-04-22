'use strict';

const _ = require('lodash');
const secrets = require('../secrets');

module.exports = _.merge({

  database: {
    client: '',
    database: '',
    host: '',
    user: '',
    password: '',
    port: 5432,
    pool: false,
    ssl: false,
  }

}, secrets.production);