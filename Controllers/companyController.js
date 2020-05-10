const Company = require('../Models/company');

module.exports.getCompany = (req, res, next) => {
  res.send('<h1>Hello from Express!</h1>');
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
