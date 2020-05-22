const express = require('express');

const statusController = require('../Controllers/statusController');

const router = express.Router();

router.get('/:statusId', statusController.getStatusById);

router.post('/', statusController.addStatus);

router.post('/:statusId', statusController.updateStatus);

module.exports = router;
