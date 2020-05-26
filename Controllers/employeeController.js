const bcrypt = require('bcryptjs');
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
  const { email } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;
  const { roleId } = req.body;
  const { projects } = req.body;
  const { companyId } = req.body;

  return bcrypt
    .hash(password, 12)
    .then((passwordHashed) => {
      const employee = new Employee({
        name,
        email,
        surnames,
        birthDay,
        password: passwordHashed,
        profile,
        vacationDays,
        hoursDay,
        hoursWeek,
        roleId,
        projects,
        companyId,
      });

      utils.cleanObject(employee);

      return employee.save();
    })
    .then((employeeSaved) => {
      utils.checkSavedData(employeeSaved, 'employee');

      res
        .status(201)
        .json({ message: 'Employee has been inserted', employeeSaved });
      return employeeSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateEmployee = (req, res, next) => {
  const { employeeId } = req.params;

  utils.checkIfIdIsValid(employeeId, res, next);

  const { name } = req.body;
  const { email } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;
  const { disabled } = req.body;
  const { roleId } = req.body;
  const { projects } = req.body;
  const { companyId } = req.body;

  return Employee.findById(employeeId)
    .then((employee) => {
      utils.checkNotFound(employee, employeeId, 'employee');

      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.surnames = surnames || employee.surnames;
      employee.birthDay = birthDay || employee.birthDay;
      employee.password = password || employee.password;
      employee.profile = profile || employee.profile;
      employee.vacationDays = vacationDays || employee.vacationDays;
      employee.hoursDay = hoursDay || employee.hoursDay;
      employee.hoursWeek = hoursWeek || employee.hoursWeek;
      employee.disabled = disabled || employee.disabled;
      employee.roleId = roleId || employee.roleId;
      employee.projects = projects || employee.projects;
      employee.companyId = companyId || employee.companyId;

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
  const { email } = req.body;
  const { surnames } = req.body;
  const { birthDay } = req.body;
  const { password } = req.body;
  const { profile } = req.body;
  const { vacationDays } = req.body;
  const { hoursDay } = req.body;
  const { hoursWeek } = req.body;
  const { disabled } = req.body;
  const { roleId } = req.body;
  const { projects } = req.body;
  const { companyId } = req.body;

  const filter = {
    name,
    email,
    surnames,
    birthDay,
    profile,
    password,
    vacationDays,
    hoursDay,
    hoursWeek,
    disabled,
    roleId,
    projects,
    companyId,
  };

  utils.cleanObject(filter);
  return Employee.find(filter)
    .then((employees) => utils.checkFilteredData(employees, res, 'employees'))
    .catch((err) => utils.errorHandler(err, res, next));
};
