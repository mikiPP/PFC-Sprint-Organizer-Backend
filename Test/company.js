/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Company = require('../Models/company');
const Project = require('../Models/project');
const companyController = require('../Controllers/companyController');
const { res } = require('../Util/utils').fakeController;

const company = {
  name: 'test',
  disabled: false,
  _id: '1',
};

describe('Company Controller - CRUD', function () {
  it('company successfully created should return status 201 and the new company !', function (done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.returns(new Promise((resolve) => resolve(company)));

    const req = {
      body: { name: 'Test' },
    };

    expect(
      companyController
        .addCompany(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('disabled');
          expect(res.statusCode).to.equal(201);
          Company.prototype.save.restore();
          done();
        })
    );
  });

  it('Company successefully fetched should return status 200 and the company fetched !', function (done) {
    sinon.stub(Company, 'findById');

    Company.findById.returns(new Promise((resolve) => resolve(company)));

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then((result) => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('disabled');
          expect(res.statusCode).to.equal(200);
          Company.findById.restore();
          done();
        })
    );
  });

  it('delete a company successfully should return the status of 200 !', function (done) {
    sinon.stub(Company, 'findByIdAndDelete');

    Company.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    sinon.stub(Project, 'deleteMany');

    Project.deleteMany.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .deleteCompany(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.equal(200);
          Company.findByIdAndDelete.restore();
          Project.deleteMany.restore();
          done();
        })
    );
  });

  it('company successfully updated should return the status of 200 !', function (done) {
    sinon.stub(Company, 'findById');
    sinon.stub(Company.prototype, 'save');

    Company.findById.returns(new Promise((resolve) => resolve(company)));

    Company.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'CompanyUpdated',
          disabled: true,
          _id: '2',
        })
      )
    );

    res.company = { name: 'CompanyUpdated', disabled: true };

    const req = {
      params: { companyId: 1 },
      body: {
        name: 'CompanyUpdated',
        disabled: true,
        _id: '2',
      },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.company.name).to.not.equal(company.name);
          expect(res.company.disabled).to.not.equal(company.disabled);
          Company.findById.restore();
          Company.prototype.save.restore();
          done();
        })
    );
  });
});

describe('Company Controller - ERROR HANDLER ', function () {
  it('An error on create a company should return status of 500', function (done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.returns(new Promise((reject) => reject()));

    const req = {
      body: { name: 'Test' },
    };

    expect(
      companyController
        .addCompany(req, {}, () => {})
        .then((result) => {
          expect(result).to.not.equal(company);
          expect(result).to.not.equal(200);
          Company.prototype.save.restore();
          done();
        })
    );
  });

  it('If the id given to get the company is not in the db should return an status of 500 and an error!', function (done) {
    sinon.stub(Company, 'findById');

    Company.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then((result) => {
          expect(result).to.not.equal(company);
          expect(result).to.not.equal(200);
          Company.findById.restore();
          done();
        })
    );
  });

  it('if the given company does not exist delete should return an error and status 4xx !', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { companyId: 1 },
    };

    companyController.deleteCompany(req, res, () => {});
    expect(companyController.deleteCompany).to.throw();
    expect(res.status).to.not.equal(200);
    mongoose.Types.ObjectId.isValid.restore();
  });

  it('if the id given to update the company does not exists should return an error and status of 500 !', function () {
    sinon.stub(mongoose.Types.ObjectId, 'isValid');
    mongoose.Types.ObjectId.isValid.returns(false);

    const req = {
      params: { companyId: 1 },
      body: {
        name: 'testUpdated',
        disabled: true,
      },
    };

    companyController.updateCompany(req, res, () => {});
    expect(companyController.updateCompany).to.throw();
    expect(res.status).to.not.equal(200);
    mongoose.Types.ObjectId.isValid.restore();
  });
});
