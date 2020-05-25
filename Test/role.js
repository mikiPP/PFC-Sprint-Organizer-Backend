/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Role = require('../Models/role');
const roleController = require('../Controllers/roleController');
const res = require('../Util/utils').fakeRes;

const role = new Role({
  name: 'Create User',
  description: 'Create an user',
  disabled: false,
  roles: [{ _id: '5eca820da3518e12b43b909es' }],
});

const roleId = '5ec9a4d27b719232d84ba814';

describe('Role controller - CRUD', function () {
  it('Role successfully created should return status of 201 and the new role', function (done) {
    sinon.stub(Role.prototype, 'save');

    Role.prototype.save.returns(new Promise((resolve) => resolve(role)));

    const req = {
      body: role,
    };

    roleController
      .addRole(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(role.name);
        expect(result.description).to.equal(role.description);
        expect(result.disabled).to.equal(role.disabled);
        expect(res.statusCode).to.equal(201);
        Role.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the role is valid find it and return the role objectd and status of 200', function (done) {
    sinon.stub(Role, 'findById');
    Role.findById.returns(new Promise((resolve) => resolve(role)));

    const req = {
      params: { roleId },
    };

    roleController
      .getRoleById(req, res, () => {})
      .then((result) => {
        expect(Role.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(role);
        Role.findById.restore();
        done();
      });
  });

  it('Role successfully updated should return the role updated and status of 200 ', function (done) {
    sinon.stub(Role, 'findById');
    sinon.stub(Role.prototype, 'save');

    Role.findById.returns(new Promise((resolve) => resolve(role)));
    Role.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'updated',
        })
      )
    );

    const req = {
      params: { roleId },
      body: {
        name: 'updated',
      },
    };

    roleController
      .updateRole(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(role.name);
        expect(res.statusCode).to.equal(200);
        Role.findById.restore();
        Role.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Role, 'findByIdAndDelete');

    Role.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { roleId },
    };
    res.statusCode = 100;

    roleController
      .deleteRole(req, res, () => {})
      .then(() => {
        expect(Role.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Role.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of role filtered', function (done) {
    sinon.stub(Role, 'find');

    Role.find.returns(new Promise((resolve) => resolve([role, role])));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    roleController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Role.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Role.find.restore();
        done();
      });
  });
});

describe('Role controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Role.prototype, 'save');

    Role.prototype.save.returns(new Promise((reject) => reject(undefined)));

    const req = {
      body: role,
    };

    res.statusCode = undefined;

    roleController
      .addRole(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(role);
        expect(roleController.addRole).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Role.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Role does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Role, 'findById');
    Role.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { roleId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    roleController
      .getRoleById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(role);
        expect(roleController.getRoleById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Role.findById.restore();
        done();
      });
  });

  it('error when role is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { roleId: 3 },
      body: {
        name: 'updated',
      },
    };

    res.statusCode = undefined;

    roleController
      .updateRole(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(role);
        expect(roleController.updateRole).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when role is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Role, 'findByIdAndDelete');
    Role.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { roleId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    roleController
      .deleteRole(req, res, () => {})
      .then(() => {
        expect(roleController.deleteRole).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Role.findByIdAndDelete.restore();
        done();
      });
  });

  it('if find by filter has an error should return this error and status of 500', function (done) {
    sinon.stub(Role, 'find');

    Role.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    roleController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(roleController.findByFilter).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Role.find.restore();
        done();
      });
  });
});
