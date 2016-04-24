'use strict';

const pony = require('pony-express');

const BaseResource = require('./base');
const User = require('../../models/user');

class UserResource extends BaseResource {

  initialize() {
    super.initialize();

    this.allowedEndpoints = ['getList', 'put'];
    this.authorization = new pony.authorization.UserAuthorization({ relationIdField: 'id' });
    this.customEndpoints = [
      'get#list me getSession',
      'post#list reset-password resetPassword skipAuthorization',
    ];
    this.fields = {
      createdAt: { readOnly: true },
      email: { readOnly: true },
      firstName: {},
      isActive: { readOnly: true },
      lastLogin: { readOnly: true },
      lastName: {},
      role: { readOnly: true },
      updatedAt: { readOnly: true },
      uuid: { readOnly: true },
    };
    this.Model = User;
    this.resourceName = 'user';
  }

  getSession(req, res, next) {
    req.params.uuid = req.user.uuid;
    this._getDetail(req, res, next);
  }

  _getList(req, res, next) {
    this.getSession(req, res, next);
  }

  resetPassword(req, res, next) {
    res.status(501).send();
  }

}

module.exports = UserResource;