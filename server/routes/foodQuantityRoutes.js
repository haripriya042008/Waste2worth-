const express = require('express');
const router = express.Router();
const { calculateQuantity } = require('../controllers/foodQuantityController');

router.post('/calculate', calculateQuantity);

module.exports = router;
