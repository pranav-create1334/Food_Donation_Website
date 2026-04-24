import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Clock, 
  Info, 
  ChevronRight,
  Package,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { DonationStatus } from '../types';
import { cn } from '../lib/utils';

const FOOD_CATEGORIES = ['Cooked Meals', 'Fresh Produce', 'Packaged Goods', 'Dairy & Eggs', 'Bakery', 'Mantry Staples'];

export default function PostDonation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    quantity: '',
    description: '',
    address: '',
    expiryHours: '4',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const donation = {
        foodName: formData.foodName,
        quantity: formData.quantity,
        description: formData.description,
        location: {
          address: formData.address,
          lat: 40.7128,
          lng: -74.0060,
        },
        expiryTime: new Date(Date.now() + parseInt(formData.expiryHours) * 60 * 60 * 1000).toISOString(),
        donorId: 'user_123',
        donorName: 'Main Community Center',
        imageUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800`,
        status: DonationStatus.POSTED
      };

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation)
      });

      if (res.ok) {
        navigate('/discovery');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Post Surplus</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Share Your <span className="text-primary italic">Resources</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Whether it's restaurant leftovers or groceries you won't use - sharing is simple and secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Upload Area */}
        <section>
          <div className="h-48 w-full rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center gap-4 hover:border-emerald-200 transition-all cursor-pointer group overflow-hidden relative">
            <Camera className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
            <div className="text-center">
              <p className="font-bold text-slate-700">Attach Food Photo</p>
              <p className="text-xs text-slate-400">Clear photos help volunteers identify items</p>
            </div>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          </div>
        </section>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Food Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. 10 Trays of Mixed Pasta"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-hidden font-medium text-slate-800"
              value={formData.foodName}
              onChange={(e) => setFormData({...formData, foodName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Quantity</label>
            <input 
              required
              type="text"
              placeholder="e.g. Serves 20 people"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-hidden font-medium text-slate-800"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            />
          </div>
        </div>

        {/* Description & Category */}
        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Category</label>
             <div className="flex flex-wrap gap-2">
              {FOOD_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat})}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold border transition-all",
                    formData.category === cat 
                      ? "bg-primary text-white border-primary shadow-sm" 
                      : "bg-white text-slate-500 border-slate-200 hover:border-emerald-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Additional Details</label>
             <textarea 
               placeholder="Allergens, storage instructions, etc..."
               rows={4}
               className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-hidden font-medium text-slate-800"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
             />
          </div>
        </div>

        {/* Logistics */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6 shadow-inner">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Pickup Address</label>
            <input 
              required
              type="text"
              placeholder="Street address, unit, etc."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary transition-all outline-hidden font-medium text-slate-800"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Availability</label>
            <select 
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary transition-all outline-hidden font-medium appearance-none text-slate-800"
              value={formData.expiryHours}
              onChange={(e) => setFormData({...formData, expiryHours: e.target.value})}
            >
              <option value="1">Within 1 hour (Urgent)</option>
              <option value="4">Within 4 hours</option>
              <option value="12">Within 12 hours</option>
              <option value="24">Expires tomorrow</option>
              <option value="48">Within 48 hours</option>
            </select>
          </div>
        </div>

        {/* Rules/Trust */}
        <div className="flex gap-4 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-800">Quality Commitment</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              By posting, you confirm the food is safe for consumption and follows HarvestShare storage standards.
            </p>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-primary hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
             <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Confirm & Post Donation
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
