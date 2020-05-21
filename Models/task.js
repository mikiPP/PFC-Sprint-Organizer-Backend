const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  //   creatorId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Employee',
  //     required: true,
  //   },

  //   realizerId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Employee',
  //     required: true,
  //   },

  //   sprintId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Sprint',
  //     required: true,
  //   },

  estimatedTime: {
    type: Number,
    required: true,
  },

  realTime: {
    type: Number,
    default: 0,
  },

  //   status: {
  //     type: String.Types.ObjectId,
  //     ref: 'Status',
  //     required: true,
  //   },

  backlog: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
