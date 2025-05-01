const path = require('path');
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, subcategory, subsubcategory, description, price, salePrice, stock, brand, productSku, styleNo } = req.body;


        let colors = [];
        let sizes = [];

        try {
            colors = JSON.parse(req.body.colors || '[]');
            sizes = JSON.parse(req.body.sizes || '[]');
        } catch (e) {
            console.error('Error parsing colors/sizes:', e);
        }

        if (!name || !category || !description || !price || !stock) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }

        const productData = {
            name,
            category,
            subcategory,
            subsubcategory,
            description,
            price: Number(price),
            stock: Number(stock),
            colors,
            sizes,
            brand,
            productSku, 
            styleNo
        };

        // Handle main image
        if (req.files && req.files.image && req.files.image[0]) {
            productData.image = req.files.image[0].filename;
        }

        // Handle image gallery
        if (req.files && req.files.imgGallery) {
            productData.imgGallery = req.files.imgGallery.map(file => file.filename);
        }

        if (salePrice && salePrice !== 'null') {
            productData.salePrice = Number(salePrice);
        }

        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('subcategory', 'name')
            .populate('subsubcategory', 'name');
        res.json({ status: 'success', data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .populate('subsubcategory', 'name');
      res.json({ status: 'success', data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
  

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')  
            .populate('subcategory', 'name')  
            .populate('subsubcategory', 'name');

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', data: product });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


const mongoose = require('mongoose');
const Category = require('../models/Category');
exports.updateProduct = async (req, res) => {
    try {
        let { name, category, subcategory, subsubcategory, description, price, salePrice, stock, brand, productSku, styleNo } = req.body;

        // Convert category to ID if needed
        if (!mongoose.Types.ObjectId.isValid(category)) {
            const catDoc = await Category.findOne({ name: category });
            if (!catDoc) return res.status(400).json({ status: 'error', message: 'Invalid category name' });
            category = catDoc._id;
        }

        // Convert subcategory to ID
        if (subcategory && !mongoose.Types.ObjectId.isValid(subcategory)) {
            const subcatDoc = await Category.findOne({ name: subcategory });
            if (!subcatDoc) return res.status(400).json({ status: 'error', message: 'Invalid subcategory name' });
            subcategory = subcatDoc._id;
        }

        // Convert subsubcategory to ID
        if (subsubcategory && !mongoose.Types.ObjectId.isValid(subsubcategory)) {
            const subsubcatDoc = await Category.findOne({ name: subsubcategory });
            if (!subsubcatDoc) return res.status(400).json({ status: 'error', message: 'Invalid sub-subcategory name' });
            subsubcategory = subsubcatDoc._id;
        }

        let colors = [];
        let sizes = [];

        try {
            colors = JSON.parse(req.body.colors || '[]');
            sizes = JSON.parse(req.body.sizes || '[]');
        } catch (e) {
            console.error('Error parsing colors/sizes:', e);
        }

        const updateData = {
            name,
            category,
            subcategory,
            subsubcategory,
            description,
            price: Number(price),
            salePrice: salePrice && salePrice !== 'null' ? Number(salePrice) : null,
            stock: Number(stock),
            colors,
            sizes,
            brand,
            productSku,
            styleNo
        };

        // Main image
        if (req.files && req.files.image && req.files.image[0]) {
            updateData.image = req.files.image[0].filename;
        }

        // Gallery images
        if (req.files && req.files.imgGallery) {
            updateData.imgGallery = req.files.imgGallery.map(file => file.filename);
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};



// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Serve Add Product page (HTML form)
exports.addProductPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/addProduct/index.html'));
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};


// Get New Arrival Products (added within the last 7 days)
exports.getNewArrivals = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const products = await Product.find({
            createdAt: { $gte: oneWeekAgo }
        })
        .sort({ createdAt: -1 })
        .limit(10);

        res.status(200).json({
            status: 'success',
            data: products
        });
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

  