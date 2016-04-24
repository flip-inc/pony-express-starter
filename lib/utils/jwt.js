'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');

const config = require('../config');

const JwtUtils = {

  /**
   * Generates a JWT token
   * @param  {Object} payload The payload to be signed
   * @param  {Object} opts    Options passed along to jwt.sign
   * @return {String}         The token generated
   */
  generateToken(payload, opts) {
    opts = opts ? opts : {};

    _.defaults(opts, {
      expiresIn: '30d',
      audience: 'user:registered'
    });

    return jwt.sign(payload, config.jwtSecret, opts);
  },

  /**
   * Verifies a given JWT token against Flip's secret key
   * @param  {String} token The token
   * @return {Object}       The decoded object or an error
   */
  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  },

};

module.exports = JwtUtils;