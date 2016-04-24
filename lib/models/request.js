'use strict';

const orm = require('./base');

const Request = orm.Model.extend({

  key() {
    return this.belongsTo('Key', 'requestId');
  },

  defaults() {
    return {
      createdAt: new Date()
    };
  },

  hasTimestamps: false,
  tableName: 'requests',

}, {

});

const Requests = orm.Collection.extend({
    model: Request
});
orm.collection('Requests', Requests);

module.exports = orm.model('Request', Request);