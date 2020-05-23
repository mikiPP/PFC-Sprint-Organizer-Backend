/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Sprint = require('../Models/sprint');
const sprintController = require('../Controllers/sprintController');
const res = require('../Util/utils').fakeRes;

const sprint = new Sprint({
  name: 'SPRINT 23/05/20',
  description: 'This is a description',
  startDate: '2020-05-22T22:00:00.000Z',
  endDate: '2020-05-29T22:00:00.000Z',
  statusId: '5ec7bc11f154c53644d4738c',
  projectId: '5ec57bf4a31f661b2411e7fd',
});

describe('Sprint controller - CRUD', function () {
  it('Sprint successsfully created should return status of 201 and the new Sprint', function (done) {
    sinon.stub(Sprint.prototype, 'save');

    Sprint.prototype.save.returns(new Promise((resolve) => resolve(sprint)));

    const req = {
      body: sprint,
    };

    sprintController
      .addSprint(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(sprint.name);
        expect(result.description).to.equal(sprint.description);
        expect(result.startDate).to.equal(sprint.startDate);
        expect(result.endDate).to.equal(sprint.endDate);
        expect(result.statusId).to.equal(sprint.statusId);
        expect(result.projectId).to.equal(sprint.projectId);
        expect(res.statusCode).to.equal(201);
        Sprint.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the sprint is valid find by id should return an status of 200 and the sprint', function (done) {
    sinon.stub(Sprint, 'findById');
    Sprint.findById.returns(new Promise((resolve) => resolve(sprint)));

    const req = {
      params: { sprintId: '5ec8df3fcc6d2338d4a071b8' },
    };

    sprintController
      .getSprintById(req, res, () => {})
      .then((result) => {
        expect(Sprint.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(sprint);
        Sprint.findById.restore();
        done();
      });
  });
});

describe('Sprint controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Sprint.prototype, 'save');

    Sprint.prototype.save.returns(new Promise((reject) => reject(undefined)));

    const req = {
      body: sprint,
    };

    res.statusCode = undefined;

    sprintController
      .addSprint(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(sprint);
        expect(sprintController.addSprint).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Sprint.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Sprint does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Sprint, 'findById');
    Sprint.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { sprintId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    sprintController
      .getSprintById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(sprint);
        expect(sprintController.getSprintById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Sprint.findById.restore();
        done();
      });
  });
});
