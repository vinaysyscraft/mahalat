const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // store filename
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
