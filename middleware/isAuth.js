const jwt = require('jsonwebtoken');
const utils = require('../Util/utils');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      'dWJcaHVt5wOGCmxGAbt3ApKNcE47i4Hz5ESTjvRFXQ9smeFUWXFpWmJMUP3yXWh'
    );
  } catch (err) {
    utils.errorHandler(err, res, next);
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
