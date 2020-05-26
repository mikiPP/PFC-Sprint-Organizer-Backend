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

module.exports.checkFilteredData = (object, res, objectName) => {
  if (object) {
    const jsonData = {};
    jsonData.message = `${objectName} has been fetched successfully`;
    jsonData[objectName] = object;
    res.status(200).json(jsonData);

    return object;
  }

  const error = new Error(
    'Something wrong  have ocurred please, try it again !'
  );
  error.statusCode = 404;
  throw error;
};

module.exports.checkSavedData = (objectSaved, objectName) => {
  if (!objectSaved) {
    const error = new Error(
      `The ${objectName} has not been created, please try it again!`
    );
    error.statusCode = 500;
    throw error;
  }
};
