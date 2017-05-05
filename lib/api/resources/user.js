'use strict';

const pony = require('pony-express');

const BaseResource = require('./base');
const orm = require('../../models').orm;
const UserOrAdminAuthorization = require('../authorization').UserOrAdminAuthorization;

const User = orm.model('User');

class UserResource extends BaseResource {

  initialize() {
    super.initialize();

    this.allowedEndpoints = ['getList', 'put'];
    this.authorization = new UserOrAdminAuthorization({ relationIdField: 'id' });
    this.customEndpoints = [
      'get#list me getSession',
    ];
    this.fields = {
      createdAt: { readOnly: true },
      email: { readOnly: true },
      firstName: {},
      isActive: { readOnly: true },
      lastSeen: { readOnly: true },
      lastName: {},
      role: { readOnly: true },
      updatedAt: { readOnly: true },
      uuid: { readOnly: true },
    };
    this.Model = User;
    this.resourceName = 'user';
  }

  getSession(bundle) {
    bundle.req.params.uuid = bundle.req.user.uuid;

    return this.getDetail(bundle).then((user) => {
      return user.save({ lastSeen: new Date(), }, { patch: true, });
    });
  }

  getList(bundle) {
    return this.getSession(bundle);
  }

}

module.exports = UserResource;