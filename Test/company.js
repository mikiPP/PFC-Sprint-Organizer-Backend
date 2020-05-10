const { expect } = require('chai');
const sinon = require('sinon');
const { Schema } = require('mongoose');

const Company = require('../Models/company');
const companyController = require('../Controllers/companyController');

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

    const res = {
      statusCode: 500,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        return data;
      },
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
});
