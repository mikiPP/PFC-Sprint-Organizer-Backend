const Project = require('../Models/project');
const utils = require('../Util/utils');

exports.getProjectById = (req, res, next) => {
  const { projectId } = req.params;

  utils.checkIfIdIsValid(projectId, res, next);
  return Project.findById(projectId)
    .then((project) => {
      utils.checkNotFound(project, projectId, 'project');
      res.status(200).json({ message: 'Project have been fetched', project });
      return project;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addProject = (req, res, next) => {
  const { name } = req.body;
  const { scrumMaster } = req.body;
  const { disabled } = req.body;
  const { companyId } = req.body;

  const project = new Project({ name, scrumMaster, disabled, companyId });

  utils.cleanObject(project);

  return project
    .save()
    .then((projectSaved) => {
      if (!projectSaved) {
        const error = new Error('The project has not been created');
        error.statusCode = 500;
        throw error;
      }
      res
        .status(201)
        .json({ message: 'project created!', Project: projectSaved });
      return projectSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateProject = (req, res, next) => {
  const { projectId } = req.params;

  const { name } = req.body;
  const { scrumMaster } = req.body;
  const { disabled } = req.body;
  const { companyId } = req.body;

  utils.checkIfIdIsValid(projectId, res, next);
  return Project.findById(projectId)
    .then((project) => {
      utils.checkNotFound(project, projectId, 'project');
      project.name = name || project.name;
      project.scrumMaster = scrumMaster || project.scrumMaster;
      project.disabled = disabled || project.disabled;
      project.companyId = companyId || project.companyId;

      return project.save();
    })
    .then((project) => {
      res.status(200).json({ message: 'Project updated!', project });
      return project;
    })
    .catch((err) => {
      utils.errorHandler(err, res, next);
    });
};

exports.deleteProject = (req, res, next) => {
  const { projectId } = req.params;

  utils.checkIfIdIsValid(projectId, res, next);
  return Project.findByIdAndDelete(projectId)
    .then((project) => {
      utils.checkNotFound(project, projectId, 'project');
      res.status(200).json({
        message: `project with id: ${projectId} has been deleted`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { scrumMaster } = req.body ? req.body : null;
  const { disabled } = req.body;
  const { companyId } = req.body;

  const filter = { name, scrumMaster, disabled, companyId };
  utils.cleanObject(filter);

  return Project.find(filter)
    .then((projects) => utils.checkFilteredData(projects, res, 'projects'))
    .catch((err) => utils.errorHandler(err, res, next));
};
