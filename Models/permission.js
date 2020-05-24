const mongoose = require('mongoose');

const { Schema } = mongoose;

const permisionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Permision', permisionSchema);
