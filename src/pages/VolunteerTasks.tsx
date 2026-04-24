import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Navigation, 
  Calendar,
  AlertCircle,
  Truck,
  ArrowRight,
  Heart,
  Award
} from 'lucide-react';
import { Donation, DonationStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export default function VolunteerTasks() {
  const [tasks, setTasks] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        // Volunteers look for "POSTED" or "ACCEPTED" status tasks
        setTasks(data.filter((d: Donation) => 
          d.status === DonationStatus.POSTED || d.status === DonationStatus.ACCEPTED
        ));
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Rescue Operations</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Pick Up <span className="text-primary italic">Requests</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
           <Navigation className="text-emerald-600 w-6 h-6" />
           <div>
              <p className="text-2xl font-bold text-emerald-700">4</p>
              <p className="text-[10px] font-bold uppercase text-emerald-600 opacity-80">Nearby Tasks</p>
           </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 text-blue-700">
           <Heart className="w-6 h-6" />
           <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-[10px] font-bold uppercase opacity-80">This Week</p>
           </div>
        </div>
        <div className="bg-slate-100 p-6 rounded-2xl flex items-center gap-4 text-slate-700">
           <Award className="w-6 h-6" />
           <div>
              <p className="text-2xl font-bold">Lvl 4</p>
              <p className="text-[10px] font-bold uppercase opacity-80">Hero Status</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)
        ) : tasks.map((task) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
               <img src={task.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <StatusBadge status={task.status} />
                     <span className="text-[10px] font-bold text-slate-400">• {task.quantity}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{task.foodName}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                     <MapPin className="w-3 h-3 text-slate-300" /> {task.location.address}
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expires</p>
                  <p className="text-xs font-bold text-orange-600">{formatDistanceToNow(new Date(task.expiryTime))}</p>
               </div>
               <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-emerald">
                  Claim Task
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Protocol Banner */}
      <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900">Volunteer Protocol</h4>
               <p className="text-xs text-slate-500">Ensure food is kept at safe temperatures during transit.</p>
            </div>
         </div>
         <button className="text-sm font-bold text-primary hover:underline">View Guidelines</button>
      </div>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';
