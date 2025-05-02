const Brand = require('../models/Brand');
const fs = require('fs');
const path = require('path');

// Create
exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.filename;

    const brand = new Brand({ name, image });
    await brand.save();

    res.json({ success: true, brand });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// Read All
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ success: true, brands });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log('Update brand ID:', id);
    console.log('Received name:', name);
    console.log('Received file:', req.file);

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', 'brands', brand.image);
      console.log('Old image path:', oldImagePath);

      // Delete old image if it exists
      if (brand.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      brand.image = req.file.filename;
    }

    brand.name = name;
    await brand.save();

    res.json({ success: true, brand });
  } catch (err) {
    console.error('Update Brand Error:', err); // This is key
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};


// Delete
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    if (brand.image) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', 'brands', brand.image));
    }

    await Brand.findByIdAndDelete(id);

    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
