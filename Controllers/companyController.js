const Company = require('../Models/company');
const Project = require('../Models/project');
const utils = require('../Util/utils');

module.exports.getCompany = (req, res, next) => {
  const { companyId } = req.params;

  return Company.findById(companyId)
    .then((company) => {
      if (!company) {
        const error = new Error(
          `Coudnt not find Company by the id: ${companyId}`
        );
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Company have been fetched', company });
      return company;
    })
    .catch((err) => {
      return utils.errorHandler(err, res, next);
    });
};

exports.addCompany = (req, res, next) => {
  const { name } = req.body;

  const company = new Company({ name });

  return company
    .save()
    .then((companySaved) => {
      if (!companySaved) {
        const error = new Error('The company has not been created');
        error.statusCode = 500;
        throw error;
      }

      res
        .status(201)
        .json({ message: 'Company created!', company: companySaved });
      return companySaved;
    })
    .catch((err) => {
      return utils.errorHandler(err, res, next);
    });
};

exports.updateCompany = (req, res, next) => {
  const { companyId } = req.params;
  const updatedName = req.body.name;
  const updatedDisabled = req.body.disabled;

  utils.checkIfIdIsValid(companyId, res, next);
  return Company.findById(companyId)
    .then((company) => {
      if (company) {
        company.name = updatedName;
        company.disabled = updatedDisabled;

        return company.save();
      }
      const error = new Error(
        `Project with id: ${companyId} has not been found!`
      );
      error.statusCode = 404;
      throw error;
    })
    .then((result) => {
      res.status(201).json({ message: 'Company updated!', company: result });
      return result;
    })
    .catch((err) => {
      return utils.errorHandler(err, res, next);
    });
};

exports.deleteCompany = (req, res, next) => {
  const { companyId } = req.params;

  utils.checkIfIdIsValid(companyId, res, next);
  return Company.findByIdAndDelete(companyId)
    .then((company) => {
      if (company) {
        return company;
      }
      const error = new Error(
        `Company with id: ${companyId} has not been found!`
      );
      error.statusCode = 404;
      throw error;
    })
    .then((company) => {
      return Project.deleteMany({ companyId: company._id }).then(() => {
        return company;
      });
    })
    .then((company) => {
      console.log('something');
      res
        .status(200)
        .json({ message: `Company with id: ${companyId} has been deleted` });
      return company;
    })
    .catch((err) => {
      return utils.errorHandler(err, res, next);
    });
};
