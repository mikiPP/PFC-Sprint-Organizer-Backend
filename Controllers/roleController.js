const Role = require('../Models/role');
const utils = require('../Util/utils');

exports.getRoleById = (req, res, next) => {
  const { roleId } = req.params;
  utils.checkIfIdIsValid(roleId, res, next);

  return Role.findById(roleId)
    .then((role) => {
      utils.checkNotFound(role, roleId, 'role');
      res.status(200).json({
        message: 'Role has been fetched',
        role,
      });
      return role;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addRole = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;
  const { permissions } = req.body;

  const role = new Role({ name, description, disabled, permissions });
  utils.cleanObject(role);

  return role
    .save()
    .then((roleSaved) => {
      if (!roleSaved) {
        const error = new Error('The rol has not been created');
        error.statusCode = 500;
        throw error;
      }
      res.status(201).json({
        message: ' Role has been inserted!',
        role: roleSaved,
      });

      return roleSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateRole = (req, res, next) => {
  const { roleId } = req.params;
  utils.checkIfIdIsValid(roleId, res, next);

  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;
  const { permissions } = req.body;

  return Role.findById(roleId)
    .then((role) => {
      utils.checkNotFound(role, roleId, 'role');

      role.name = name || role.name;
      role.description = description || role.description;
      role.disabled = disabled || role.disabled;
      role.permissions = permissions || role.permissions;

      return role.save();
    })
    .then((role) => {
      res.status(200).json({ message: 'Role has been updated', role });
      return role;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteRole = (req, res, next) => {
  const { roleId } = req.params;
  utils.checkIfIdIsValid(roleId, res, next);

  return Role.findByIdAndDelete(roleId)
    .then((role) => {
      utils.checkNotFound(role, roleId, 'role');

      res
        .status(200)
        .json({ message: `The role with id: ${roleId} has been removed` });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;
  const { permissions } = req.body;

  const filter = { name, description, disabled, permissions };
  utils.cleanObject(filter);

  return Role.find(filter)
    .then((roles) => {
      if (roles) {
        res.status(200).json({
          message: 'roles have been fetched successfully',
          roles,
        });
        return roles;
      }
      const error = new Error('Something went wrong...');
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
