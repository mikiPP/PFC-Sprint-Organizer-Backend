const express = require('express');

const sprintController = require('../Controllers/sprintController');

const router = express.Router();

router.get('/:sprintId', sprintController.getSprintById);

router.post('/', sprintController.addSprint);

module.exports = router;
