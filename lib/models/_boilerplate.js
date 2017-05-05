'use strict';

const _ = require('lodash');

const orm = require('./base');

const _Model = orm.Model.extend({

  tableName: '',

}, {

});

const _Collection = orm.Collection.extend({
  model: _Model
});
orm.collection('_Collection', _Collection);

module.exports = orm.model('_Model', _Model);