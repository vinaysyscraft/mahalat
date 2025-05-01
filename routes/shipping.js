const express = require('express');
const router = express.Router();
const ShippingZone = require('../models/ShippingZone');

// Admin: Add Shipping Zone
router.post('/admin/add-zone', async (req, res) => {
  try {
    const { city, price } = req.body;

    if (!city || !price) {
      return res.status(400).json({ success: false, message: 'City and price are required' });
    }

    const newZone = await ShippingZone.create({ city, price });

    res.status(201).json({ success: true, zone: newZone });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Admin: Update Shipping Zone
router.put('/admin/update-zone/:id', async (req, res) => {
  try {
    const { city, price } = req.body;
    const zone = await ShippingZone.findByIdAndUpdate(req.params.id, { city, price }, { new: true });

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    res.json({ success: true, zone });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Admin: Delete Shipping Zone
router.delete('/admin/delete-zone/:id', async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndDelete(req.params.id);

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Public: Get Shipping Charge by City
router.post('/get-shipping-charge', async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ success: false, message: 'City is required' });
    }

    const zone = await ShippingZone.findOne({ city: { $regex: new RegExp(city, 'i') } });

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Shipping zone not found for this city' });
    }

    res.json({ success: true, city: zone.city, shippingCharge: zone.price });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get All Shipping Zones
router.get('/zones', async (req, res) => {
    try {
      const zones = await ShippingZone.find().sort({ city: 1 }); // city name ke according sort
      res.json({ success: true, zones });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
});
  

module.exports = router;
