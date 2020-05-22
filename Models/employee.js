const mongoose = require('mongoose');

const { Schema } = mongoose;

const employeeSchema = new Schema({
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

  //   rol{
  //       type:
  //   }

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
});

module.exports = mongoose.model('Employee', employeeSchema);
