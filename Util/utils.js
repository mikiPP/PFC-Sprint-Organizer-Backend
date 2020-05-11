module.exports.fakeController = {
  req: {
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
