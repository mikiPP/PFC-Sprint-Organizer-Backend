/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Project = require('../Models/project');
const projectController = require('../Controllers/projectController');
const { res } = require('../Util/utils').fakeController;

const project = {
  name: 'test',
  scrumMaster: 'test',
  disabled: false,
  companyId: '1',
};

describe('Project Controller - CRUD', function () {
  it('project successfully created should return status 201 and the new Project !', function (done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.returns(new Promise((resolve) => resolve(project)));

    const req = {
      body: project,
    };

    expect(
      projectController
        .addProject(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('scrumMaster');
          expect(result).to.have.property('disabled');
          expect(result).to.have.property('companyId');
          expect(res.statusCode).to.equal(201);
          Project.prototype.save.restore();
          done();
        })
    );
  });

  it('Project successfully fetched should return status of 200 and the project fetched !', function (done) {
    sinon.stub(Project, 'findById');

    Project.findById.returns(new Promise((resolve) => resolve(project)));

    const req = {
      params: { projectId: 1 },
    };

    expect(
      projectController
        .getProjectById(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('scrumMaster');
          expect(result).to.have.property('disabled');
          expect(result).to.have.property('companyId');
          expect(res.statusCode).to.equal(200);
          Project.findById.restore();
          done();
        })
    );
  });

  it('Project successfully updated should return the project updated and status of 200', function (done) {
    sinon.stub(Project, 'findById');
    sinon.stub(Project.prototype, 'save');

    Project.findById.returns(new Promise((resolve) => resolve(project)));
    Project.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'testUpdated',
          scrumMaster: 'testUpdated',
          disabled: true,
          companyId: '2',
        })
      )
    );

    const req = {
      params: { projectId: '5ebc27837f1a751880863eac' },
      body: {
        name: 'testUpdated',
        scrumMaster: 'testUpdated',
        disabled: true,
        companyId: '2',
      },
    };

    res.project = {
      name: 'testUpdated',
      scrumMaster: 'testUpdated',
      disabled: true,
      companyId: '2',
    };

    expect(
      projectController
        .getProjectById(req, res, () => {})
        .then(() => {
          expect(res.project.name).to.not.equal(project.name);
          expect(res.project.scrumMaster).to.not.equal(project.scrumMaster);
          expect(res.project.disabled).to.not.equal(project.disabled);
          expect(res.project.companyId).to.not.equal(project.companyId);
          expect(res.statusCode).to.equal(200);
          Project.findById.restore();
          Project.prototype.save.restore();
          done();
        })
    );
  });

  it('if the given project id does exist delete should return status of  200 !', function () {
    sinon.stub(Project, 'findByIdAndDelete');

    Project.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { projectId: '5ebc2625859bcf086cb4600d' },
    };

    projectController.deleteProject(req, res, () => {});
    expect(Project.findByIdAndDelete).not.to.throw();
    expect(res.statusCode).to.equal(200);

    Project.findByIdAndDelete.restore();

    res.statusCode = 500;
  });
  it('find by filter should return a list of projects filtereds', function () {
    sinon.stub(Project, 'find');

    Project.find.returns(
      new Promise((resolve) => resolve({ projects: [project, project] }))
    );

    req = {
      body: {
        companyId: 1,
      },
    };

    projectController.findByFilter(req, res, () => {});
    expect(Project.find).not.to.throw();
    expect(res.statusCode).to.equal(200);
    Project.find.restore();
  });
});

describe('Project Controller - ERROR HANDLER', function () {
  it('An error on create a project should return status of 500', function (done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.returns(new Promise((reject) => reject()));

    const req = {
      body: project,
    };

    projectController
      .addProject(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(project);
        expect(res.status).to.not.equal(200);
        Project.prototype.save.restore();
        done();
      });
  });

  it('If the id given to get the project does not exist should return an status of 500 and an error !', function (done) {
    sinon.stub(Project, 'findById');

    Project.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { projectId: 2 },
    };

    projectController
      .getProjectById(req, res, () => {})
      .then(() => {
        expect(projectController.getProjectById).to.throw();
        expect(res.status).to.not.equal(200);
        Project.findById.restore();
        done();
      });
  });

  it('if the id given to update the project does no exists or is invalid should return an error and status of 4xx', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { projectId: 1 },
      body: {
        name: 'testUpdated',
        scrumMaster: 'testUpdated',
        disabled: true,
        companyId: '2',
      },
    };

    projectController.updateProject(req, res, () => {});
    expect(projectController.updateProject).to.throw();
    expect(res.status).to.not.equal(200);
    mongoose.Types.ObjectId.isValid.restore();
  });

  it('if the id given to delete the project does no exists or is invalid should return an error and status of 4xx', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { projectId: 1 },
    };

    projectController.deleteProject(req, res, () => {});
    expect(projectController.deleteProject).to.throw();
    expect(res.statusCode).to.not.equal(200);
    mongoose.Types.ObjectId.isValid.restore();
  });
  it('if get all by filter has an error should an error', function () {
    sinon.stub(Project, 'find');

    Project.find.returns(new Promise((reject) => reject()));

    req = {
      body: {
        companyId: 1,
      },
    };

    res.statusCode = 500;

    projectController.findByFilter(req, res, () => {});
    expect(projectController.findByFilter).to.throw();
    expect(res.statusCode).to.equal(500);
    Project.find.restore();
  });
});
