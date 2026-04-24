import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Heart, 
  Leaf, 
  Award, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  PackageCheck,
  Users
} from 'lucide-react';
import { Donation, DonationStatus } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';

export default function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        // Filter for "my" donations (simplified for demo)
        setDonations(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Meals Provided', value: '450', description: 'Impact since joining HarvestHand', icon: Heart, color: 'bg-rose-50 text-rose-600', trend: '+15' },
    { label: 'Waste Saved', value: '128kg', description: 'Environmental impact (CO2 equivalent)', icon: Leaf, color: 'bg-primary/10 text-primary' },
    { label: 'Rescue Streak', value: '12 Days', description: 'Your consistency makes a difference!', icon: Award, color: 'bg-secondary/10 text-secondary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Impact Analytics</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Donor <span className="text-primary italic">Intelligence</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <StatCard stat={{ label: 'Meals Provided', value: '450', color: 'bg-emerald-50 text-emerald-700', description: '', icon: Heart }} />
        <StatCard stat={{ label: 'NGO Connection', value: '14', color: 'bg-blue-50 text-blue-700', description: '', icon: Users }} />
        <StatCard stat={{ label: 'Waste Saved', value: '128kg', color: 'bg-slate-100 text-slate-700', description: '', icon: Leaf }} />
        <StatCard stat={{ label: 'Rescue Score', value: '98%', color: 'bg-primary text-white ', description: '', icon: Award }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800">Your Recent Rescues</h2>
              <button className="text-xs font-bold text-emerald-600 hover:underline">Download CSV Report</button>
           </div>

           <div className="space-y-3">
             {loading ? (
               [1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)
             ) : donations.map(donation => (
               <motion.div 
                 key={donation.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-200 transition-all group"
               >
                 <div className="flex items-center gap-4">
                    <img src={donation.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm">{donation.foodName}</h3>
                       <p className="text-[10px] font-medium text-slate-400 capitalize">{format(new Date(donation.createdAt), 'MMM dd, hh:mm a')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <StatusBadge status={donation.status} />
                    <button className="text-slate-400 hover:text-emerald-600">
                       <ArrowUpRight className="w-4 h-4" />
                    </button>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Carbon Offset</h3>
              <div className="flex items-end gap-2 mb-1">
                 <span className="text-4xl font-bold text-slate-900">240</span>
                 <span className="text-slate-500 font-bold mb-1">CO2e</span>
              </div>
              <p className="text-xs text-slate-500 leading-tight">Your donations have offset the equivalent of planting 12 trees this year.</p>
              <div className="mt-6 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[65%]" />
              </div>
              <p className="text-[10px] font-bold text-emerald-600 mt-2">65% to next level achievement</p>
           </div>
        </div>
      </div>
    </div>
  );
}
