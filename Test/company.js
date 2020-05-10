const { expect } = require('chai');
const sinon = require('sinon');

const Company = require('../Models/company');
const companyController = require('../Controllers/companyController');
const res = require('../Util/utils').fakeController.req;

describe('Company Controller - CRUD', function() {
  it('Test if company is saved successfully !', function(done) {
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

  it('Test if company is fetched successfully !', function(done) {
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
});
