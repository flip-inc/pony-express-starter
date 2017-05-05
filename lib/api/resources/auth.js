/** 
 * AuthResource
 */
'use strict';

const _ = require('lodash');
const pony = require('pony-express');

const config = require('../../config');
const orm = require('../../models').orm;
const UserResource = require('./user');
const utils = require('../../utils');

const User = orm.model('User');

class AuthResource extends UserResource {

  initialize() {
    super.initialize();

    this.allowedEndpoints = ['getList'];
    this.allowedFilters = [];
    this.allowedIncludes = [];
    this.authorization = new pony.authorization.UserAuthorization({ relationIdField: 'id' });
    this.customEndpoints = [
      'get#list me getSession',
      'post#list login skipAuthentication skipAuthorization',
      'post#list logout skipAuthorization',
      'post#list register skipAuthentication skipAuthorization',
    ];
    this.Model = User;
    this.resourceName = 'auth';
  }

  getSession(bundle) {
    let req = bundle.req;
    req.params.uuid = req.user.uuid;
    return this.getDetail(bundle);
  }

  getList(bundle) {
    let req = bundle.req;
    req.params.uuid = req.user.uuid;
    return this.getDetail(bundle);
  }

  login(bundle) {
    const req = bundle.req;

    const isSuper = User.isSuper(req);

    if (req.user && !isSuper) return Promise.reject(Errors.ALREADY_LOGGED_IN);

    const email = req.body.email;
    const password = req.body.password;

    // let the resource handle creating the error for required fields
    let isValid = this.validateRequiredFields(req.body, ['email', 'password']);
    if (isValid !== true) return Promise.reject(Errors.LOGIN_VALIDATION_FAILED);
    if (!_.trim(email).length || !_.trim(password).length) return Promise.reject(Errors.LOGIN_VALIDATION_FAILED);
    
    let user = User.forge({ email: email.toLowerCase() });

    return user.fetch().then((user) => {
      if (!user) return Promise.reject(Errors.USER_NOT_FOUND);

      // attempt to authenticate the user
      if (!user.authenticate(password) && !isSuper) return Promise.reject(Errors.AUTHENTICATION_FAILED);
      
      // sign JWT token
      const token = utils.jwt.generateToken({
        userId: user.get('uuid')
      });
      const now = new Date();

      if (!isSuper) user.save({ lastSeen: now, }, { patch: true, });

      return Promise.resolve(token);
    }).then((token) => {
      user.set('token', token);
      bundle.objects = user;
      return Promise.resolve();
    });
  }

  logout(bundle) {
    bundle.res.status(200).send('Logged out.');
    return Promise.reject(new pony.errors.CleanExitError());
  }

  register(bundle) {
    let req = bundle.req;

    if (req.user) return Promise.reject(Errors.ALREADY_LOGGED_IN);

    req.body.email = req.body.email.toLowerCase();
    const email = req.body.email;
    const password = req.body.password;

    // let the resource handle creating the error for required fields
    let isValid = this.validateRequiredFields(req.body, ['email', 'password',]);
    if (isValid !== true) return Promise.reject(Errors.REGISTRATION_VALIDATION_FAILED);
    if (!_.trim(email).length || !_.trim(password).length) return Promise.reject(Errors.REGISTRATION_VALIDATION_FAILED);

    // Validate
    let emailRe = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
    if (!emailRe.test(email)) return Promise.reject(Errors.INVALID_EMAIL_ERROR);
    if (password.length < 8) return Promise.reject(Errors.INVALID_PASSWORD_ERROR);

    let user = User.forge();

    let query = {
      where: { email: email },
    };

    return user.query(query).fetch().then((found) => {
      if (found) {
        if (found.get('isActive')) return Promise.reject(Errors.USER_EXISTS);
      }

      // if no user is found, continue with registration
      const registrationFields = ['email', 'password',];
      let userData = _.clone(req.body);

      userData = _.pick(userData, registrationFields);

      userData.isActive = true;
      userData.lastSeen = new Date();

      return found ? found.save(userData) : User.forge(userData).save();
    }).then((newUser) => {
      if (!newUser) return Promise.reject(Errors.REGISTRATION_ERROR);

      let token = utils.jwt.generateToken({
        userId: newUser.get('uuid')
      });
      newUser.set('token', token);
      bundle.objects = newUser;

      return Promise.resolve();
    }).catch((err) =>  {
      console.log(err);
      if (err.errorMessage) return Promise.reject(err);
      return Promise.reject(Errors.REGISTRATION_ERROR);
    });
  }

};

const Errors = {

  ALREADY_LOGGED_IN: {
    errorMessage: 'You are already signed in to an account. Please log out before trying to login/register.',
    statusCode: 400,
  },

  AUTHENTICATION_FAILED: {
    errorMessage: 'The provided email or password is incorrect.',
    statusCode: 400,
  },

  INVALID_EMAIL_ERROR: {
    errorMessage: 'The email address is invalid.',
    statusCode: 400,
  },

  INVALID_PASSWORD_ERROR: {
    errorMessage: 'Passwords must be at least 8 characters long.',
    statusCode: 400,
  },

  LOGIN_VALIDATION_FAILED: {
    errorMessage: 'Email and password is required to login.',
    statusCode: 400,
  },

  REGISTRATION_ERROR: {
    errorMessage: 'There was an error during registration.',
    statusCode: 500,
  },

  REGISTRATION_VALIDATION_FAILED: {
    errorMessage: 'Email and password fields are required for registration.',
    statusCode: 400,
  },

  USER_NOT_FOUND: {
    statusCode: 404,
    errorMessage: 'User not found.',
  },

  USER_EXISTS: {
    errorMessage: 'An account has already been created for this email. Please log in.',
    statusCode: 400,
  },

};

module.exports = AuthResource;