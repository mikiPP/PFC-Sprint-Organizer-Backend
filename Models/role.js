const mongoose = require('mongoose');

const { Schema } = mongoose;

const roleSchema = new Schema({
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

  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
  ],
});

module.exports = mongoose.model('Role', roleSchema);
