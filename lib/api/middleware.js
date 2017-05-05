'use strict';

const config = require('../config');
const utils = require('../utils');

const orm = require('../models').orm;

const User = orm.model('User');

/** Middleware to decode user by checking for a JWT token in the headers. */
function decodeUser(req, res, next) {
  let token = req.headers[config.tokenName];

  req.user = null;

  if (!token) return next();

  let decoded;
  let user;

  // JWT throws an error if verifyToken fails. catch it and return unauthorized.
  try {
    decoded = utils.jwt.verifyToken(token);

    user = User.forge({ uuid: decoded.userId });

    user.fetch().then((user) => {
      if (!user) next();
      req.user = user.serialize();

      next();
    });
  } catch(err) {
    if (err.name && err.name === 'TokenExpiredError') return res.sendStatus(498);
    if (err.name && err.name === 'JsonWebTokenError') return res.sendStatus(498);
    next();
  }
}

/** Middleware to setHeaders on res */
function addHeaders(req, res, next) {
  const allowedOrigins = [config.domain.web];
  const origin = req.headers.origin;

  // Website you wish to allow to connect
  if (allowedOrigins.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, ' + config.tokenName);

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
}

/** Verify req.user */
function authCheck(req, res, next) {
  if (req.user === null) return res.sendStatus(401);
  next();
}

module.exports = {
  addHeaders: addHeaders,
  authCheck: authCheck,
  decodeUser: decodeUser,
};