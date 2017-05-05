'use strict';

const morgan = require('morgan');

const config = require('./env');

module.exports = function(app) {
  if (config.env === 'production') {
    app.use(morgan('common'));
  } else {
    app.use(morgan('dev'));
  }
};