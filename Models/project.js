const mongoose = require('mongoose');

const { Schema } = mongoose;

const porjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  scrumMaster: {
    type: String,
    required: true,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

module.exports = mongoose.model('Project', porjectSchema);
