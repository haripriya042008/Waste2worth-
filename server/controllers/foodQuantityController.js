const { calculateFoodQuantity, SERVING_SIZE_CONFIG } = require('../services/calculationService');

// @desc    Calculate food portions, estimated servings, and split recommendations
// @route   POST /api/food-quantity/calculate
// @access  Public / Private
const calculateQuantity = async (req, res, next) => {
  try {
    const { quantity, quantityUnit, foodCategory, potentialBeneficiaries } = req.body;

    if (!quantity || !quantityUnit || !foodCategory) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity, quantityUnit, and foodCategory.'
      });
    }

    const result = calculateFoodQuantity({
      quantity,
      quantityUnit,
      foodCategory,
      potentialBeneficiaries
    });

    res.status(200).json({
      success: true,
      data: result,
      servingConfig: SERVING_SIZE_CONFIG
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateQuantity
};
