'use strict';

const _ = require('lodash');
const pony = require('pony-express');
const Promise = require('bluebird');

const orm = require('../../models').orm;
const utils = require('../../utils');

const User = orm.model('User');
const UserAuthorization = pony.authorization.UserAuthorization;

class UserOrAdminAuthorization extends UserAuthorization {

  /** UserOrAdminAuthorization filters the query on opts.relationIdField === req.user[opts.userIdField] */
  preDefault(bundle) {
    // if the admin is using their superpowers, don't override them
    if (User.isSuper(bundle.req)) return Promise.resolve();
    
    return super.preDefault(bundle);
  }

  /** Make sure resource.body has this.opts.relationIdField and is assigned to req.user[this.opts.userIdField] */
  prePost(bundle) {
    // if the admin is using their superpowers, don't override them
    if (User.isSuper(bundle.req) && bundle.body[this.opts.relationIdField]) return Promise.resolve();

    return super.prePost(bundle);
  }

}

module.exports = UserOrAdminAuthorization;