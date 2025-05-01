const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: false
    },
    subsubcategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: false
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    stock: { type: Number, required: true },
    image: { type: String },             // Main image
    imgGallery: { type: [String], default: [] }, // Multiple images
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    brand: { type: String, required: true },
    productSku: { type: String, required: true }, 
    styleNo: { type: String, required: true }
},{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);


// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     salePrice: { type: Number, default: null },
//     stock: { type: Number, required: true },
//     image: { type: String },
//     colors: { type: [String], default: [] },
//     sizes: { type: [String], default: [] },
// });

// module.exports = mongoose.model('Product', productSchema);
