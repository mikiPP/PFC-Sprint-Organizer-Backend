const express = require('express');

const employeeController = require('../Controllers/employeeController');

const router = express.Router();

router.get('/:employeeId', employeeController.getEmployeeById);

router.post('/', employeeController.addEmployee);

router.post('/filter', employeeController.findByFilter);

router.put('/:employeeId', employeeController.updateEmployee);

router.delete('/:employeeId', employeeController.deleteEmployee);

module.exports = router;
