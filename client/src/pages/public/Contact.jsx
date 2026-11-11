import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have questions about onboarding, partnerships, or technical integration? Reach out to our 24/7 coordination team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 md:col-span-1">
          <h3 className="text-xl font-bold">Get In Touch</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our civic liaisons and volunteer dispatchers are stationed across central hubs.
          </p>

          <div className="space-y-4 pt-4 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
              <span>Vidhana Soudha Central Corridor, Bengaluru, KA 560001</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>+91 (080) 2200-FOOD (3663)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>operations@waste2worth.org</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-800">Message Delivered!</h4>
              <p className="text-xs text-slate-500">Thank you for contacting us. A coordinator will reply shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="e.g. Ramesh Rao"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="e.g. Inquiry regarding bulk donor partnership"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="How can our community help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
