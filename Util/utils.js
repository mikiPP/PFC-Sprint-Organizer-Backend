const mongoose = require('mongoose');

module.exports.fakeRes = {
  statusCode: 500,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    return data;
  },
};

module.exports.checkIfIdIsValid = function (id, res, next) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`this id: ${id} is invalid!`);
    error.statusCode = 422;
    res.statusCode = 422; // just for testing
    return next(error);
  }
};

module.exports.cleanObject = function (obj) {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
};

module.exports.errorHandler = function (error, res, next) {
  if (!error.statusCode) {
    error.statusCode = 500;
    res.statusCode = 500;
  }
  return next(error);
};

module.exports.checkNotFound = (object, id, className) => {
  if (!object) {
    const error = new Error(` Coudn't find ${className} by the id: ${id} `);
    error.statusCode = 404;
    throw error;
  }
};
