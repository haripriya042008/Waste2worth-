import React, { useState, useEffect } from 'react';
import { foodQuantityService } from '../../services/foodQuantityService';
import { Calculator, Users, Info, AlertTriangle, CheckCircle, Split, Sparkles } from 'lucide-react';

const FoodQuantityCalculator = ({ initialQuantity = '', initialUnit = 'kg', initialCategory = 'Cooked Meals', onCalculationComplete }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 10);
  const [quantityUnit, setQuantityUnit] = useState(initialUnit || 'kg');
  const [foodCategory, setFoodCategory] = useState(initialCategory || 'Cooked Meals');
  const [beneficiaries, setBeneficiaries] = useState(25);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce (Fruits & Vegetables)',
    'Dairy & Beverages',
    'Packaged & Canned Goods',
    'Grains & Cereals',
    'Snacks & Sweets',
    'Raw Meat/Fish',
    'Other'
  ];

  const units = ['kg', 'grams', 'litres', 'packets', 'servings'];

  const runCalculation = async () => {
    if (!quantity || Number(quantity) <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await foodQuantityService.calculate({
        quantity: Number(quantity),
        quantityUnit,
        foodCategory,
        potentialBeneficiaries: beneficiaries ? Number(beneficiaries) : 0
      });
      setResult(response.data);
      if (onCalculationComplete) {
        onCalculationComplete(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [quantity, quantityUnit, foodCategory, beneficiaries]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
        <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">Food Quantity & Beneficiary Decision Module</h3>
          <p className="text-xs text-slate-500">Calculate portion yield, verify beneficiary sufficiency, and get smart splitting suggestions.</p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Food Category</label>
          <select
            value={foodCategory}
            onChange={(e) => setFoodCategory(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
          <input
            type="number"
            min="0.1"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 25"
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measure</label>
          <select
            value={quantityUnit}
            onChange={(e) => setQuantityUnit(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50 uppercase font-medium"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Beneficiaries (People)</label>
          <input
            type="number"
            min="0"
            value={beneficiaries}
            onChange={(e) => setBeneficiaries(e.target.value)}
            placeholder="e.g. 50"
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Result Metrics */}
      {result && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-50/70 border border-brand-200 p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-brand-800 uppercase tracking-wider block">Estimated Servings</span>
              <span className="text-3xl font-extrabold text-brand-900 mt-1 block">~{result.estimatedServings}</span>
              <span className="text-[11px] text-brand-700">Standard individual portions</span>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">Target Beneficiaries</span>
              <span className="text-3xl font-extrabold text-blue-900 mt-1 block">{result.potentialBeneficiaries || 'Not set'}</span>
              <span className="text-[11px] text-blue-700">Requested headcount</span>
            </div>

            <div className={`p-4 rounded-xl text-center border ${
              result.sufficiencyStatus === 'insufficient'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider block">Sufficiency Status</span>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {result.sufficiencyStatus === 'insufficient' ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span className="text-lg font-bold text-rose-700">Deficit Warning</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg font-bold text-emerald-700">Sufficient Food</span>
                  </>
                )}
              </div>
              <span className="text-[11px] block mt-0.5">
                {result.estimatedServings >= (result.potentialBeneficiaries || 0)
                  ? `Can feed all requested individuals`
                  : `Needs ~${(result.potentialBeneficiaries || 0) - result.estimatedServings} more servings`}
              </span>
            </div>
          </div>

          {/* Warnings alert if insufficient */}
          {result.warnings?.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-rose-800 space-y-1">
                {result.warnings.map((w, idx) => (
                  <p key={idx} className="font-medium">{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* Step by step calculation explanation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <Info className="w-3.5 h-3.5 text-brand-600" />
              <span>Transparent Calculation Breakdown:</span>
            </div>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
              {result.calculationSteps?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Split Suggestions for large donations */}
          {result.splitSuggestions?.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800">
                <Split className="w-4 h-4 text-amber-700" />
                <span>Multi-Center Distribution Split Recommendation:</span>
              </div>
              {result.splitSuggestions.map((s, idx) => (
                <p key={idx} className="text-xs text-amber-900 leading-relaxed">
                  {s.recommendationText}
                </p>
              ))}
            </div>
          )}

          {/* Regulatory Disclaimer */}
          <p className="text-[11px] text-slate-400 italic">
            * {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodQuantityCalculator;
