'use strict';

/**
 * Extend Method
 *
 * Taken from Backbone Source:
 * http://backbonejs.org/docs/backbone.html#section-189
 */

const _ = require('lodash');

module.exports = function extend(protoProps, staticProps) {
  let parent = this;
  let child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() { return parent.apply(this, arguments); };
  }

  _.extend(child, parent, staticProps);

  let Surrogate = function() { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  if (protoProps) _.extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  return child;
};