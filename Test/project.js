/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Project = require('../Models/project');
const projectController = require('../Controllers/projectController');
const res = require('../Util/utils').fakeRes;

const project = new Project({
  name: 'test',
  scrumMaster: 'test',
  disabled: false,
  companyId: '1',
});

const projectId = '5ec9a4d27b719232d84ba814';

describe('Project controller - CRUD', function () {
  it('Project successfully created should return status of 201 and the new project', function (done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.returns(new Promise((resolve) => resolve(project)));

    const req = {
      body: project,
    };

    projectController
      .addProject(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(project.name);
        expect(result.description).to.equal(project.description);
        expect(result.disabled).to.equal(project.disabled);
        expect(res.statusCode).to.equal(201);
        Project.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the project is valid find it and return the project objectd and status of 200', function (done) {
    sinon.stub(Project, 'findById');
    Project.findById.returns(new Promise((resolve) => resolve(project)));

    const req = {
      params: { projectId },
    };

    projectController
      .getProjectById(req, res, () => {})
      .then((result) => {
        expect(Project.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(project);
        Project.findById.restore();
        done();
      });
  });

  it('Project successfully updated should return the project updated and status of 200 ', function (done) {
    sinon.stub(Project, 'findById');
    sinon.stub(Project.prototype, 'save');

    Project.findById.returns(new Promise((resolve) => resolve(project)));
    Project.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'updated',
        })
      )
    );

    const req = {
      params: { projectId },
      body: {
        name: 'updated',
      },
    };

    projectController
      .updateProject(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(project.name);
        expect(res.statusCode).to.equal(200);
        Project.findById.restore();
        Project.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Project, 'findByIdAndDelete');

    Project.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { projectId },
    };
    res.statusCode = 100;

    projectController
      .deleteProject(req, res, () => {})
      .then(() => {
        expect(Project.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Project.findByIdAndDelete.restore();
        done();
      });
  });
  it('find by filter should return a list of project filtered', function (done) {
    sinon.stub(Project, 'find');

    Project.find.returns(new Promise((resolve) => resolve([project, project])));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    projectController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(Project.find).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Project.find.restore();
        done();
      });
  });
});

describe('Project controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.returns(new Promise((reject) => reject(undefined)));

    const req = {
      body: project,
    };

    res.statusCode = undefined;

    projectController
      .addProject(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(project);
        expect(projectController.addProject).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Project.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Project does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Project, 'findById');
    Project.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { projectId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    projectController
      .getProjectById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(project);
        expect(projectController.getProjectById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Project.findById.restore();
        done();
      });
  });

  it('error when project is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { projectId: 3 },
      body: {
        name: 'updated',
      },
    };

    res.statusCode = undefined;

    projectController
      .updateProject(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(project);
        expect(projectController.updateProject).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when project is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Project, 'findByIdAndDelete');
    Project.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { projectId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    projectController
      .deleteProject(req, res, () => {})
      .then(() => {
        expect(projectController.deleteProject).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Project.findByIdAndDelete.restore();
        done();
      });
  });

  it('if find by filter has an error should return this error and status of 500', function (done) {
    sinon.stub(Project, 'find');

    Project.find.returns(new Promise((resolve) => resolve(false)));

    const req = {
      body: {
        name: 'test',
      },
    };

    res.statusCode = undefined;

    projectController
      .findByFilter(req, res, () => {})
      .then(() => {
        expect(projectController.findByFilter).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Project.find.restore();
        done();
      });
  });
});
