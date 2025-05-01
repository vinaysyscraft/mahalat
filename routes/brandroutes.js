const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandcontroller');
const upload = require('../middleware/upload');

// Create
router.post('/', upload.single('image'), brandController.createBrand);

// Read
router.get('/', brandController.getAllBrands);

// Update
router.put('/:id', upload.single('image'), brandController.updateBrand);

// Delete
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
