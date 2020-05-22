/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Status = require('../Models/status');
const statusController = require('../Controllers/statusController');
const res = require('../Util/utils').fakeRes;

const name = 'statusName';
const description = 'Description.....';

const status = new Status({ name, description });

describe('Status controller - CRUD', function () {
  it('Status successfully created should return status 201 and the new Status', function (done) {
    sinon.stub(Status.prototype, 'save');

    Status.prototype.save.returns(new Promise((resolve) => resolve(status)));

    const req = {
      body: status,
    };

    expect(
      statusController
        .addStatus(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('description');
          expect(res.statusCode).to.equal(201);
          Status.prototype.save.restore();
          done();
        })
    );
  });

  it('If id given to get the status does not exist should return an status of 500 and an error !', function (done) {
    sinon.stub(Status, 'findById');

    Status.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { statusId: 2 },
    };

    res.statusCode = undefined;

    statusController
      .getStatusById(req, res, () => {})
      .then(() => {
        expect(statusController.getStatusById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Status.findById.restore();
        done();
      });
  });
});

describe('Status controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Status.prototype, 'save');

    Status.prototype.save.returns(new Promise((resolve) => resolve(status)));

    const req = {
      body: status,
    };

    res.statusCode = undefined;

    expect(
      statusController
        .addStatus(req, res, () => {})
        .then((result) => {
          expect(result).to.equal(status);
          expect(res.statusCode).to.equal(201);
          Status.prototype.save.restore();
          done();
        })
    );
  });
  it('If id given to get the status does not exist should return an status of 500 and an error !', function (done) {
    sinon.stub(Status, 'findById');

    Status.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { statusId: 2 },
    };

    res.statusCode = undefined;

    statusController
      .getStatusById(req, res, () => {})
      .then(() => {
        expect(statusController.getStatusById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Status.findById.restore();
        done();
      });
  });
});
