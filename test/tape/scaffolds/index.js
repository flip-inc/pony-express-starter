'use strict';

const async = require('async');
const orm = require('../../../lib/models').orm;
const Promise = require('bluebird');

const SCAFFOLDS = [
  require('./users'),
];

const argv = require('minimist')(process.argv.slice(2));

module.exports = {

  setUp: () => {
    if (!argv.scaffold) return Promise.resolve();

    // Make sure test database is migrated then run setup
    return orm.knex.migrate.latest({
      directory: 'lib/migrations'
    }).then(() => {
      return new Promise((resolve, reject) => {
        async.eachSeries(SCAFFOLDS.map(s => s.setUp), (setUp, cb) => {
          setUp().then(() => { cb(); }).catch((err) => { reject(err); });
        }, () => { resolve(); });
      });
    });
  },

  tearDown: () => {
    if (process.env.NODE_ENV !== 'test') return Promise.reject('Tests can only be run with NODE_ENV=test');
    if (!argv.scaffold) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      async.eachSeries(SCAFFOLDS.map(s => s.tearDown.bind(null, argv.scaffold)).reverse(), (tearDown, cb) => {
        tearDown().then(() => { cb(); }).catch((err) => { reject(err); });
      }, () => { resolve(); });
    });
  }

};