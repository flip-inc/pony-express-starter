'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('bookshelf');
const uuid = require('node-uuid');

const config = require('../../config');
const database = require('../../config/database');

// Initializes the ORM and gives us the ORM object to extend.
const orm = new Bookshelf(database.knex);

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
 *
 * All Flip models should extend from orm.Model.
 */
orm.Model = orm.Model.extend({

  // Bookshelf `hasTimestamps` - handles created_at and updated_at properties
  hasTimestamps: true,
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
  onCreated(model, attrs, options) {},
  onCreating(model, attrs, options) {},
  onDestroyed(model, attrs, options) {},
  onDestroying(model, attrs, options) {},
  onFetched(model, resp, options) {},
  onFetching(model, columns, options) {},
  onSaved(model, resp, options) {},
  onSaving(model, attrs, options) {},
  onUpdated(model, resp, options) {},
  onUpdating(model, attrs, options) {},
  
}, {

});

module.exports = orm;