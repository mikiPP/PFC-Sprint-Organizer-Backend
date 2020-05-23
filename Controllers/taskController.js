const Task = require('../Models/task');
const utils = require('../Util/utils');

exports.getTaskById = (req, res, next) => {
  const { taskId } = req.params;

  utils.checkIfIdIsValid(taskId, res, next);
  return Task.findById(taskId)
    .then((task) => {
      utils.checkNotFound(task, taskId, 'task');
      res.status(200).json({ message: 'Task have been fetched', task });
      return task;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addTask = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { projectId } = req.body;
  const { estimatedTime } = req.body;
  const { realTime } = req.body;
  const { backlog } = req.body;

  const task = new Task({
    name,
    description,
    projectId,
    estimatedTime,
    realTime,
    backlog,
  });

  utils.cleanObject(task);

  return task
    .save()
    .then((taskSaved) => {
      if (!taskSaved) {
        const error = new Error('The task has not been created');
        error.statusCode = 500;
        throw error;
      }
      res.status(201).json({ message: 'Task inserted!', task: taskSaved });
      return taskSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateTask = (req, res, next) => {
  const { taskId } = req.params;

  const { name } = req.body;
  const { description } = req.body;
  const { projectId } = req.body;
  const { estimatedTime } = req.body;
  const { realTime } = req.body;
  const { backlog } = req.body;

  utils.checkIfIdIsValid(taskId, res, next);

  return Task.findById(taskId)
    .then((task) => {
      utils.checkNotFound(task, taskId, 'task');

      task.name = name || task.name;
      task.description = description || task.description;
      task.projectId = projectId || task.projectId;
      task.estimatedTime = estimatedTime || task.estimatedTime;
      task.realTime = realTime || task.realTime;
      task.backlog = backlog || task.backlog;
      return task.save();
    })
    .then((task) => {
      res.status(200).json({ message: 'Task updated !', task });
      return task;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteTask = (req, res, next) => {
  const { taskId } = req.params;
  utils.checkIfIdIsValid(taskId, res, next);

  return Task.findByIdAndDelete(taskId)
    .then((task) => {
      utils.checkNotFound(task, taskId, 'Task');
      res.status(200).json({
        message: `task with id: ${taskId} has been deleted`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { projectId } = req.body;
  const { estimatedTime } = req.body;
  const { realTime } = req.body;
  const { backlog } = req.body;

  const filter = {
    name,
    description,
    projectId,
    estimatedTime,
    realTime,
    backlog,
  };

  utils.cleanObject(filter);

  return Task.find(filter)
    .then((tasks) => {
      if (tasks !== undefined) {
        res
          .status(200)
          .json({ message: 'Tasks has been fetched successfully', tasks });
        return tasks;
      }

      const error = new Error('Something went wrong...');
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
