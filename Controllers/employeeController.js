const Employee = require('../Models/employee');
const utils = require('../Util/utils');

exports.getEmployeeById = (req, res, next) => {
  const { employeeId } = req.params;

  utils.checkIfIdIsValid(employeeId, res, next);

  return Employee.findById(employeeId)
    .then((employee) => {
      utils.checkNotFound(employee, employeeId, 'employee');
      res.status(200).json({ message: 'Employee has been fetched', employee });
      return employee;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addEmployee = (req, res, next) => {
  const { name } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;

  const employee = new Employee({
    name,
    surnames,
    birthDay,
    password,
    profile,
    vacationDays,
    hoursDay,
    hoursWeek,
  });

  utils.cleanObject(employee);

  return employee
    .save()
    .then((employeeSaved) => {
      if (!employeeSaved) {
        const error = new Error('The employee has not been created');
        error.statusCode = 500;
        throw error;
      }

      res
        .status(201)
        .json({ message: 'Employee has been inserted', employeeSaved });
      return employeeSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateEmployee = (req, res, next) => {
  const { employeeId } = req.params;

  const { name } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;
  const { disabled } = req.body;

  utils.checkIfIdIsValid(employeeId, res, next);

  return Employee.findById(employeeId)
    .then((employee) => {
      utils.checkNotFound(employee, employeeId, 'employee');

      employee.name = name || employee.name;
      employee.surnames = surnames || employee.surnames;
      employee.birthDay = birthDay || employee.birthDay;
      employee.password = password || employee.password;
      employee.profile = profile || employee.profile;
      employee.vacationDays = vacationDays || employee.vacationDays;
      employee.hoursDay = hoursDay || employee.hoursDay;
      employee.hoursWeek = hoursWeek || employee.hoursWeek;
      employee.disabled = disabled || employee.disabled;

      return employee.save();
    })
    .then((employee) => {
      res
        .status(200)
        .json({ message: 'Employee has been updated !', employee });
      return employee;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteEmployee = (req, res, next) => {
  const { employeeId } = req.params;

  utils.checkIfIdIsValid(employeeId, res, next);

  return Employee.findByIdAndDelete(employeeId)
    .then((employee) => {
      utils.checkNotFound(employee, employeeId, 'employee');

      res.status(200).json({
        message: `The employee with id: ${employeeId} has been removed`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;
  const { disabled } = req.body;

  const filter = {
    name,
    surnames,
    birthDay,
    profile,
    password,
    vacationDays,
    hoursDay,
    hoursWeek,
    disabled,
  };

  utils.cleanObject(filter);

  return Employee.find(filter)
    .then((employees) => {
      if (employees) {
        res.status(200).json({
          message: 'Employees has been fetched successfully',
          employees,
        });
        return employees;
      }
      const error = new Error('Something went wrong...');
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
