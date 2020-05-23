/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Task = require('../Models/task');
const taskController = require('../Controllers/taskController');
const res = require('../Util/utils').fakeRes;

const name = 'taskTest';
const description = 'This is a description';
const projectId = '5ec57bd6a31f661b2411e7fc';
const estimatedTime = 5;
const backlog = true;

const task = new Task({ name, description, projectId, estimatedTime, backlog });

describe('Task controller - CRUD', function () {
  it('task successfully created should return status 201 and the new Task', function (done) {
    sinon.stub(Task.prototype, 'save');

    Task.prototype.save.returns(new Promise((resolve) => resolve(task)));

    const req = {
      body: task,
    };

    expect(
      taskController
        .addTask(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('description');
          expect(result).to.have.property('projectId');
          expect(result).to.have.property('estimatedTime');
          expect(result).to.have.property('backlog');
          expect(res.statusCode).to.equal(201);
          Task.prototype.save.restore();
          done();
        })
    );
  });

  it('Task successfully fetched should return status of 200 and the task fetched !', function (done) {
    sinon.stub(Task, 'findById');

    Task.findById.returns(new Promise((resolve) => resolve(task)));

    const req = {
      params: { taskId: 2 },
    };

    expect(
      taskController
        .getTaskById(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('description');
          expect(result).to.have.property('projectId');
          expect(result).to.have.property('estimatedTime');
          expect(result).to.have.property('backlog');
          expect(res.statusCode).to.equal(200);
          Task.findById.restore();
          done();
        })
    );
  });
  it('Task successfully updated should return the task updated and status of 200', function (done) {
    sinon.stub(Task, 'findById');
    sinon.stub(Task.prototype, 'save');

    Task.findById.returns(new Promise((resolve) => resolve(task)));
    Task.prototype.save.returns(
      new Promise((resolve) => {
        resolve({
          name: 'taskTest',
          description: 'This is a description',
          estimatedTime: 5,
          projectId: 3,
          realTime: 0,
          backlog: false,
        });
      })
    );

    const req = {
      params: { taskId: '5ec57bd6a31f661b2411e7fc' },
      body: {
        estimatedTime: 7,
        projectId: 3,
        realTime: -1,
        backlog: false,
      },
    };

    expect(
      taskController
        .updateTask(req, res, () => {})
        .then((result) => {
          expect(result.name).to.equal(task.name);
          expect(result.description).to.equal(task.description);
          expect(result.estimatedTime).to.not.equal(task.estimatedTime);
          expect(result.realTime).to.not.equal(task.realTime);
          expect(result.backlog).to.not.equal(task.backlog);
          expect(result.projectId).to.not.equal(task.projectId);
          Task.prototype.save.restore();
          Task.findById.restore();
          done();
        })
    );
  });

  it('If the given task id does exist delete should delete it return status of 200', function () {
    sinon.stub(Task, 'findByIdAndDelete');

    Task.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { taskId: '5ec57bd6a31f661b2411e7fc' },
    };

    taskController.deleteTask(req, res, () => {});
    expect(Task.findByIdAndDelete).not.to.throw();
    expect(res.statusCode).to.equal(200);

    Task.findByIdAndDelete.restore();
  });

  it('find by filter should return a list of tasks filtereds', function () {
    sinon.stub(Task, 'find');
    Task.find.returns(
      new Promise((resolve) => resolve({ tasks: [task, task] }))
    );

    req = {
      body: {
        name: 'test',
      },
    };
    taskController.findByFilter(req, res, () => {});
    expect(Task.find).to.not.throw();
    expect(res.statusCode).to.equal(200);
    Task.find.restore();
  });
});

describe('Task controller - ERROR HANDLER', function () {
  it('An error on create a task should return status of 500', function (done) {
    sinon.stub(Task.prototype, 'save');

    Task.prototype.save.returns(new Promise((reject) => reject()));

    const req = {
      body: task,
    };

    res.statusCode = undefined;

    taskController
      .addTask(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(task);
        expect(res.statusCode).to.not.equal(201);
        Task.prototype.save.restore();
        done();
      });
  });

  it('If id given to get the task does not exist should return an status of 500 and an error !', function (done) {
    sinon.stub(Task, 'findById');

    Task.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { taskId: 2 },
    };

    res.statusCode = undefined;

    taskController
      .getTaskById(req, res, () => {})
      .then(() => {
        expect(taskController.getTaskById).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Task.findById.restore();
        done();
      });
  });

  it('error in a task update should return an error and status of 500', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { taskId: '5ec57bd6a31f661b2411e7fc' },
      body: {
        estimatedTime: 7,
        projectId: 3,
        realTime: -1,
        backlog: false,
      },
    };

    res.statusCode = undefined;

    taskController.updateTask(req, res, () => {});
    expect(taskController.updateTask).to.throw();
    expect(res.statusCode).to.not.equals(200);

    mongoose.Types.ObjectId.isValid.restore();
  });

  it('If the given task id does exist delete should return status of 200', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { taskId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;
    taskController.deleteTask(req, res, () => {});
    expect(Task.findByIdAndDelete).to.throw();
    expect(res.statusCode).not.to.equal(200);

    mongoose.Types.ObjectId.isValid.restore();
  });

  it('if find by filter has an error should return an error', function () {
    sinon.stub(Task, 'find');
    Task.find.returns(new Promise((reject) => reject()));

    req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = 500;

    taskController.findByFilter(req, res, () => {});
    expect(taskController.findByFilter).to.throw();
    expect(res.statusCode).not.to.equal(200);
    Task.find.restore();
  });
});
