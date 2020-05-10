const Company = require('../Models/company');

module.exports.getCompany = async (req, res, next) => {
  const { companyId } = req.params;

  try {
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
  }
};

module.exports.addCompany = async (req, res, next) => {
  const company = new Company({ name: req.body.name });

  try {
    const result = await company.save();
    if (!result) {
      const error = new Error('The company has not been created');
      error.statusCode = 500;
      throw error;
    }

    res
      .status(201)
      .json({ message: 'Company created!', companyId: result._id });

    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
