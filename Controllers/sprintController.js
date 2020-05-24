const Sprint = require('../Models/sprint');
const utils = require('../Util/utils');

exports.getSprintById = (req, res, next) => {
  const { sprintId } = req.params;
  utils.checkIfIdIsValid(sprintId, res, next);

  return Sprint.findById(sprintId)
    .then((sprint) => {
      utils.checkNotFound(sprint, sprintId, 'sprint');
      res.status(200).json({ message: 'Sprint has been fetched !', sprint });
      return sprint;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addSprint = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;
  const { statusId } = req.body;
  const { scheduledHours } = req.body;
  const { realHours } = req.body;
  const { projectId } = req.body;

  const sprint = new Sprint({
    name,
    description,
    startDate,
    endDate,
    statusId,
    scheduledHours,
    realHours,
    projectId,
  });

  utils.cleanObject(sprint);

  return sprint
    .save()
    .then((sprintSaved) => {
      if (!sprintSaved) {
        const error = new Error('The sprint has not been created');
        error.statusCode = 500;
        throw error;
      }

      res
        .status(201)
        .json({ message: 'Sprint has been created', spirnt: sprintSaved });
      return sprintSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateSprint = (req, res, next) => {
  const { sprintId } = req.params;
  utils.checkIfIdIsValid(sprintId, res, next);

  const { name } = req.body;
  const { description } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;
  const { statusId } = req.body;
  const { scheduledHours } = req.body;
  const { realHours } = req.body;
  const { projectId } = req.body;

  return Sprint.findById(sprintId)
    .then((sprint) => {
      utils.checkNotFound(sprint, sprintId, 'sprint');

      sprint.name = name || sprint.name;
      sprint.description = description || sprint.description;
      sprint.startDate = startDate || sprint.startDate;
      sprint.endDate = endDate || sprint.endDate;
      sprint.statusId = statusId || sprint.statusId;
      sprint.scheduledHours = scheduledHours || sprint.scheduledHours;
      sprint.realHours = realHours || sprint.realHours;
      sprint.projectId = projectId || sprint.projectId;

      return sprint.save();
    })
    .then((sprint) => {
      res.status(200).json({ message: 'Sprint has been updated !', sprint });
      return sprint;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteSprint = (req, res, next) => {
  const { sprintId } = req.params;

  utils.checkIfIdIsValid(sprintId, res, next);

  return Sprint.findByIdAndDelete(sprintId)
    .then((sprint) => {
      utils.checkNotFound(sprint, sprintId, 'sprint');

      res.status(200).json({
        message: `The sprint with id ${sprintId} has been removed`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;
  const { statusId } = req.body;
  const { scheduledHours } = req.body;
  const { realHours } = req.body;
  const { projectId } = req.body;

  const filter = {
    name,
    description,
    startDate,
    endDate,
    statusId,
    scheduledHours,
    realHours,
    projectId,
  };

  utils.cleanObject(filter);

  return Sprint.find(filter)
    .then((sprints) => {
      if (sprints) {
        res.status(200).json({
          message: 'Sprints has been fetched successfully',
          sprints,
        });
        return sprints;
      }
      const error = new Error('Something went wrong...');
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
