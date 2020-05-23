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
        const error = new Error('The employee has not been created');
        error.statusCode = 500;
        throw error;
      }

      res.status(201).json({ message: 'Sprint has been created', sprintSaved });
      return sprintSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
