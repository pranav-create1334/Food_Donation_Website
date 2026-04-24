import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, SlidersHorizontal, Grid, List as ListIcon, RefreshCw, Filter } from 'lucide-react';
import { Donation } from '../types';
import DonationCard from '../components/DonationCard';
import LiveNotification, { useNotifications } from '../components/LiveNotification';
import { cn } from '../lib/utils';

export default function RecipientDiscovery() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { notifications, addNotification } = useNotifications();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchDonations = async (isInitial = true) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      
      // Real-time check for new items (simulation of websocket behavior for demo)
      if (!isInitial && data.length > donations.length) {
        const newItems = data.length - donations.length;
        addNotification({ 
          message: `${newItems} new donation${newItems > 1 ? 's' : ''} just posted near you!`,
          type: 'info'
        });
      }
      
      setDonations(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(() => fetchDonations(false), 5000); // Polling every 5s for real-time feel
    return () => clearInterval(interval);
  }, [donations.length]);

  const filteredDonations = donations.filter(d => 
    d.foodName.toLowerCase().includes(search.toLowerCase()) ||
    d.location.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 pb-32">
      <LiveNotification notifications={notifications} />

      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live Donation Feed</span>
           </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Community <span className="text-primary italic">Surplus</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Reserved for verified NGOs and registered community volunteers.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Filter by food, area, or NGO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-hidden text-slate-800"
          />
        </div>
        
        <div className="md:col-span-4 flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-slate-600 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            Queens, NY
          </button>
          <button className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <RefreshCw className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 bg-white/50 blur-sm -z-10" />
          </div>
          <p className="text-slate-400 font-heading font-black uppercase tracking-widest text-sm animate-pulse">Syncing with food bank...</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 text-center"
        >
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-soft">
            <Search className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800 mb-2">No donations found matches "{search}"</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Try broadening your search or check back later! We're constantly updating our feed.</p>
        </motion.div>
      ) : (
        <div className={cn(
          "grid gap-8",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredDonations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Refresh */}
      <button 
        onClick={() => fetchDonations(true)}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 bg-slate-900 text-white p-4 rounded-full shadow-elevation hover:bg-primary transition-all duration-500 group z-40"
      >
        <RefreshCw className="w-6 h-6 group-active:rotate-180 transition-transform duration-500" />
      </button>
    </div>
  );
}
