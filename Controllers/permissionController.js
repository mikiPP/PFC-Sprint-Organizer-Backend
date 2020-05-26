const Permission = require('../Models/permission');
const utils = require('../Util/utils');

exports.getPermissionById = (req, res, next) => {
  const { permissionId } = req.params;
  utils.checkIfIdIsValid(permissionId, res, next);

  return Permission.findById(permissionId)
    .then((permission) => {
      utils.checkNotFound(permission, permissionId, 'permission');
      res.status(200).json({
        message: 'Permision has been fetched',
        permission,
      });
      return permission;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addPermission = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;

  const permission = new Permission({ name, description, disabled });
  utils.cleanObject(permission);

  return permission
    .save()
    .then((permissionSaved) => {
      utils.checkSavedData(permissionSaved, 'permission');

      res.status(201).json({
        message: 'permission has been created!',
        permission: permissionSaved,
      });
      return permissionSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updatePermission = (req, res, next) => {
  const { permissionId } = req.params;

  utils.checkIfIdIsValid(permissionId, res, next);

  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;

  return Permission.findById(permissionId)
    .then((permission) => {
      utils.checkNotFound(permission, permissionId, 'permission');

      permission.name = name || permission.name;
      permission.description = description || permission.description;
      permission.disabled = disabled || permission.disabled;
      return permission.save();
    })
    .then((permission) => {
      res
        .status(200)
        .json({ message: 'Permission has been updated! ', permission });
      return permission;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deletePermission = (req, res, next) => {
  const { permissionId } = req.params;
  utils.checkIfIdIsValid(permissionId, res, next);

  return Permission.findByIdAndDelete(permissionId)
    .then((permission) => {
      utils.checkNotFound(permission, permissionId, 'permission');
      res.status(200).json({
        message: `permission with id: ${permissionId} has been removed`,
      });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;
  const { disabled } = req.body;

  const filter = { name, description, disabled };
  utils.cleanObject(filter);

  return Permission.find(filter)
    .then((permissions) =>
      utils.checkFilteredData(permissions, res, 'permissions')
    )
    .catch((err) => utils.errorHandler(err, res, next));
};
