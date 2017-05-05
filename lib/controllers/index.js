'use strict';

/** Health check. */
exports.healthCheck = (req, res, next) => {
  res.send('Knock.');
};