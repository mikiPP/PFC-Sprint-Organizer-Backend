const express = require('express');

const { getCompany } = require('../Controllers/companyController');
const { addCompany } = require('../Controllers/companyController');

const router = express.Router();

// TODO: ADD THE REAL ROUTE
router.get('/', getCompany);

router.post('/', addCompany);

module.exports = router;
