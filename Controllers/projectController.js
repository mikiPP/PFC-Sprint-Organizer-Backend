const Project = require('../Models/project');

exports.getProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error(
        `Coudn't not find project by the id: ${projectId}`
      );
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Project have been fetched', project });
    return project;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

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
