const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../Models/employee');
const utils = require('../Util/utils');
const employeeController = require('./employeeController');

exports.signUp = (req, res, next) => {
  return employeeController
    .addEmployee(req, res, next)
    .then((employee) => employee)
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.login = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  let loadedUser;

  return Employee.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error('An user with this email could not be found.');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password).then((isEqual) => {
        if (!isEqual) {
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id,
            roleId: loadedUser.roleId,
            name: loadedUser.name,
            companyId: loadedUser.companyId,
          },
          'dWJcaHVt5wOGCmxGAbt3ApKNcE47i4Hz5ESTjvRFXQ9smeFUWXFpWmJMUP3yXWh',
          {
            expiresIn: '8h',
          }
        );

        res
          .status(200)
          .json({ message: 'Login succeeded', token: `Bearer ${token}` });
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
