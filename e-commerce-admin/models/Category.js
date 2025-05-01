const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  image: {
    type: String, // store image filename
    default: ''
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;



// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Category', categorySchema); 