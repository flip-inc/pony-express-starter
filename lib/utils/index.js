'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');

module.exports = {

  extend: require('./extend'),
  jwt: require('./jwt'),

  /**
   * Hashes a given password and returns the hash. (async)
   * 
   * @param  {String} password
   * @param {Function} done The callback function for async hash method.
   */
  hashPassword: function(password, done) {
    bcrypt.hash(password, 10, done);
  },

  /**
   * Hashes a given password and returns the hash. (sync)
   * 
   * @param  {String} password
   * @return {String} The hashed password
   */
  hashPasswordSync: function(password) {
    return bcrypt.hashSync(password, 10);
  }

};