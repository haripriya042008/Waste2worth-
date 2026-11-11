import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import FoodQuantityCalculator from '../../components/forms/FoodQuantityCalculator';
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Utensils,
  Truck,
  CheckCircle2,
  Leaf,
  BarChart2
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalMeals: 12500,
    totalKg: 4800,
    activeCharities: 24,
    activeDonors: 78
  });

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-16 pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-brand-600" />
              <span>Smart Food Redistribution Platform • Zero Waste Vision</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Turn Surplus Food Into <span className="text-brand-600">Hope & Worth</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Waste2Worth seamlessly connects households, restaurants, caterers, and supermarkets with verified local charities, orphanages, and community kitchens in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={isAuthenticated && user?.role === 'donor' ? '/donor/create-donation' : '/register-donor'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Donate Excess Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated && user?.role === 'charity' ? '/charity/available-donations' : '/register-charity'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Register Charity / Find Food</span>
              </Link>
            </div>

            {/* Micro badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center"><ShieldCheck className="w-4 h-4 text-brand-600 mr-1.5" /> 100% Admin-Verified Charities</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 text-brand-600 mr-1.5" /> GPS Proximity Matching</span>
              <span className="flex items-center"><Clock className="w-4 h-4 text-brand-600 mr-1.5" /> Real-Time Socket Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Live Impact Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          <div className="text-center pt-4 sm:pt-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-400 block">4,850+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Kilograms Food Saved</span>
          </div>
          <div className="text-center pt-4 sm:pt-0 sm:pl-8">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 block">12,100+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Nutritious Meals Served</span>
          </div>
          <div className="text-center pt-4 sm:pt-0 sm:pl-8">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 block">45+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Verified Shelters & NGOs</span>
          </div>
          <div className="text-center pt-4 sm:pt-0 sm:pl-8">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 block">120+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Registered Food Donors</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Simple & Transparent</span>
          <h2 className="text-3xl font-bold text-slate-900">How Waste2Worth Connects Communities</h2>
          <p className="text-sm text-slate-600">From surplus preparation to beneficiary plate in four seamless steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">1</div>
            <h4 className="text-base font-semibold text-slate-900">Donor Posts Surplus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Household, restaurant, or hotel lists food details, uploads photos, specifies pickup window and quantity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">2</div>
            <h4 className="text-base font-semibold text-slate-900">GPS Proximity Alert</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby verified charities receive real-time notifications with distance, photos, and portion calculations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">3</div>
            <h4 className="text-base font-semibold text-slate-900">Instant Acceptance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Charity claims donation atomically. Donor receives confirmation and collection logistics coordination.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">4</div>
            <h4 className="text-base font-semibold text-slate-900">Pickup & Distribution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Food is collected, verified, and served to beneficiaries. Status timeline and impact metrics update in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Food Quantity Decision Module Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Smart Technology</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Food Quantity & Beneficiary Decision Module
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mt-1">
              Test out our intelligent portion planning engine below. Calculate estimated servings, verify sufficiency, and receive splitting recommendations for large banquet surplus.
            </p>
          </div>
          <Link
            to="/features"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center"
          >
            Learn about all modules <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <FoodQuantityCalculator />
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to make every surplus meal count?
            </h3>
            <p className="text-sm text-brand-100 leading-relaxed">
              Join hundreds of conscious citizens, food businesses, and compassionate charity leaders transforming food waste into nourishment today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/register-donor"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-brand-50 font-semibold text-xs text-center shadow-lg transition-all"
            >
              Sign Up as Donor
            </Link>
            <Link
              to="/register-charity"
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs text-center shadow-lg transition-all"
            >
              Register as Charity
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
