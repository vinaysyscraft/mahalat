const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ShippingZone', shippingZoneSchema);
