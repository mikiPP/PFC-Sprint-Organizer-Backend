const express = require('express');

const statusController = require('../Controllers/statusController');

const router = express.Router();

router.get('/:statusId', statusController.getStatusById);

router.post('/', statusController.addStatus);

module.exports = router;
