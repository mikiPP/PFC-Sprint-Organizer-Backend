const mongoose = require('mongoose');

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    surnames: {
      type: String,
    },

    birthDay: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
    },

    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },

    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],

    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },

    profile: {
      type: String,
      required: true,
    },

    vacationDays: {
      type: Number,
      default: 23,
    },

    hoursDay: {
      type: Number,
      default: 8,
    },

    hoursWeek: {
      type: Number,
      default: 40,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
