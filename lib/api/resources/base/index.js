'use strict';

const _ = require('lodash');
const pony = require('pony-express');

const UserOrAdminAuthorization = require('../../authorization').UserOrAdminAuthorization;

const Resource = pony.Resource;

class BaseResource extends Resource {

  initialize() {
    this.allowedFilters = [];
    this.allowedIncludes = [];
    this.authentication = new pony.authentication.UserAuthentication();
    this.authorization = new UserOrAdminAuthorization();
    this.identifier = ':uuid';
  }

};

module.exports = BaseResource;