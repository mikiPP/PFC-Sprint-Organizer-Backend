const express = require('express');
const bodyParser = require('body-parser').json();

const { getCompany } = require('../Controllers/companyController');
const { addCompany } = require('../Controllers/companyController');
const { updateCompany } = require('../Controllers/companyController');
const { deleteCompany } = require('../Controllers/companyController');

const router = express.Router();

router.get('/:companyId', getCompany);

router.post('/', bodyParser, addCompany);

router.post('/:companyId', bodyParser, updateCompany);

router.delete('/:companyId', bodyParser, deleteCompany);

module.exports = router;
