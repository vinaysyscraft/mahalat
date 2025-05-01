const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addProductPage } = require('../controllers/ProductController');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware


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

router.post('/',upload.fields([
        { name: 'image', maxCount: 1 },             
        { name: 'imgGallery', maxCount: 5 }           
    ]),
    createProduct
);

router.get('/', getAllProducts);
router.get('/add', addProductPage);
router.get('/:id', getProductById);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

