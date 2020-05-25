/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');

const Company = require('../Models/company');
const Project = require('../Models/project');
const companyController = require('../Controllers/companyController');
const res = require('../Util/utils').fakeRes;

const company = new Company({
  name: 'test',
  disabled: false,
  _id: '1',
});
const companyId = '5ec9a4d27b719232d84ba814';

describe('Company controller - CRUD', function () {
  it('Company successfully created should return status of 201 and the new company', function (done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.returns(new Promise((resolve) => resolve(company)));

    const req = {
      body: company,
    };

    companyController
      .addCompany(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(company.name);
        expect(result.description).to.equal(company.description);
        expect(result.disabled).to.equal(company.disabled);
        expect(res.statusCode).to.equal(201);
        Company.prototype.save.restore();
        done();
      });
  });
  it('If id given to get the company is valid find it and return the company objectd and status of 200', function (done) {
    sinon.stub(Company, 'findById');
    Company.findById.returns(new Promise((resolve) => resolve(company)));

    const req = {
      params: { companyId },
    };

    companyController
      .getCompanyById(req, res, () => {})
      .then((result) => {
        expect(Company.findById).not.to.throw();
        expect(res.statusCode).to.equal(200);
        expect(result).to.equal(company);
        Company.findById.restore();
        done();
      });
  });

  it('Company successfully updated should return the company updated and status of 200 ', function (done) {
    sinon.stub(Company, 'findById');
    sinon.stub(Company.prototype, 'save');

    Company.findById.returns(new Promise((resolve) => resolve(company)));
    Company.prototype.save.returns(
      new Promise((resolve) =>
        resolve({
          name: 'updated',
        })
      )
    );

    const req = {
      params: { companyId },
      body: {
        name: 'updated',
      },
    };

    companyController
      .updateCompany(req, res, () => {})
      .then((result) => {
        expect(result.name).to.equal(company.name);
        expect(res.statusCode).to.equal(200);
        Company.findById.restore();
        Company.prototype.save.restore();
        done();
      });
  });
  it('If the given id exists delete should delete it and return status of 200', function (done) {
    sinon.stub(Company, 'findByIdAndDelete');

    Company.findByIdAndDelete.returns(new Promise((resolve) => resolve(true)));

    sinon.stub(Project, 'deleteMany');

    Project.deleteMany.returns(new Promise((resolve) => resolve(true)));

    const req = {
      params: { companyId },
    };
    res.statusCode = 100;

    companyController
      .deleteCompany(req, res, () => {})
      .then(() => {
        expect(Company.findByIdAndDelete).not.to.throw();
        expect(res.statusCode).to.equal(200);
        Company.findByIdAndDelete.restore();
        done();
      });
  });
});

describe('Company controller - ERROR HANDLER', function () {
  it('An error on create should return status of 500', function (done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.returns(new Promise((reject) => reject(undefined)));

    const req = {
      body: company,
    };

    res.statusCode = undefined;

    companyController
      .addCompany(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(company);
        expect(companyController.addCompany).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Company.prototype.save.restore();
        done();
      });
  });
  it('If the id given to find the Company does not exist or is invalid should return status of 500 and an error', function (done) {
    sinon.stub(Company, 'findById');
    Company.findById.returns(new Promise((reject) => reject()));

    const req = {
      params: { companyId: '5ec8df3fcc6d2338d4a071b8' },
    };

    res.statusCode = undefined;

    companyController
      .getCompanyById(req, res, () => {})
      .then((result) => {
        expect(result).to.not.equal(company);
        expect(companyController.getCompanyById).to.throw();
        expect(res.statusCode).not.to.equal(200);
        Company.findById.restore();
        done();
      });
  });

  it('error when company is beeing updated should return an error and status of 500', function (done) {
    const req = {
      params: { companyId: 3 },
      body: {
        name: 'updated',
      },
    };

    res.statusCode = undefined;

    companyController
      .updateCompany(req, res, () => {})
      .then((result) => {
        expect(result).not.equal(company);
        expect(companyController.updateCompany).to.throw();
        expect(res.statusCode).not.to.equal(200);
        done();
      });
  });
  it('Error when company is beeing deleted should return an error and status of 500', function (done) {
    sinon.stub(Company, 'findByIdAndDelete');
    Company.findByIdAndDelete.returns(
      new Promise((reject) => {
        reject(false);
      })
    );

    const req = {
      params: { companyId: '5ec57bd6a31f661b2411e7fc' },
    };

    res.statusCode = undefined;

    companyController
      .deleteCompany(req, res, () => {})
      .then(() => {
        expect(companyController.deleteCompany).to.throw();
        expect(res.statusCode).to.not.equal(200);
        Company.findByIdAndDelete.restore();
        done();
      });
  });
});
