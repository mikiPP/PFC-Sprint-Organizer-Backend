const mongoose = require('mongoose');

module.exports.fakeController = {
  res: {
    statusCode: 500,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      return data;
    },
  },
};


module.exports.checkIfIdIsValid = function (id,res,next) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return;
  }else {
    const error = new Error(`this id: ${id} is invalid!`);
    error.statusCode = 422;
    res.statusCode = 422; // just for testing
    return next(error);
  }
};