const express = require('express');

const companyController = require('../Controllers/companyController');

const router = express.Router();

router.get('/:companyId', companyController.getCompany);

router.post('/', companyController.addCompany);

router.post('/:companyId', companyController.updateCompany);

router.delete('/:companyId', companyController.deleteCompany);

module.exports = router;
