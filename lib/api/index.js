'use strict';

const API_ROOT = '/api/v1.0';

const pony = require('pony-express');

const middleware = require('./middleware');
const resources = require('./resources');

const api = new pony.Api({ apiRoot: API_ROOT });

// Setup the error handler
api.errorHandler = errors.errorHandler;

// Add pre-resource middleware
api.before(middleware.addHeaders);

// Mount resources
api.mount([
  resources.AuthResource,
  resources.UserResource
]);

module.exports = {
  apiRoot: API_ROOT,
  api: api,
  resources: resources
};