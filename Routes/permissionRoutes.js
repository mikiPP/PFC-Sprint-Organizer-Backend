const express = require('express');

const permissionController = require('../Controllers/permisionController');

const router = express.Router();

router.get('/:permissionId', permissionController.getPermissionById);

router.post('/', permissionController.addPermission);

router.post('/filter', permissionController.findByFilter);

router.put('/:permissionId', permissionController.updatePermission);

router.delete('/:permissionId', permissionController.deletePermission);

module.exports = router;
