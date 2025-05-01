const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const CategoryController = require('../controllers/CategoryController');

// POST: Create category with image
router.post('/', upload.single('image'), CategoryController.createCategory);

// PUT: Update category with optional image update
router.put('/:id', upload.single('image'), CategoryController.updateCategory);

// Other routes remain unchanged
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Category = require('../models/Category');

// // Add New Category
// router.post('/', async (req, res) => {
//   const { name, parentId, level } = req.body;
  
//   try {
//     const category = await Category.create({ name, parentId, level });
//     res.status(201).json({ success: true, category });
//   } catch (error) {
//     console.error('Error creating category:', error);
//     res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
//   }
// });

// // Get All Categories (with nested subcategories)
// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.find().sort({ level: 1, name: 1 });

//     const categoryTree = categories
//       .filter(category => !category.parentId)
//       .map(parentCategory => ({
//         ...parentCategory._doc,
//         subcategories: categories.filter(subCategory => subCategory.parentId?.toString() === parentCategory._id.toString())
//       }));

//     res.json({ success: true, categories: categoryTree });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ success: false, message: 'Error fetching categories' });
//   }
// });

// // Get Category by ID (with its subcategories)
// router.get('/:id', async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ success: false, message: 'Category not found' });
//     }

//     const subcategories = await Category.find({ parentId: category._id });

//     res.json({
//       success: true,
//       category: { ...category._doc, subcategories }
//     });
//   } catch (error) {
//     console.error('Error fetching category:', error);
//     res.status(500).json({ success: false, message: 'Error fetching category' });
//   }
// });

// // Delete Category (and its subcategories)
// router.delete('/:id', async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ success: false, message: 'Category not found' });
//     }

//     await Category.deleteMany({ parentId: category._id }); // Delete subcategories
//     await category.deleteOne(); // Delete main category

//     res.json({ success: true, message: 'Category and its subcategories deleted' });
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     res.status(500).json({ success: false, message: 'Error deleting category' });
//   }
// });

// // Update Category
// router.put('/:id', async (req, res) => {
//   const { name, parentId, level } = req.body;

//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ success: false, message: 'Category not found' });
//     }

//     category.name = name || category.name;
//     category.parentId = parentId || category.parentId;
//     category.level = level || category.level;

//     await category.save();
//     res.json({ success: true, category });
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(500).json({ success: false, message: 'Error updating category' });
//   }
// });

// // Route to get all parent categories (no children)
// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.find({ parentId: null }).sort({ name: 1 }); // Only parent categories
//     res.json({ success: true, categories });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ success: false, message: 'Error fetching categories' });
//   }
// });


// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { 
//     getAllCategories, 
//     createCategory, 
//     deleteCategory, 
//     updateCategory,
//     getCategory,
//     getCategoryNames
// } = require('../controllers/CategoryController');
// const authenticateToken = require('../middleware/authMiddleware');
// const isAuthenticated = require('../middleware/auth');


// // Protected route for category names
// router.get('/names', isAuthenticated,getCategoryNames);

// // Protected routes
// router.get('/', authenticateToken, getAllCategories);
// router.get('/:id', authenticateToken, getCategory);
// router.post('/', authenticateToken,createCategory);
// router.delete('/:id', authenticateToken, deleteCategory);
// router.put('/:id',authenticateToken, updateCategory);

// module.exports = router; 