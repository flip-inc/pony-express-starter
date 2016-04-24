'use strict';

const bcrypt = require('bcrypt');

const orm = require('./base');

const User = orm.Model.extend({

  keys() {
    return this.hasMany('Key', 'userId');
  },

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
    return this.get('role') === User.ROLES.Admin;
  },

  isSuper(req) {
    return this.isAdmin() && _.has(req.query, 'superman');
  },

  onCreating(model, attrs, options) {
    // Set default role to User if it isn't set
    if (!model.get('role')) model.set('role', User.ROLES.User);

    return new Promise((resolve, reject) => {
      // Attempt to hash password
      utils.hashPassword(model.get('password'), (err, hash) => {
        if (err) reject(err);
        model.set('password', hash);
        resolve(hash);
      });
    });
  },

}, {

  ROLES: {
    User: 0,
    Admin: 9
  },

  isAdmin(user) {
    if (!user) return false;
    if (_.has(user, 'get')) return user.get('role') === User.ROLES.Admin;
    return user.role === User.ROLES.Admin;
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