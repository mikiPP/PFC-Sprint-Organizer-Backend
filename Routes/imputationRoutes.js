const express = require('express');

const imputationController = require('../Controllers/imputationController');

const router = express.Router();

router.get('/:imputationId', imputationController.getImputationById);

router.post('/', imputationController.addImputation);

router.post('/filter', imputationController.findByFilter);

router.put('/:imputationId', imputationController.updateImputation);

router.delete('/:imputationId', imputationController.deleteImputation);

module.exports = router;
