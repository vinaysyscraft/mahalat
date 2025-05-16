const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ level: 1, name: 1 });

        const buildTree = async (parentId = null) => {
            const nodes = categories.filter(cat => String(cat.parentId) === String(parentId));

            return Promise.all(
                nodes.map(async (cat) => {
                    // Fetch products for this category
                    const products = await Product.find({ category: cat._id })
                        .populate('category', 'name image')
                        .populate('subcategory', 'name image')
                        .populate('subsubcategory', 'name image')
                        .populate('brand', 'name image');

                    // Recursively build subcategories
                    const subcategories = await buildTree(cat._id);

                    return {
                        ...cat._doc,
                        products,
                        subcategories
                    };
                })
            );
        };

        const categoryTree = await buildTree(null);

        res.json({
            success: true,
            categories: categoryTree
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};
// Create new category
exports.createCategory = async (req, res) => {
    try {
        const { name, parentId, level } = req.body;
        const image = req.file ? req.file.filename : '';

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const category = new Category({
            name: name.trim(),
            parentId: parentId || null,
            level: level || 1,
            image
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};


// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, parentId, level } = req.body;
        const image = req.file ? req.file.filename : null;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        if (name) category.name = name.trim();
        if (parentId !== undefined) category.parentId = parentId;
        if (level !== undefined) category.level = level;
        if (image) category.image = image;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

// Get single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// Get category names only
exports.getCategoryNames = async (req, res) => {
    try {
        const categories = await Category.find().select('name').sort({ name: 1 });
        const categoryNames = categories.map(category => category.name);
        
        res.json({
            success: true,
            categories: categoryNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category names',
            error: error.message
        });
    }
}; 
