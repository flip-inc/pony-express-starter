'use strict';

/**
 * API authentication errors.
 *
 * All errors need the following fields:
 *
 * `statusCode`: The status code to return in the HTTP response
 * `message`: A message string or array of messages to return in the JSON response.
 */

let AuthErrors = {

  /**
   * Thrown when a user isn't authenticated.
   */
   UNAUTHORIZED: {
    statusCode: 401,
    errorMessage: 'You are not authorized to access this resource.'
   },

  /**
   * Thrown when a user sends an expired or invalid token.
   */
   BAD_TOKEN: {
    statusCode: 401,
    errorMessage: 'This token is invalid.'
   },

  /**
   * Thrown when input validation on a given email and password fails.
   */
  LOGIN_VALIDATION_FAILED: {
    statusCode: 400,
    errorMessage: 'Email and password is required to login.',
  },

  /**
   * Thrown when a user tries to register with an email that already exists.
   */
  USER_EXISTS: {
    statusCode: 400,
    errorMessage: 'An account has already been created for this email. Please log in.',
  },

  /**
   * A generic registration error.
   */
  REGISTRATION_ERROR: {
    statusCode: 500,
    errorMessage: 'There was an error during registration.',
  },

  REGISTRATION_VALIDATION_FAILED: {
    statusCode: 400,
    errorMessage: 'Email, password, and name fields are required for registration.',
  },

  ALREADY_LOGGED_IN: {
    statusCode: 400,
    errorMessage: 'You are already signed in. Please log out before trying to login/register.',
  }

};

module.exports = AuthErrors;