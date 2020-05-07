const Company = require('../Models/company');

module.exports.getCompany = (req, res, next) => {
  res.send('<h1>Hello from Express!</h1>');
};

module.exports.addCompany = (req, res, next) => {
  const { name } = req.body;
  const company = new Company(name);
  company.save().then(() => console.log('Company has been created'));
  res.send(company);
};
