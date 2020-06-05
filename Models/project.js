const mongoose = require('mongoose');

const { Schema } = mongoose;

const porjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    scrumMaster: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    productOwner: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', porjectSchema);
