const express = require('express');

const companyController = require('../Controllers/company');

const router = express.Router();

// TODO: ADD THE REAL ROUTE
router.get('/', companyController.getCompany);

module.exports = router;
