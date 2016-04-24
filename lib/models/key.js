'use strict';

const orm = require('./base');

const Key = orm.Model.extend({

  requests() {
    return this.hasMany('Request', 'keyId');
  },

  user() {
    return this.belongsTo('User', 'userId');
  },

  defaults() {
    return {
      createdAt: new Date(),
      key: uuid.v4(),
      updatedAt: new Date()
    };
  },

  tableName: 'keys',

}, {

});

const Keys = orm.Collection.extend({
    model: Key
});
orm.collection('Keys', Keys);

module.exports = orm.model('Key', Key);