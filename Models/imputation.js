const mongoose = require('mongoose');

const { Schema } = mongoose;

const imputationSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },

    sprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    hours: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Imputation', imputationSchema);
