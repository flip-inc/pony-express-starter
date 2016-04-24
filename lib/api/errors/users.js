/**
 * API user errors.
 *
 * All errors need the following fields:
 *
 * `statusCode`: The status code to return in the HTTP response
 * `message`: A message string or array of messages to return in the JSON response.
 */

var UserErrors = {

  // Common errors

  /**
   * Thrown when User.authenticate fails.
   */
  AUTHENTICATION_FAILED: {
    statusCode: 400,
    errorMessage: 'The provided email or password is incorrect.',
  },

  /**
   * Thrown when no user is returned from a query.
   */
  USER_NOT_FOUND: {
    statusCode: 404,
    errorMessage: 'User not found.',
  },

};

module.exports = UserErrors;