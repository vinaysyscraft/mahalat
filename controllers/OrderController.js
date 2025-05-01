const Order = require('../models/Order');
const Product = require('../models/Product');

exports.order = async (req, res) => {
    try {
      const { items, delivery_address, delivery_option, payment_status, order_status } = req.body;

      // Validate input
      if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: 'Invalid items.' });
      if (!delivery_address || !delivery_option || !payment_status || !order_status) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
  
      // Create the order
      const order = new Order({
        items,
        delivery_address,
        delivery_option,
        payment_status,
        order_status,
        user: req.user._id,  // Associate the order with the authenticated user
      });
  
      await order.save();
  
      res.status(201).json({
        success: true,
        message: 'Order placed successfully.',
        data: order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.orders = async (req, res) => {
  try {
      const userId = req.user._id;  // Get user ID from the token

      const orders = await Order.find({ user: userId });

      if (orders.length === 0) {
          return res.status(404).json({ success: false, message: 'No orders found for this user.' });
      }

      res.status(200).json({
          success: true,
          message: 'Orders fetched successfully.',
          data: orders,
      });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Backend

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    // Add isNew flag based on creation time (e.g. within last 24 hours)
    const ordersWithNewFlag = orders.map(order => {
      const orderObj = order.toObject();
      const isNew = (Date.now() - new Date(order.createdAt).getTime()) < 24 * 60 * 60 * 1000;
      return { ...orderObj, isNew };
    });

    if (!ordersWithNewFlag.length) {
      return res.status(404).json({ success: false, message: 'No orders found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully.',
      data: ordersWithNewFlag,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Total Revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    // Fetch only successful payment orders
    const orders = await Order.find({ order_status: 'success' });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => {
        return orderSum + (parseFloat(item.price) * item.quantity);
      }, 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: totalRevenue.toFixed(2), // Keep two decimal points
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get Order Status (Success vs. Cancelled Orders)
exports.getOrderStatus = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          successfulOrders: { $sum: { $cond: [{ $eq: ["$order_status", "success"] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ["$order_status", "cancelled"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    const result = {
      successfulOrders: orders.map(order => order.successfulOrders),
      cancelledOrders: orders.map(order => order.cancelledOrders),
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get Total Orders by Month
exports.getTotalOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    const result = {
      totalOrders: orders.map(order => order.totalOrders),
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Add this function to the existing OrderController
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'success', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { order_status: status },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Add new order
exports.addOrder = async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      size, 
      color, 
      delivery_address, 
      delivery_option,
      payment_status,
      order_status 
    } = req.body;

    // Validate required fields
    if (!productId || !quantity || !delivery_address || !delivery_option) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create order without user reference for now
    const order = new Order({
      items: [{
        productId,
        title: product.name,
        quantity,
        price: product.price,
        size,
        color
      }],
      delivery_address,
      delivery_option,
      payment_status: payment_status || 'pending',
      order_status: order_status || 'pending',
      // Remove user field or set a default user if needed
      user: req.user?._id || '64a545b1c0d0e2a2c5c39c44' // Add a default admin user ID here
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order added successfully',
      data: order
    });

  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding order',
      error: error.message
    });
  }
};




  