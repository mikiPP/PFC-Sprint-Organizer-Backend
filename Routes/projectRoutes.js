const express = require('express');

const projectController = require('../Controllers/projectController');

const router = express.Router();

router.get('/:projectId', projectController.getProjectById);

router.post('/', projectController.addProject);

router.put('/:projectId', projectController.updateProject);

router.delete('/:projectId', projectController.deleteProject);

router.post('/filter', projectController.findByFilter);

module.exports = router;
