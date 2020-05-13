const Project = require('../Models/project');

exports.addProject = async (req, res, next) => {
  const { name } = req.body;
  const { scrumMaster } = req.body;
  const { disabled } = req.body;
  const { companyId } = req.body;

  const project = new Project({ name, scrumMaster, disabled, companyId });

  try {
    const result = await project.save();
    if (!result) {
      const error = new Error('The project has not been created');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({ message: 'project created!', Project: result });
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
