const express = require('express');
const { order, orders } = require('../controllers/OrderController'); 
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.post('/order', isAuthenticated, order); 
router.get('/orders', isAuthenticated, orders); // This is for fetching the orders of the logged-in user

module.exports = router;
