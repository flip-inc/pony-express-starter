'use strict';

const _ = require('lodash');
const faker = require('faker');
const Promise = require('bluebird');

const orm = require('../../../lib/models').orm;

const User = orm.model('User');

const NUM_USERS = 10;

module.exports = {

  setUp: () => {
    return Promise.all(_.map(_.range(1, NUM_USERS + 1), (id) => {
      let email = `test-${id}`;

      return User.forge({
        email: email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        isActive: true,
        password: '1234567890',
        role: User.ROLES.User,
      }).save();
    }));
  },

  tearDown: () => {
    if (process.env.NODE_ENV !== 'test') return Promise.reject('Tests can only be run with NODE_ENV=test');
    return orm.knex.raw("DELETE FROM users;");
  }

};