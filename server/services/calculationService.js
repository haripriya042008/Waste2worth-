/**
 * Food Quantity Decision Calculation Service
 * Transparent portion estimations and distribution recommendations
 */

// Configurable serving sizes (in standard base units: kg or litres)
const SERVING_SIZE_CONFIG = {
  'Cooked Meals': { sizeInKg: 0.4, label: '400g per hearty meal' },
  'Bakery & Bread': { sizeInKg: 0.15, label: '150g per bakery portion' },
  'Fresh Produce (Fruits & Vegetables)': { sizeInKg: 0.25, label: '250g per fresh produce portion' },
  'Dairy & Beverages': { sizeInLitre: 0.25, sizeInKg: 0.25, label: '250ml per beverage serving' },
  'Packaged & Canned Goods': { sizeInKg: 0.3, perPacket: 1, label: '1 packet or 300g per portion' },
  'Grains & Cereals': { sizeInKg: 0.1, label: '100g raw grain (expands when cooked) per portion' },
  'Snacks & Sweets': { sizeInKg: 0.1, label: '100g per snack serving' },
  'Raw Meat/Fish': { sizeInKg: 0.25, label: '250g per protein portion' },
  'Other': { sizeInKg: 0.3, label: '300g per standard portion' }
};

const calculateFoodQuantity = ({ quantity, quantityUnit, foodCategory, potentialBeneficiaries = 0 }) => {
  const qty = parseFloat(quantity) || 0;
  const beneficiaries = parseInt(potentialBeneficiaries, 10) || 0;
  const config = SERVING_SIZE_CONFIG[foodCategory] || SERVING_SIZE_CONFIG['Other'];

  let estimatedServings = 0;
  let calculationSteps = [];

  if (qty <= 0) {
    return {
      estimatedServings: 0,
      potentialBeneficiaries: beneficiaries,
      recommendedDistribution: 0,
      splitSuggestions: [],
      warnings: ['Quantity must be greater than zero.'],
      explanation: 'No quantity specified.',
      disclaimer: 'Calculations are estimates for logistics planning and do not guarantee nutritional adequacy.'
    };
  }

  // Calculate servings based on unit
  switch (quantityUnit) {
    case 'servings':
      estimatedServings = Math.round(qty);
      calculationSteps.push(`Specified directly as ${estimatedServings} servings.`);
      break;

    case 'packets':
      // 1 packet is typically 1 individual serving unless specified
      estimatedServings = Math.round(qty);
      calculationSteps.push(`${qty} packaged items equate to roughly ${estimatedServings} individual portions.`);
      break;

    case 'litres': {
      const portionSize = config.sizeInLitre || 0.25;
      estimatedServings = Math.floor(qty / portionSize);
      calculationSteps.push(`${qty} litres ÷ ${portionSize}L (${portionSize * 1000}ml) standard serving = ~${estimatedServings} servings.`);
      break;
    }

    case 'grams': {
      const qtyInKg = qty / 1000;
      const portionSizeKg = config.sizeInKg || 0.3;
      estimatedServings = Math.floor(qtyInKg / portionSizeKg);
      calculationSteps.push(`${qty}g (${qtyInKg.toFixed(2)} kg) ÷ ${portionSizeKg * 1000}g (${config.label}) = ~${estimatedServings} servings.`);
      break;
    }

    case 'kg':
    default: {
      const portionSizeKg = config.sizeInKg || 0.4;
      estimatedServings = Math.floor(qty / portionSizeKg);
      calculationSteps.push(`${qty} kg ÷ ${portionSizeKg} kg (${config.label}) = ~${estimatedServings} servings.`);
      break;
    }
  }

  // Ensure non-negative
  estimatedServings = Math.max(0, estimatedServings);

  // Warnings & sufficiency checks
  const warnings = [];
  let sufficiencyStatus = 'adequate';

  if (beneficiaries > 0) {
    if (estimatedServings < beneficiaries) {
      const deficit = beneficiaries - estimatedServings;
      sufficiencyStatus = 'insufficient';
      warnings.push(
        `Quantity is insufficient for ${beneficiaries} requested beneficiaries. Current estimated servings (${estimatedServings}) leaves a deficit of ~${deficit} portions.`
      );
    } else {
      const surplus = estimatedServings - beneficiaries;
      sufficiencyStatus = 'sufficient';
      if (surplus > 10) {
        calculationSteps.push(`Sufficient food for all ${beneficiaries} beneficiaries with an estimated surplus of ${surplus} servings.`);
      } else {
        calculationSteps.push(`Food volume closely matches the requirement of ${beneficiaries} beneficiaries.`);
      }
    }
  }

  // Split recommendations for high quantities (> 50 servings)
  const splitSuggestions = [];
  if (estimatedServings > 50) {
    const recommendedBatchSize = 35; // optimal portion batch for medium shelter
    const numOrgs = Math.ceil(estimatedServings / recommendedBatchSize);
    const servingsPerOrg = Math.floor(estimatedServings / numOrgs);
    const remainder = estimatedServings % numOrgs;

    splitSuggestions.push({
      recommendedOrganizationsCount: numOrgs,
      batchSize: servingsPerOrg,
      recommendationText: `Large volume detected (${estimatedServings} servings). To ensure rapid pickup, hygienic distribution, and zero spoilage, we recommend splitting this donation across ${numOrgs} nearby partner shelters or community centers (~${servingsPerOrg} servings each${remainder > 0 ? ` with ${remainder} additional in first batch` : ''}).`
    });
  }

  return {
    foodCategory,
    inputQuantity: qty,
    inputUnit: quantityUnit,
    estimatedServings,
    potentialBeneficiaries: beneficiaries,
    sufficiencyStatus,
    warnings,
    splitSuggestions,
    calculationSteps,
    explanation: calculationSteps.join(' '),
    disclaimer: 'Serving calculations are standardized planning estimates. They do not substitute for food safety inspection or guarantee individual nutritional requirements.'
  };
};

module.exports = {
  calculateFoodQuantity,
  SERVING_SIZE_CONFIG
};
