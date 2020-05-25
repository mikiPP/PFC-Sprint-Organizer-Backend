/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Task = require('../Models/task');
const taskController = require('../Controllers/taskController');
const res = require('../Util/utils').fakeRes;

const name = 'taskTest';
const description = 'This is a description';
const projectId = '5ec57bd6a31f661b2411e7fc';
const estimatedTime = 5;
const backlog = true;

const task = new Task({ name, description, projectId, estimatedTime, backlog });

const taskId = '5ec9a4d27b719232d84ba814';

describe('Task controller - CRUD', function () {
  it('Task successfully created should return status of 201 and the new task', function (done) {
    sinon.stub(Task.prototype, 'save');

    Task.prototype.save.returns(new Promise((resolve) => resolve(task)));

    const req = {
      body: task,
    };

    taskController
      .addTask(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(task.name);
        expect(result.description).to.equal(task.description);
        expect(result.disabled).to.equal(task.disabled);
        expect(res.statusCode).to.equal(201);
        Task.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the task is valid find it and return the task objectd and status of 200', function (done) {
    sinon.stub(Task, 'findById');
    Task.findById.returns(new Promise((resolve) => resolve(task)));

    const req = {
      params: { taskId },
    };

    taskController
      .getTaskById(req, res, () => {})
      .then((result) => {
        expect(Task.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(task);
        Task.findById.restore();
        done();
      });
  });

  it('Task successfully updated should return the task updated and status of 200 ', function (done) {
    sinon.stub(Task, 'findById');
    sinon.stub(Task.prototype, 'save');

    Task.findById.returns(new Promise((resolve) => resolve(task)));
    Task.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'updated',
        })
      )
    );

    const req = {
      params: { taskId },
      body: {
        name: 'updated',
      },
    };

    taskController
      .updateTask(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(task.name);
        expect(res.statusCode).to.equal(200);
        Task.findById.restore();
        Task.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Task, 'findByIdAndDelete');

    Task.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { taskId },
    };
    res.statusCode = 100;

    taskController
      .deleteTask(req, res, () => {})
      .then(() => {
        expect(Task.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Task.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of task filtered', function (done) {
    sinon.stub(Task, 'find');

    Task.find.returns(new Promise((resolve) => resolve([task, task])));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    taskController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Task.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Task.find.restore();
        done();
      });
  });
});

describe('Task controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Task.prototype, 'save');

    Task.prototype.save.returns(new Promise((reject) => reject(undefined)));

    const req = {
      body: task,
    };

    res.statusCode = undefined;

    taskController
      .addTask(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(task);
        expect(taskController.addTask).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Task.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Task does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Task, 'findById');
    Task.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { taskId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    taskController
      .getTaskById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(task);
        expect(taskController.getTaskById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Task.findById.restore();
        done();
      });
  });

  it('error when task is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { taskId: 3 },
      body: {
        name: 'updated',
      },
    };

    res.statusCode = undefined;

    taskController
      .updateTask(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(task);
        expect(taskController.updateTask).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when task is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Task, 'findByIdAndDelete');
    Task.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { taskId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    taskController
      .deleteTask(req, res, () => {})
      .then(() => {
        expect(taskController.deleteTask).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Task.findByIdAndDelete.restore();
        done();
      });
  });

  it('if find by filter has an error should return this error and status of 500', function (done) {
    sinon.stub(Task, 'find');

    Task.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    taskController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(taskController.findByFilter).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Task.find.restore();
        done();
      });
  });
});
