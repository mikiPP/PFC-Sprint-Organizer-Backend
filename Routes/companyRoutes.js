const express = require('express');
const bodyParser = require('body-parser').json();

const { getCompany } = require('../Controllers/companyController');
const { addCompany } = require('../Controllers/companyController');

const router = express.Router();

// TODO: ADD THE REAL ROUTE
router.get('/:companyId', getCompany);

router.post('/', bodyParser, addCompany);

module.exports = router;
