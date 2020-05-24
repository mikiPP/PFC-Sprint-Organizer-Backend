/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Permission = require('../Models/permission');
const permissionController = require('../Controllers/permissionController');
const res = require('../Util/utils').fakeRes;

const permission = new Permission({
  name: 'Create User',
  description: 'Create an user',
  disabled: false,
});

const permissionId = '5ec9a4d27b719232d84ba814';

describe('Permission controller - CRUD', function () {
  it('Permission successfully created should return status of 201 and the new permission', function (done) {
    sinon.stub(Permission.prototype, 'save');

    Permission.prototype.save.returns(
      new Promise((resolve) => resolve(permission))
    );

    const req = {
      body: permission,
    };

    permissionController
      .addPermission(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(permission.name);
        expect(result.description).to.equal(permission.description);
        expect(result.disabled).to.equal(permission.disabled);
        expect(res.statusCode).to.equal(201);
        Permission.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the permission is valid find it and return the permission objectd and status of 200', function (done) {
    sinon.stub(Permission, 'findById');
    Permission.findById.returns(new Promise((resolve) => resolve(permission)));

    const req = {
      params: { permissionId },
    };

    permissionController
      .getPermissionById(req, res, () => {})
      .then((result) => {
        expect(Permission.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(permission);
        Permission.findById.restore();
        done();
      });
  });

  it('Permission successfully updated should return the permission updated and status of 200 ', function (done) {
    sinon.stub(Permission, 'findById');
    sinon.stub(Permission.prototype, 'save');

    Permission.findById.returns(new Promise((resolve) => resolve(permission)));
    Permission.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'updated',
        })
      )
    );

    const req = {
      params: { permissionId },
      body: {
        name: 'updated',
      },
    };

    permissionController
      .updatePermission(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(permission.name);
        expect(res.statusCode).to.equal(200);
        Permission.findById.restore();
        Permission.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Permission, 'findByIdAndDelete');

    Permission.findByIdAndDelete.returns(
      new Promise((resolve) => resolve(true))
    );

    const req = {
      params: { permissionId },
    };
    res.statusCode = 100;

    permissionController
      .deletePermission(req, res, () => {})
      .then(() => {
        expect(Permission.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Permission.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of permission filtered', function (done) {
    sinon.stub(Permission, 'find');

    Permission.find.returns(
      new Promise((resolve) => resolve([permission, permission]))
    );

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    permissionController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Permission.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Permission.find.restore();
        done();
      });
  });
});

describe('Permission controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Permission.prototype, 'save');

    Permission.prototype.save.returns(
      new Promise((reject) => reject(undefined))
    );

    const req = {
      body: permission,
    };

    res.statusCode = undefined;

    permissionController
      .addPermission(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(permission);
        expect(permissionController.addPermission).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Permission.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Permission does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Permission, 'findById');
    Permission.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { permissionId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    permissionController
      .getPermissionById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(permission);
        expect(permissionController.getPermissionById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Permission.findById.restore();
        done();
      });
  });

  it('error when permission is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { permissionId: 3 },
      body: {
        name: 'updated',
      },
    };

    res.statusCode = undefined;

    permissionController
      .updatePermission(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(permission);
        expect(permissionController.updatePermission).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when permission is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Permission, 'findByIdAndDelete');
    Permission.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { permissionId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    permissionController
      .deletePermission(req, res, () => {})
      .then(() => {
        expect(permissionController.deletePermission).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Permission.findByIdAndDelete.restore();
        done();
      });
  });

  it('if find by filter has an error should return this error and status of 500', function (done) {
    sinon.stub(Permission, 'find');

    Permission.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    permissionController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(permissionController.findByFilter).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Permission.find.restore();
        done();
      });
  });
});
