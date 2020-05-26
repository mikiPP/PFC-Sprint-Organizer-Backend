const express = require('express');

const roleController = require('../Controllers/roleController');

const router = express.Router();

router.get('/:roleId', roleController.getRoleById);

router.post('/', roleController.addRole);

router.post('/filter', roleController.findByFilter);

router.put('/:roleId', roleController.updateRole);

router.delete('/:roleId', roleController.deleteRole);

module.exports = router;
