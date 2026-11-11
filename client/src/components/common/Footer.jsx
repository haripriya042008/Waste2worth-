import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Waste<span className="text-brand-400">2</span>Worth
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging the gap between food abundance and hunger. Connecting surplus food providers with verified shelters, charities, and distribution centers with real-time GPS tracking.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>UN Sustainable Development Goals 2 & 12</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Mission</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Key Features</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register-donor" className="hover:text-white transition-colors">Become a Food Donor</Link>
              </li>
              <li>
                <Link to="/register-charity" className="hover:text-white transition-colors">Register NGO / Charity</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Account Login</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Volunteer Opportunities</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Contact Center</h4>
            <div className="flex items-start space-x-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
              <span>Vidhana Soudha Civic Corridor, Bengaluru, KA 560001</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>+91 (080) 2200-FOOD (3663)</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>support@waste2worth.org</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Waste2Worth Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with MERN Stack • Food Sustainability First</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
