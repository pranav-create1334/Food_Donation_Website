import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Donation, DonationStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const STATUS_STEPS = [
  { status: DonationStatus.POSTED, label: 'Posted', icon: Package },
  { status: DonationStatus.ACCEPTED, label: 'Accepted', icon: CheckCircle2 },
  { status: DonationStatus.COLLECTED, label: 'Picked Up', icon: Truck },
  { status: DonationStatus.DELIVERED, label: 'Delivered', icon: ShieldCheck },
  { status: DonationStatus.COMPLETED, label: 'Completed', icon: HeartHandshake }
];

import { HeartHandshake } from 'lucide-react';

export default function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDonation = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      const found = data.find((d: Donation) => d.id === id);
      setDonation(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
    const interval = setInterval(fetchDonation, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const updateStatus = async (newStatus: DonationStatus) => {
    if (!donation) return;
    setActionLoading(true);
    try {
      await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchDonation();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
       <RefreshCw className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (!donation) return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
      <h1 className="text-3xl font-heading font-black text-slate-900 mb-4">Donation Not Found</h1>
      <Link to="/discovery" className="text-primary font-bold">Back to Discovery Feed</Link>
    </div>
  );

  const currentStep = STATUS_STEPS.findIndex(s => s.status === donation.status);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image and Core Details */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-elevation">
              <div className="rounded-xl overflow-hidden aspect-video relative">
                <img 
                  src={donation.imageUrl} 
                  alt={donation.foodName}
                  className="w-full h-full object-cover"
                />
              </div>
           </div>

           <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h1 className="text-3xl font-bold text-slate-900 mb-2">{donation.foodName}</h1>
                   <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {donation.quantity}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {donation.location.address}</span>
                   </div>
                </div>
                <StatusBadge status={donation.status} className="scale-125 origin-right" />
             </div>

             <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>{donation.description || 'No detailed instructions provided for this rescue box.'}</p>
             </div>

             <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <User className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Provider</p>
                      <p className="text-sm font-bold text-slate-800">{donation.donorName}</p>
                   </div>
                </div>
                <button className="text-sm font-bold text-emerald-600 hover:underline">Contact Donor</button>
             </div>
           </div>
        </div>

        {/* Right: Tracking and Actions */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-bold mb-6 relative z-10">Rescue Journey</h3>
              <div className="space-y-6 relative z-10">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        isDone ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
                      )}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-bold",
                          isDone ? "text-white" : "text-slate-500"
                        )}>
                          {step.label}
                        </p>
                      </div>
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse outline-4 outline-emerald-500/20" />}
                    </div>
                  );
                })}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Actions</h4>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => updateStatus(DonationStatus.ACCEPTED)}
                  disabled={actionLoading || donation.status !== DonationStatus.POSTED}
                  className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 disabled:opacity-50 transition-all text-sm"
                >
                  Confirm Reception (NGO)
                </button>
                <button 
                  onClick={() => updateStatus(DonationStatus.COLLECTED)}
                  disabled={actionLoading || donation.status !== DonationStatus.ACCEPTED}
                  className="w-full bg-orange-50 text-orange-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-100 disabled:opacity-50 transition-all text-sm"
                >
                  Mark as Picked Up
                </button>
                <button 
                  onClick={() => updateStatus(DonationStatus.COMPLETED)}
                  disabled={actionLoading || (donation.status !== DonationStatus.DELIVERED && donation.status !== DonationStatus.COLLECTED)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all text-sm shadow-emerald"
                >
                  Finalize Delivery
                </button>
              </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
              <AlertCircle className="text-blue-500 w-6 h-6 shrink-0" />
              <p className="text-xs text-blue-800 leading-tight">
                This donation expires in <b>{formatDistanceToNow(new Date(donation.expiryTime))}</b>. Please expedite pickup if possible.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

import { RefreshCw, SlidersHorizontal } from 'lucide-react';
