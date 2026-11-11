import React from 'react';
import FoodQuantityCalculator from '../../components/forms/FoodQuantityCalculator';

const DonorCalculatorPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Module 1: Decision Support
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Food Portion & Yield Calculator</h1>
        <p className="text-xs text-slate-500">
          Determine accurate individual portion yields and multi-center splitting suggestions based on transparent nutritional guidelines.
        </p>
      </div>

      <FoodQuantityCalculator />
    </div>
  );
};

export default DonorCalculatorPage;
