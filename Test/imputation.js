/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Imputation = require('../Models/imputation');
const imputationController = require('../Controllers/imputationController');
const res = require('../Util/utils').fakeRes;

const imputation = new Imputation({
  employeeId: '5ec816024b90782e44283f32',
  taskId: '5ec57d2bc001932e0426498d',
  imputationId: '5ec9730a22440b0cc4f3d541',
  date: '2020/05/24',
  hours: 6,
});

const imputationId = '5ec9a4d27b719232d84ba814';

describe('Imputation controller - CRUD', function () {
  it('Imputation successfully created should return status of 201 and the new imputation', function (done) {
    sinon.stub(Imputation.prototype, 'save');

    Imputation.prototype.save.returns(
      new Promise((resolve) => resolve(imputation))
    );

    const req = {
      body: imputation,
    };

    imputationController
      .addImputation(req, res, () => {})
      .then((result) => {
        expect(result.employeeId).to.equal(imputation.employeeId);
        expect(result.taskId).to.equal(imputation.taskId);
        expect(result.sprintId).to.equal(imputation.sprintId);
        expect(result.date).to.equal(imputation.date);
        expect(result.hours).to.equal(imputation.hours);
        expect(res.statusCode).to.equal(201);
        Imputation.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the imputation is valid find it and return the imputation objectd and status of 200', function (done) {
    sinon.stub(Imputation, 'findById');
    Imputation.findById.returns(new Promise((resolve) => resolve(imputation)));

    const req = {
      params: { imputationId },
    };

    imputationController
      .getImputationById(req, res, () => {})
      .then((result) => {
        expect(Imputation.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(imputation);
        Imputation.findById.restore();
        done();
      });
  });

  it('Imputation successfully updated should return the imputation updated and status of 200 ', function (done) {
    sinon.stub(Imputation, 'findById');
    sinon.stub(Imputation.prototype, 'save');

    Imputation.findById.returns(new Promise((resolve) => resolve(imputation)));
    Imputation.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          hours: 3,
        })
      )
    );

    const req = {
      params: { imputationId },
      body: {
        hours: 3,
      },
    };

    imputationController
      .updateImputation(req, res, () => {})
      .then((result) => {
        expect(result.hours).to.equal(imputation.hours);
        expect(res.statusCode).to.equal(200);
        Imputation.findById.restore();
        Imputation.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Imputation, 'findByIdAndDelete');

    Imputation.findByIdAndDelete.returns(
      new Promise((resolve) => resolve(true))
    );

    const req = {
      params: { imputationId },
    };
    res.statusCode = 100;

    imputationController
      .deleteImputation(req, res, () => {})
      .then(() => {
        expect(Imputation.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Imputation.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of imputation filtered', function (done) {
    sinon.stub(Imputation, 'find');

    Imputation.find.returns(
      new Promise((resolve) => resolve([imputation, imputation]))
    );

    const req = {
      body: {
        hours: 3,
      },
    };

    res.statusCode = undefined;

    imputationController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Imputation.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Imputation.find.restore();
        done();
      });
  });
});

describe('Imputation controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Imputation.prototype, 'save');

    Imputation.prototype.save.returns(
      new Promise((reject) => reject(undefined))
    );

    const req = {
      body: imputation,
    };

    res.statusCode = undefined;

    imputationController
      .addImputation(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(imputation);
        expect(imputationController.addImputation).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Imputation.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Imputation does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Imputation, 'findById');
    Imputation.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { imputationId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    imputationController
      .findImputationById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(imputation);
        expect(imputationController.imputationById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Imputation.findById.restore();
        done();
      });
  });

  it('error when imputation is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { imputationId: 3 },
      body: {
        hours: 5,
      },
    };

    res.statusCode = undefined;

    imputationController
      .updateImputation(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(imputation);
        expect(imputationController.updateImputation).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when imputation is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Imputation, 'findByIdAndDelete');
    Imputation.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { imputationId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    imputationController
      .deleteImputation(req, res, () => {})
      .then(() => {
        expect(imputationController.deleteImputation).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Imputation.findByIdAndDelete.restore();
        done();
      });
  });

  it('if find by filter has an error should return this error and status of 500', function (done) {
    sinon.stub(Imputation, 'find');

    Imputation.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        hours: 5,
      },
    };

    res.statusCode = undefined;

    imputationController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(imputationController.findByFilter).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Imputation.find.restore();
        done();
      });
  });
});
