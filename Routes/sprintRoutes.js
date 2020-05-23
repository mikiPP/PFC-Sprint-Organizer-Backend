const express = require('express');

const sprintController = require('../Controllers/sprintController');

const router = express.Router();

router.get('/:sprintId', sprintController.getSprintById);

router.post('/', sprintController.addSprint);

router.post('/filter', sprintController.findByFilter);

router.post('/:sprintId', sprintController.updateSprint);

router.delete('/:sprintId', sprintController.deleteSprint);

module.exports = router;
