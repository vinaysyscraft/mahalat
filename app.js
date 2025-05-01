const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const fs = require('fs');
const connectDB = require('./config/db');
const Category = require('./models/Category'); // Your Category model

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notification');
const shippingRoutes = require('./routes/shipping');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brandroutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/public/uploads/products', express.static(path.join(__dirname, 'public/uploads/products')));
app.use('/public/uploads/banners', express.static(path.join(__dirname, 'public/uploads/banners')));
app.use('/public/uploads/categories', express.static(path.join(__dirname, 'public/uploads/categories')));
// Serve products from /uploads/products (without needing /public in URL)
app.use('/uploads/products', express.static(path.join(__dirname, 'public/uploads/products')));

// Create necessary directories if not exist
const uploadPaths = [
  'public/uploads',
  'public/uploads/products',
  'public/uploads/banners'
];

uploadPaths.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Database connection
connectDB().then(async () => {
  console.log('Database connected successfully ✅');

  // 🔥 Drop wrong unique index if exists (only ONCE)
  try {
    const indexes = await Category.collection.indexes();
    const nameIndex = indexes.find(index => index.key && index.key.name);

    if (nameIndex && nameIndex.unique) {
      await Category.collection.dropIndex(nameIndex.name);
    } else {
      console.log('No wrong unique index on name found ✅');
    }
  } catch (err) {
    console.error('Error checking/dropping indexes:', err.message);
  }
}).catch((err) => {
  console.error(`Database connection error: ${err.message}`.red);
  process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', notificationRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/public', express.static('public'));
app.use('/api/brands', brandRoutes);
// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port:`.rainbow.bold, `${PORT}`.bold.red);
});


// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const colors = require('colors');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');
// const adminRoutes = require('./routes/admin');
// const categoryRoutes = require('./routes/categories');
// const shippingRoutes = require('./routes/shipping');
// // const categoryRoutes = require('./routes/categories');
// const fs = require('fs');


// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
// app.use('/public/uploads/products', express.static(path.join(__dirname, 'public/uploads/products')));
// app.use('/public/uploads/banners', express.static(path.join(__dirname, 'public/uploads/banners')));

// // Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, 'public/uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const productsUploadDir = path.join(__dirname, 'public/uploads/products');
// if (!fs.existsSync(productsUploadDir)) {
//     fs.mkdirSync(productsUploadDir, { recursive: true });
// }

// const bannersUploadDir = path.join(__dirname, 'public/uploads/banners');
// if (!fs.existsSync(bannersUploadDir)) {
//     fs.mkdirSync(bannersUploadDir, { recursive: true });
// }

// // Database connection
// connectDB().catch((err) => {
//     console.error(`Database connection error: ${err.message}`.red);
//     process.exit(1);
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api', orderRoutes);
// app.use('/api/admin', adminRoutes);
// // app.use('/api/admin/categories', categoryRoutes);
// const notificationRoutes = require('./routes/notification'); 
// app.use('/api', notificationRoutes);
// app.use('/api/shipping', shippingRoutes);
// app.use('/api/categories', categoryRoutes);
// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port: `.rainbow.bold, `${PORT}`.bold.red);
// });
