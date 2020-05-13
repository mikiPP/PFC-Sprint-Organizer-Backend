const express = require('express');

const projectController = require('../Controllers/projectController');

const router = express.Router();

router.post('/', projectController.addProject);

module.exports = router;
