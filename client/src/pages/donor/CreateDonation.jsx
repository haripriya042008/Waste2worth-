import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { donationService } from '../../services/donationService';
import { foodQuantityService } from '../../services/foodQuantityService';
import {
  PlusCircle,
  UploadCloud,
  X,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  Calculator,
  Utensils,
  Sparkles
} from 'lucide-react';

const CreateDonation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { coordinates, requestLocation, hasPermission } = useGeolocation();

  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState('Cooked Meals');
  const [foodType, setFoodType] = useState('Vegetarian');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [preparationDate, setPreparationDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pickupAddress, setPickupAddress] = useState(user?.address || '');
  const [pickupAvailability, setPickupAvailability] = useState('Today 6:00 PM - 9:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Image Upload States
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Live Serving Estimation State
  const [estimatedServings, setEstimatedServings] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const foodTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggitarian', 'Mixed/Other'];
  const units = ['kg', 'grams', 'litres', 'packets', 'servings'];

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      setError('You can upload a maximum of 5 images per donation.');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // Recalculate estimated servings on quantity or category change
  const handleQuantityOrCategoryChange = async (newQty, newUnit, newCat) => {
    if (!newQty || Number(newQty) <= 0) {
      setEstimatedServings(0);
      return;
    }
    try {
      const res = await foodQuantityService.calculate({
        quantity: Number(newQty),
        quantityUnit: newUnit,
        foodCategory: newCat
      });
      setEstimatedServings(res.data?.estimatedServings || 0);
    } catch (err) {
      // Ignore background calculation glitch
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!expiryDate) {
      setError('Please provide a safe consumption expiry date.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('foodName', foodName);
      formData.append('foodCategory', foodCategory);
      formData.append('foodType', foodType);
      formData.append('quantity', quantity);
      formData.append('quantityUnit', quantityUnit);
      formData.append('description', description);
      if (preparationDate) formData.append('preparationDate', preparationDate);
      formData.append('expiryDate', expiryDate);
      formData.append('pickupAddress', pickupAddress);
      formData.append('latitude', coordinates.lat);
      formData.append('longitude', coordinates.lng);
      formData.append('pickupAvailability', pickupAvailability);
      formData.append('specialInstructions', specialInstructions);

      // Append images to multipart form
      images.forEach((img) => {
        formData.append('images', img);
      });

      const res = await donationService.createDonation(formData);
      navigate(`/donations/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit food donation. Please review details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Surplus Redistribution
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Create Food Donation</h1>
        <p className="text-xs text-slate-500">
          Provide accurate details about your surplus food to help local charities plan immediate collection.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Section 1: Food Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-brand-600" />
            <span>1. Food Characteristics & Classification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Food Name / Description Title *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. 50 Servings Vegetable Pulav & Dal Makhani"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Type *</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
              >
                {foodTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Food Category *</label>
              <select
                value={foodCategory}
                onChange={(e) => {
                  setFoodCategory(e.target.value);
                  handleQuantityOrCategoryChange(quantity, quantityUnit, e.target.value);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  handleQuantityOrCategoryChange(e.target.value, quantityUnit, foodCategory);
                }}
                placeholder="e.g. 25"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measure *</label>
              <select
                value={quantityUnit}
                onChange={(e) => {
                  setQuantityUnit(e.target.value);
                  handleQuantityOrCategoryChange(quantity, e.target.value, foodCategory);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50 uppercase font-medium"
              >
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Portion Yield Badge */}
          {estimatedServings > 0 && (
            <div className="p-3 bg-brand-50/80 border border-brand-200/90 rounded-2xl flex items-center justify-between text-xs text-brand-900">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Automated Yield Calculation:</span>
                <strong>~{estimatedServings} individual meal servings</strong>
              </div>
              <span className="text-[11px] text-brand-700">Calculated automatically</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Food Preparation & Packaging Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Freshly cooked evening buffet surplus. Sealed in 3 stainless steel containers, hot & untouched."
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Safe Timelines & Dates */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>2. Preparation & Consumption Deadlines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Date & Time</label>
              <input
                type="datetime-local"
                value={preparationDate}
                onChange={(e) => setPreparationDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Safe Consumption Expiry Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none text-rose-700 font-medium"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Must be safe for pickup and distribution before this deadline.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Food Photos (Multer Upload) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>3. Food Photographs (Up to 5 images)</span>
          </h3>

          <div>
            <label className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700">Click to upload food photos</span>
              <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, WEBP allowed (Max 5MB per image)</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Previews grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 h-24">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Pickup Logistics & Location */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>4. Pickup Logistics & Availability</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Address *</label>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="e.g. 42 MG Road, Grand Palace Banquets Gate 2, Bengaluru"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Availability Window *</label>
              <input
                type="text"
                required
                value={pickupAvailability}
                onChange={(e) => setPickupAvailability(e.target.value)}
                placeholder="e.g. Today 8:00 PM - 10:30 PM"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Handling / Storage Instructions</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Keep upright, bring insulated containers"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Coordinates Readout */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">GPS Coordinates:</span>
              <span className="text-slate-500 text-[11px]">
                {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
              </span>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-1"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{hasPermission ? 'GPS Location Locked' : 'Update GPS'}</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/donor/my-donations')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            {loading ? <span>Publishing Donation...</span> : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Food Donation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonation;
