'use strict';

const config = require ('./env');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

module.exports = function(app) {
  app.set('port', config.port);
  app.set('env', config.env);
  app.set('trust proxy', true);
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.raw());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.xml());
};
