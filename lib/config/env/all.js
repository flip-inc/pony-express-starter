'use strict';

const path = require('path');
const rootPath = path.normalize(__dirname + '/../../../');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  root: rootPath,
  port: process.env.PORT || 1338
};