const Company = require('../Models/company');
const Project = require('../Models/project');
const { checkIfIdIsValid } = require('../Util/utils');

module.exports.getCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      const error = new Error(
        `Coudnt not find Company by the id: ${companyId}`
      );
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Company have been fetched', company });
    return company;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.addCompany = async (req, res, next) => {
  try {
    const company = new Company({ name: req.body.name });
    const result = await company.save();
    if (!result) {
      const error = new Error('The company has not been created');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({ message: 'Company created!', company: result });
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.updateCompany = (req, res, next) => {
  const { companyId } = req.params;
  const updatedName = req.body.name;
  const updatedDisabled = req.body.disabled;

  checkIfIdIsValid(companyId, res, next);
  Company.findById(companyId)
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
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteCompany = (req, res, next) => {
  const { companyId } = req.params;

  checkIfIdIsValid(companyId, res, next);
  Company.findByIdAndDelete(companyId)
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
      return Project.deleteMany({ companyId: company._id });
    })
    .then(() => {
      res
        .status(200)
        .json({ message: `Company with id: ${companyId} has been deleted` });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      return err;
    });
};
