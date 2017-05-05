'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');

const orm = require('./base');
const utils = require('../utils');

const User = orm.Model.extend({

  tableName: 'users',

  /**
   * Authenticates a given password string against the user's hashed password and returns a Boolean.
   * 
   * @param  {String} password
   * @return {Boolean}
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.get('password') || uuid.v4());
  },

  isAdmin() {
    return this.get('role') === User.Roles.ADMIN;
  },

  isSuper(req) {
    return this.isAdmin() && _.has(req.query, 'superman');
  },

  onCreating(model, attrs, options) {
    // Set default role to User if it isn't set
    if (!model.get('role')) model.set('role', User.Roles.USER);

    if (model.get('password')) model.set('password', utils.hashPasswordSync(model.get('password')));
  },

  onSaving(model, attrs, opts) {
    // If the password isn't hashed, hash it.
    try {
      if (attrs.password) bcrypt.getRounds(attrs.password);
    } catch (err) {
      model.set('password', utils.hashPasswordSync(attrs.password));
    }

    // Double check the password on the model is hashed too
    try {
      if (model.get('password')) bcrypt.getRounds(model.get('password'));
    } catch (err) {
      model.set('password', utils.hashPasswordSync(model.get('password')));
    }
  },

  virtuals: {

    fullName() {
      if (!this.get('firstName') && !this.get('lastName')) return '';
      if (this.get('firstName') && !this.get('lastName')) return this.get('firstName');
      if (!this.get('firstName') && this.get('lastName')) return this.get('lastName');
      return this.get('firstName') + ' ' + this.get('lastName');
    },

    group() {
      return this.get('id') % 2;
    },

  }

}, {

  Events: {
    CREATED: `user:created`,
    DESTROYED: `user:destroyed`,
    SAVED: `user:saved`,
  },

  Roles: {
    USER: 1,
    ADMIN: 9
  },

  isAdmin(user) {
    if (!user) return false;
    if (_.has(user, 'get')) return user.get('role') === User.Roles.ADMIN;
    return user.role === User.Roles.ADMIN;
  },

  isSuper(req) {
    if (_.has(req.user, 'isAdmin')) return req.user.isAdmin() && _.has(req.query, 'superman');
    return User.isAdmin(req.user) && _.has(req.query, 'superman');
  },

});

const Users = orm.Collection.extend({
    model: User
});
orm.collection('Users', Users);

module.exports = orm.model('User', User);