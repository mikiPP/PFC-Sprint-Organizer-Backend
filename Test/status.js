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

  it('Status successfully updated should return the status updated and status of 200', function (done) {
    sinon.stub(Status, 'findById');
    sinon.stub(Status.prototype, 'save');

    Status.findById.returns(new Promise((resolve) => resolve(status)));
    Status.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'status updated',
          description: 'description updated',
        })
      )
    );

    const req = {
      params: { statusId: '5ec57bd6a31f661b2411e7fc' },
      body: {
        name: 'status updated',
        description: 'description updated',
      },
    };

    expect(
      statusController
        .updateStatus(req, res, () => {})
        .then((result) => {
          expect(result.name).to.equal(status.name);
          expect(result.description).to.equal(status.description);
          Status.findById.restore();
          Status.prototype.save.restore();
          done();
        })
    );
  });

  it('if the given status id does exist delete should delete it and return status of 200', function (done) {
    sinon.stub(Status, 'findByIdAndDelete');

    Status.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { statusId: '5ec7acfdfdd6323a3c441409' },
    };

    res.statusCode = 100;
    statusController
      .deleteStatus(req, res, () => {})
      .then(() => {
        expect(Status.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Status.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of statuses filtereds', function (done) {
    sinon.stub(Status, 'find');

    Status.find.returns(new Promise((resolve) => resolve([status, status])));

    req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = 100;

    statusController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Status.find).to.not.throw();
        expect(res.statusCode).to.equal(200);
        Status.find.restore();
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
  it('error when status is beeing update should return an error and status of 500', function (done) {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { statusId: 1 },
      body: {
        name: 'updated',
        description: 'description updated',
      },
    };

    res.statusCode = undefined;

    statusController
      .updateStatus(req, res, () => {})
      .then(() => {
        expect(statusController.updateStatus).to.throw();
        expect(res.statusCode).to.not.equal(200);
        mongoose.Types.ObjectId.isValid.restore();
        done();
      });
  });

  it('error when status is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Status, 'findByIdAndDelete');
    Status.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { statusId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    statusController
      .deleteStatus(req, res, () => {})
      .then(() => {
        expect(statusController.deleteStatus).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Status.findByIdAndDelete.restore();
        done();
      });
  });

  it('find by filter has an error should return this error', function (done) {
    sinon.stub(Status, 'find');

    Status.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    statusController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(statusController.findByFilter).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Status.find.restore();
        done();
      });
  });
});
