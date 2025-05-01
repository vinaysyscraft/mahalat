const express = require('express');
const { getNewArrivals, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addProductPage } = require('../controllers/ProductController');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware
const Product = require('../models/Product');  // <-- Import the Product model
const ProductController = require('../controllers/ProductController');


const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.post('/', upload.fields([
        { name: 'image', maxCount: 1 },             
        { name: 'imgGallery', maxCount: 5 }           
    ]), createProduct);

router.get('/', getAllProducts);
router.get('/add', addProductPage);
router.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imgGallery', maxCount: 5 }
]), updateProduct);

router.delete('/:id', deleteProduct);

// Search route
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;

        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // case-insensitive match
        }

        const products = await Product.find(query)
            .populate('category')
            .populate('subcategory')
            .populate('subsubcategory');

        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/products/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

module.exports = router;
