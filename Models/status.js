const mongoose = require('mongoose');

const { Schema } = mongoose;

const statusSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Status', statusSchema);
