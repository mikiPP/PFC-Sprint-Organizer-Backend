const express = require('express');

const taskController = require('../Controllers/taskController');

const router = express.Router();

router.get('/:taskId', taskController.getTaskById);

router.post('/', taskController.addTask);

router.post('/filter', taskController.findByFilter);

router.post('/:taskId', taskController.updateTask);

router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
