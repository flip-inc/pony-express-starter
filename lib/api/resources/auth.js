/** 
 * AuthResource
 */
'use strict';

const _ = require('lodash');
const pony = require('pony-express');

const config = require('../../config');
const User = require('../../models/user');
const UserResource = require('./user');
const utils = require('../../utils');

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

  getSession(req, res, next) {
    req.params.uuid = req.user.uuid;
    this._getDetail(req, res, next);
  }

  getList(req, res, next) {
    req.params.uuid = req.user.uuid;
    this.getDetail(req, res, next);
  }

  login(req, res, next) {
    const isSuper = User.isSuper(req);

    if (req.user && !isSuper) return next(errors.Auth.ALREADY_LOGGED_IN);

    const email = req.body.email;
    const password = req.body.password;

    // let the resource handle creating the error for required fields
    let isValid = this.validateRequiredFields(req.body, ['email', 'password']);
    if (isValid !== true) return next(errors.Auth.LOGIN_VALIDATION_FAILED);
    
    let user = User.forge({ email: email });

    user.fetch({
      withRelated: []
    }).then((user) => {
      if (!user) return next(errors.Users.USER_NOT_FOUND);

      // make sure this user didn't login with Facebook and throw an error if they did

      // attempt to authenticate the user
      if (user.authenticate(password) || isSuper) {
        // sign JWT token
        let token = utils.jwt.generateToken({
          userId: user.get('uuid')
        });
        let now = new Date();

        if (!isSuper) user.save({ uuid: user.get('uuid'), lastLogin: now, lastLoginIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress, });

        return Promise.resolve(token);
      } else {
        return next(Errors.Users.AUTHENTICATION_FAILED);
      }
    }).then((token) => {
      user.set('token', token);
      this.bundle.objects = user;
      return Promise.resolve();
    }).catch(next).finally(next);
  }

  logout(req, res, next) {
    res.status(769).send('Bye Felicia');
  }

  register(req, res, next) {
    if (req.user) return next(errors.Auth.ALREADY_LOGGED_IN);

    const email = req.body.email;
    const password = req.body.password;

    // let the resource handle creating the error for required fields
    let isValid = this.validateRequiredFields(req.body, ['email', 'password']);
    if (isValid !== true) return next(errors.Auth.REGISTRATION_VALIDATION_FAILED);

    // TODO: validate email/password

    let user = User.forge();

    return user.query({
      where: { email: email }
    }).fetch().then((model) => {
      // if a user exists and is found with the same username or email, return an error
      if (model) return next(errors.Auth.USER_EXISTS);

      // if no user is found, continue with registration
      const registrationFields = ['email', 'password', 'confirmedTerms'];
      let userData = _.clone(req.body);

      userData = _.pick(userData, registrationFields);

      userData.lastLogin = new Date();
      userData.lastLoginIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      return User.forge(userData).save();
    }).then((newUser) => {
      if (!newUser) return next(errors.Auth.REGISTRATION_ERROR);
      return User.forge({ id: newUser.get('id') }).fetch();
    }).then((newUser) => {
      let token = utils.jwt.generateToken({
        userId: newUser.get('uuid')
      });
      newUser.set('token', token);
      this.bundle.objects = newUser;
      return Promise.resolve();
    }).catch((err) =>  {
      return next(errors.Auth.REGISTRATION_ERROR);
    }).finally(next);
  }

};

module.exports = AuthResource;