const Project = require('../Models/project');
const checkIfIdIsValid = require('../Util/utils').checkIfIdIsValid;

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

exports.updateProject = (req, res, next) => {
	const { projectId } = req.params;

	const { name } = req.body;
	const { scrumMaster } = req.body;
	const { disabled } = req.body;
	const { companyId } = req.body;


	checkIfIdIsValid(projectId,res,next);
	Project.findById(projectId)
		.then(project => {
			if (project) {
				project.name = name;
				project.scrumMaster = scrumMaster;
				project.disabled = disabled;
				project.companyId = companyId;

				return project.save();
			}
			const error = new Error(
				`Project with id: ${projectId} has not been found!`
			);
			error.statusCode = 404;
			throw error;
		})
		.then(result => {
			res.status(201).json({ message: 'Project updated!', project: result });
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			return next(err);
		});
};

exports.deleteProject = (req, res, next) => {
  
	const { projectId } = req.params;

	checkIfIdIsValid(projectId,res,next);
	Project.findByIdAndDelete(projectId)
		.then(result => {
			if (result) {
				res.status(200).json({
					message: `project with id: ${projectId} has been deleted`,
				});
				return;
			}
			const error = new Error(
				`Project with id: ${projectId} has not been found!`
			);
			error.statusCode = 404;
			throw error;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			return next(err);
		});
};
