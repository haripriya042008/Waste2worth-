import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Shield, Truck, Utensils, HeartHandshake } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          How Waste2Worth Works
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A systematic, safe, and transparent workflow engineered to ensure zero food waste and 100% beneficiary safety.
        </p>
      </div>

      {/* Two Columns: Donor Journey & Charity Journey */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Donor Journey */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-3 bg-brand-50 text-brand-700 rounded-2xl">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">For Food Donors</h3>
              <p className="text-xs text-slate-500">Households, Restaurants, Hotels & Caterers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Quick Registration & Verification</h5>
                <p className="text-xs text-slate-600 mt-0.5">Register with donor category (Household, Hotel, Restaurant) and set your default pickup address.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Post Surplus Details</h5>
                <p className="text-xs text-slate-600 mt-0.5">Provide food name, category, quantity, consumption deadline, special handling instructions, and upload real photos.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Receive Real-Time Match</h5>
                <p className="text-xs text-slate-600 mt-0.5">When an approved charity accepts your donation, receive instant notification with recipient contact details.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Handover & Track Impact</h5>
                <p className="text-xs text-slate-600 mt-0.5">Hand over the packaged food to the charity representative and track complete delivery in your history dashboard.</p>
              </div>
            </div>
          </div>

          <Link
            to="/register-donor"
            className="block text-center w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors"
          >
            Register as Food Donor
          </Link>
        </div>

        {/* Charity Journey */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">For Charities & NGOs</h3>
              <p className="text-xs text-slate-500">Shelters, Community Kitchens & Relief Teams</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Organization Profile & Admin Approval</h5>
                <p className="text-xs text-slate-600 mt-0.5">Submit registration with organization type, daily people served, operating hours, and address for admin review.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Explore Nearby Available Food</h5>
                <p className="text-xs text-slate-600 mt-0.5">Filter donations by proximity radius, food category, vegetarian preference, and available portion yield.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Atomic Acceptance Locking</h5>
                <p className="text-xs text-slate-600 mt-0.5">Claim the donation with atomic database locking to prevent duplicate claims, then unlock exact pickup instructions.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Collection & Completion Updates</h5>
                <p className="text-xs text-slate-600 mt-0.5">Mark donation as Collected upon pickup, then as Completed once served to beneficiaries to conclude the audit record.</p>
              </div>
            </div>
          </div>

          <Link
            to="/register-charity"
            className="block text-center w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Register Organization
          </Link>
        </div>
      </div>

      {/* Food Safety & Guidelines */}
      <div className="bg-amber-50/80 border border-amber-200/80 p-8 rounded-3xl space-y-4">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-amber-700" />
          <span>Food Safety & Handling Guidelines</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          To protect recipient beneficiaries, donors must ensure cooked food is kept below 5°C or above 60°C prior to pickup. Never donate expired, thawed raw meats, or food items that have been in open display for more than 4 hours. All collections should use food-grade insulated transport containers.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
