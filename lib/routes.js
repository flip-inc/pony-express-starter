'use strict';

const _ = require('lodash');
const express = require('express');

const config = require('./config');

const Api = require('./api');

module.exports = function(app) {
  // Expose our pony-express routes
  Api.api.expose(app);
};