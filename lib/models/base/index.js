'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('bookshelf');
const uuid = require('uuid');

const config = require('../../config/env');
const emitter = require('../../events');
const knex = require('../../config/database');

// Initializes the ORM and gives us the ORM object to extend.
let Orm = (() => {
  let instance;

  let createInstance = () => {
    const orm = new Bookshelf(knex);
    return orm;
  }

  return {
    getInstance: () => {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();

const orm = Orm.getInstance();


/**
 * Load Bookshelf plugins.
 *
 * `registry`: Bookshelf registry plugin, helps us avoid circular dependencies
 * `virtuals`: Bookshelf virtuals plugin, helps us define dynamic fields
 */
orm.plugin('registry');
orm.plugin('virtuals');

/**
 * Extend bookshelf.Model with the new orm.Model.
 */
orm.Model = orm.Model.extend({

  // Bookshelf `hasTimestamps` - handles created_at and updated_at properties
  hasTimestamps: [
    'createdAt',
    'updatedAt'
  ],
  virtuals: {},

  // Bookshelf `defaults` - default values setup on every model creation
  defaults() {
    return {
      uuid: uuid.v4()
    };
  },

  // Bookshelf `initialize` - declare a constructor-like method for model creation
  initialize() {
    const options = arguments[1] || {};

    // Setup events
    this.on('created', this.onCreated, this);
    this.on('creating', this.onCreating, this);

    this.on('destroyed', this.onDestroyed, this);
    this.on('destroying', this.onDestroying, this);

    this.on('fetched', this.onFetched, this);
    this.on('fetching', this.onFetching, this);

    this.on('saved', this.onSaved, this);
    this.on('saving', this.onSaving, this);

    this.on('updated', this.onUpdated, this);
    this.on('updating', this.onUpdating, this);
  },

  // Default event handlers. See: http://bookshelfjs.org/#Model-subsection-events
  onCreated(model, attrs, options) {
    if (model.constructor.Events && model.constructor.Events.CREATED) emitter.emit(model.constructor.Events.CREATED, { model: model });
  },
  onCreating(model, attrs, options) {},
  onDestroyed(model, attrs, options) {
    if (model.constructor.Events && model.constructor.Events.DESTROYED) emitter.emit(model.constructor.Events.DESTROYED, { model: model, attrs: attrs });
  },
  onDestroying(model, attrs, options) {},
  onFetched(model, resp, options) {},
  onFetching(model, columns, options) {},
  onSaved(model, resp, options) {
    if (model.constructor.Events && model.constructor.Events.SAVED) emitter.emit(model.constructor.Events.SAVED, { model: model });
  },
  onSaving(model, attrs, options) {},
  onUpdated(model, resp, options) {
    if (model.constructor.Events && model.constructor.Events.UPDATED) emitter.emit(model.constructor.Events.UPDATED, { model: model });
  },
  onUpdating(model, attrs, options) {},

}, {

});

module.exports = orm;