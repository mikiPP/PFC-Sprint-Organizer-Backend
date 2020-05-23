const mongoose = require('mongoose');

const { Schema } = mongoose;

const sprintSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  statusId: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  },

  scheduledHours: {
    type: Number,
  },

  realHours: {
    type: Number,
  },

  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  /*  users: {},

  tasks: {} */
});

module.exports = mongoose.model('Sprint', sprintSchema);
