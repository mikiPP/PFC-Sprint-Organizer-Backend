/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Employee = require('../Models/employee');
const employeeController = require('../Controllers/employeeController');
const res = require('../Util/utils').fakeRes;

const employee = new Employee({
  vacationDays: 23,
  hoursDay: 5,
  hoursWeek: 40,
  name: 'test',
  surnames: 'palao palmer',
  password: 'patata',
  profile: 'programer',
});

describe('Employee controller - CRUD', function () {
  it('Employee successfully created should return status of 201 and the new Employee', function (done) {
    sinon.stub(Employee.prototype, 'save');

    Employee.prototype.save.returns(
      new Promise((resolve) => resolve(employee))
    );

    const req = {
      body: employee,
    };

    employeeController
      .addEmployee(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(employee.name);
        expect(result.surnames).to.equal(employee.surnames);
        expect(result.vacationDays).to.equal(employee.vacationDays);
        expect(result.hoursDay).to.equal(employee.hoursDay);
        expect(result.hoursWeek).to.equal(employee.hoursWeek);
        expect(result.password).to.equal(employee.password);
        expect(result.profile).to.equal(employee.profile);
        expect(res.statusCode).to.equal(201);
        Employee.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the employee does exist return an status of 200 and the employee', function (done) {
    sinon.stub(Employee, 'findById');

    Employee.findById.returns(new Promise((resolve) => resolve(employee)));

    const req = {
      params: { employeeId: '5ec8df3fcc6d2338d4a071b8' },
    };

    employeeController
      .getEmployeeById(req, res, () => {})
      .then(() => {
        expect(Employee.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Employee.findById.restore();
        done();
      });
  });
  it('Employee successfully updated should retrun the status of 200 and the employee updated', function (done) {
    sinon.stub(Employee, 'findById');
    sinon.stub(Employee.prototype, 'save');

    Employee.findById.returns(new Promise((resolve) => resolve(employee)));
    Employee.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'name Updated',
          surnames: 'surnames updated',
          profile: 'profile updated',
          password: 'password Updated',
        })
      )
    );

    const req = {
      params: { employeeId: '5ec57bd6a31f661b2411e7fc' },
      body: {
        name: 'name Updated',
        surnames: 'surnames updated',
        profile: 'profile updated',
        password: 'password Updated',
      },
    };

    employeeController
      .updateEmployee(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(employee.name);
        expect(result.surnames).to.equal(employee.surnames);
        expect(result.password).to.equal(employee.password);
        expect(result.profile).to.equal(employee.profile);
        expect(res.statusCode).to.equal(200);
        Employee.findById.restore();
        Employee.prototype.save.restore();
        done();
      });
  });
  it('if the given employee id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Employee, 'findByIdAndDelete');

    Employee.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { employeeId: '5ec7acfdfdd6323a3c441409' },
    };

    res.statusCode = 100;

    employeeController
      .deleteEmployee(req, res, () => {})
      .then(() => {
        expect(Employee.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Employee.findByIdAndDelete.restore();
        done();
      });
  });

  it('find by filter should return a list of employees filtered', function (done) {
    sinon.stub(Employee, 'find');

    Employee.find.returns(
      new Promise((resolve) => resolve([employee, employee]))
    );

    req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = 100;

    employeeController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Employee.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Employee.find.restore();
        done();
      });
  });
});

describe('Employee controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Employee.prototype, 'save');

    Employee.prototype.save.returns(new Promise((reject) => reject()));

    const req = {
      body: employee,
    };

    res.statusCode = undefined;

    employeeController
      .addEmployee(req, res, () => {})
      .then((result) => {
        expect(employeeController.addEmployee).to.throw();
        expect(result).to.not.equal(employee);
        expect(res.statusCode).to.not.equal(200);
        Employee.prototype.save.restore();
        done();
      });
  });

  it('If the id given to get the employee does not exist should return an status of 500 and an error', function (done) {
    sinon.stub(Employee, 'findById');

    Employee.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { employeeId: 2 },
    };
    res.statusCode = undefined;

    employeeController
      .getEmployeeById(req, res, () => {})
      .then(() => {
        expect(employeeController.getEmployeeById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Employee.findById.restore();
        done();
      });
  });

  it('error when employee is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { employeeId: 2 },
      body: {
        name: 'name Updated',
        surnames: 'surnames updated',
        profile: 'profile updated',
        password: 'password Updated',
      },
    };

    res.statusCode = undefined;

    employeeController.updateEmployee(req, res, () => {
      expect(employeeController.updateEmployee).to.throw();
      expect(res.statusCode).to.not.equal(200);
      done();
    });
  });
  it('error when employee is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Employee, 'findByIdAndDelete');
    Employee.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { employeeId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    employeeController
      .deleteEmployee(req, res, () => {})
      .then(() => {
        expect(employeeController.deleteEmployee).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Employee.findByIdAndDelete.restore();
        done();
      });
  });
  it('if find by filter has an error should return this error', function (done) {
    sinon.stub(Employee, 'find');

    Employee.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    employeeController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(employeeController.findByFilter).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Employee.find.restore();
        done();
      });
  });
});
