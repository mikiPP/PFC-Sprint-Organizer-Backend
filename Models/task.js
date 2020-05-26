const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
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

    type: {
      type: String,
      default: 'New feature',
    },

    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    realizerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },

    sprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
    },

    estimatedTime: {
      type: Number,
      required: true,
    },

    realTime: {
      type: Number,
      default: 0,
    },

    statusId: {
      type: Schema.Types.ObjectId,
      ref: 'Status',
      required: true,
    },

    backlog: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
