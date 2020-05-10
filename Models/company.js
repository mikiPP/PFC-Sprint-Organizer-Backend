const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true },
  disabled: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model('Company', companySchema);
