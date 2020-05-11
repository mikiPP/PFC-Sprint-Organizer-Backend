const { expect } = require('chai');
const sinon = require('sinon');

const Company = require('../Models/company');
const companyController = require('../Controllers/companyController');
const res = require('../Util/utils').fakeController.req;

describe('Company Controller - CRUD', function() {
  it('company successfully saved should return status 201 and the new company !', function(done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.returns({
      name: 'test',
      disabled: false,
      _id: '1',
    });

    const req = {
      body: { name: 'Test' },
    };

    expect(
      companyController
        .addCompany(req, res, () => {})
        .then(result => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('disabled');
          expect(res.statusCode).to.equal(201);
          Company.prototype.save.restore();
          done();
        })
    );
  });

  it('Company successefully fetched should return status 200 and the company fetched !', function(done) {
    sinon.stub(Company, 'findOne');

    Company.findOne.returns({
      name: 'test',
      disabled: false,
      _id: '1',
    });

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then(result => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('disabled');
          expect(res.statusCode).to.equal(200);
          Company.findOne.restore();
          done();
        })
    );
  });

  it('delete a company successfully should return the status of 200 !', function(done) {
    sinon.stub(Company, 'findByIdAndDelete');

    Company.findByIdAndDelete.returns({
      save() {
        return { name: 'companyUpdated', disabled: true };
      },
    });

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then(result => {
          expect(res.statusCode).to.equal(200);
          Company.findByIdAndDelete.restore();
          done();
        })
    );
  });

  it('company successfully updated should return the status of 200 !', function(done) {
    sinon.stub(Company, 'findOne');

    Company.findOne.returns({
      name: 'test',
      disabled: false,
      _id: '1',
    });

    res.company = { name: 'CompanyUpdated', disabled: true };

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then(result => {
          expect(res.statusCode).to.equal(200);
          expect(Company.findOne().name).to.not.equal(res.company.name);
          expect(Company.findOne().disabled).to.not.equal(res.company.disabled);
          Company.findOne.restore();
          done();
        })
    );
  });
});

describe('Company Controller - ERROR HANDLER ', function() {
  it('An error on create a company should return status 500', function(done) {
    sinon.stub(Company.prototype, 'save');

    Company.prototype.save.throws();

    const req = {
      body: { name: 'Test' },
    };

    expect(
      companyController
        .addCompany(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
          Company.prototype.save.restore();
          done();
        })
        .catch(err => console.log(err))
    );
  });

  it('If the id given to get the company is not in the db should return an status of 500 and an error!', function(done) {
    sinon.stub(Company, 'findOne');

    Company.findOne.throws();

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, res, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
          Company.findOne.restore();
          done();
        })
    );
  });

  it('if the given company does not exist delete should return an error and status 500 !', function(done) {
    sinon.stub(Company, 'findByIdAndDelete');

    Company.findByIdAndDelete.throws();

    const req = {
      params: { companyId: 1 },
    };

    res.statusCode = 200;

    expect(
      companyController
        .getCompany(req, {}, () => {})
        .then(result => {
          expect(result).to.have.property('statusCode', 500);
          Company.findByIdAndDelete.restore();
          done();
        })
    );

    res.statusCode = 500;
  });

  it('if the id given to update the company does not exists should return an error and status of 500 !', function(done) {
    sinon.stub(Company, 'findOne');

    Company.findOne.throws();

    res.company = { name: 'CompanyUpdated', disabled: true };

    const req = {
      params: { companyId: 1 },
    };

    expect(
      companyController
        .getCompany(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
          Company.findOne.restore();
          done();
        })
    );
  });
});
