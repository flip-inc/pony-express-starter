'use strict';

const EventEmitter = require('events');

class SingletonEmitter extends EventEmitter {}

let Emitter = (() => {
  let instance;

  let createInstance = () => {
    let emitter = new SingletonEmitter();
    return emitter;
  }

  return {
    getInstance: () => {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();

module.exports = Emitter.getInstance();