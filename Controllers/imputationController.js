const Imputation = require('../Models/imputation');
const utils = require('../Util/utils');

exports.getImputationById = (req, res, next) => {
  const { imputationId } = req.params;
  utils.checkIfIdIsValid(imputationId, res, next);

  return Imputation.findById(imputationId)
    .then((imputation) => {
      utils.checkNotFound(imputation, imputationId, 'imputation');
      res
        .status(200)
        .json({ message: 'Imputation has been fetched !', imputation });
      return imputation;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addImputation = (req, res, next) => {
  const { employeeId } = req.body;
  const { taskId } = req.body;
  const { sprintId } = req.body;
  const { date } = req.body;
  const { hours } = req.body;

  const imputation = new Imputation({
    employeeId,
    taskId,
    sprintId,
    date,
    hours,
  });
  utils.cleanObject(imputation);

  return imputation
    .save()
    .then((imputationSaved) => {
      utils.checkSavedData(imputationSaved, 'imputation');

      res.status(201).json({
        message: 'Imputation has been created!',
        imputation: imputationSaved,
      });
      return imputationSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateImputation = (req, res, next) => {
  const { imputationId } = req.params;

  utils.checkIfIdIsValid(imputationId, res, next);

  const { employeeId } = req.body;
  const { taskId } = req.body;
  const { sprintId } = req.body;
  const { date } = req.body;
  const { hours } = req.body;

  return Imputation.findById(imputationId)
    .then((imputation) => {
      utils.checkNotFound(imputation, imputationId, 'imputation');

      imputation.employeeId = employeeId || imputation.employeeId;
      imputation.taskId = taskId || imputation.taskId;
      imputation.sprintId = sprintId || imputation.sprintId;
      imputation.date = date || imputation.date;
      imputation.hours = hours || imputation.hours;

      return imputation.save();
    })
    .then((imputation) => {
      res
        .status(200)
        .json({ message: 'Imputation has been updated', imputation });
      return imputation;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteImputation = (req, res, next) => {
  const { imputationId } = req.params;
  utils.checkIfIdIsValid(imputationId, res, next);

  return Imputation.findByIdAndDelete(imputationId)
    .then((imputation) => {
      utils.checkNotFound(imputation, imputationId, 'imputation');
      res.status(200).json({
        message: `Imputation with id: ${imputationId} has been deleted`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { employeeId } = req.body;
  const { taskId } = req.body;
  const { sprintId } = req.body;
  const { date } = req.body;
  const { hours } = req.body;

  const filter = { employeeId, taskId, sprintId, date, hours };
  utils.cleanObject(filter);

  return Imputation.find(filter)
    .then((imputations) =>
      utils.checkFilteredData(imputations, res, 'imputations')
    )
    .catch((err) => utils.errorHandler(err, res, next));
};
