const express = require('express');
const { check } = require('express-validator');

const authController = require('../Controllers/authController');
const Employee = require('../Models/employee');

const router = express.Router();

router.post(
  '/signUp',
  [
    check('email')
      .custom((value) => {
        return Employee.findOne({ email: value }).then((employee) => {
          if (employee) {
            return Promise.reject('E-mail already in use');
          }
        });
      })
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
      .withMessage('Please introduce a valid email'),
    check('password')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
      )
      .withMessage(
        'Password must have: 1- 8 characters or more and at least 1 upperCase, 1 loweCase, 1 number'
      ),
  ],
  authController.signUp
);

router.post('/login', authController.login);

module.exports = router;
