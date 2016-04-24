'use strict';

const _ = require('lodash');
const pony = require('pony-express');

const Resource = pony.Resource;

class BaseResource extends Resource {

  initialize() {
    this.allowedFilters = [];
    this.allowedIncludes = [];
    this.authentication = new pony.authentication.BaseAuthentication();
    this.authorization = new pony.authorization.BaseAuthorization();
    this.identifier = ':uuid';
  }

};

module.exports = BaseResource;