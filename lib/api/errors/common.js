/**
 * Common API errors.
 *
 * All errors need the following fields:
 *
 * `statusCode`: The status code to return in the HTTP response
 * `message`: A message string or array of messages to return in the JSON response.
 */


var CommonErrors = {

  /**
   * Thrown when a form is submitted with missing required fields.
   */
  REQUIRED_FORM_FIELDS: function(missingFields) {
    missingFields = Array.isArray(missingFields) ? missingFields : [];

    var message;

    if (missingFields.length) {
      message = 'Oops! It looks like the following required field(s) are missing: ' + missingFields.join(', ') + '.';
    } else {
      message = 'Oops! One or more of the required fields are missing, please double check the form and resubmit.';
    }

    return {
      statusCode: 400,
      errorMessage: message
    };
  },

  NOT_IMPLEMENTED: {
    statusCode: 501,
    errorMessage: 'Method not implemented.'
  },

  /** Thrown when listing doesn't exist. */
  NOT_FOUND: {
    statusCode: 404,
    errorMessage: 'Resource not found.'
  },

};

module.exports = CommonErrors;