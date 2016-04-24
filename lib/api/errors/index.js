'use strict';

const _ = require('lodash');
const StackTrace = require('stacktrace-js');

const config = require('../../config');

module.exports = {

  errors: {

    Auth: require('./auth'),
    Common: require('./common'),
    Users: require('./users'),

  },

  /**
   * Middleware method for parsing an API error and returning an appropriate response.
   */
  errorHandler: function(error, req, res, next) {
    let json = {};

    _.defaults(json, {
      statusCode: error.statusCode || error.httpStatusCode || 500,
      message: error.errorMessage || 'Sorry, we ran in to an error while processing your request. If this problem persists, please contact support.'
    });

    if (_.isError(error)) {
      StackTrace.fromError(error).then(function(stack){
        console.log(stack);
        console.log(error);
      });
    }

    if (config.env === 'development' && _.isError(error)) {
      res.status(json.statusCode).send(
        '------- ERROR STACK SHOWN IN DEVELOPMENT ONLY --------\n' +
        error.stack +
        '\n------------------------------------------------------\n\n' +
        JSON.stringify(json)
      );
    } else {
      res.status(json.statusCode).json(json);
    }
  }

};