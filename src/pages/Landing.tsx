import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Leaf, 
  Users, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  Star,
  HeartHandshake,
  Truck
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { cn } from '../lib/utils';

const FEATURES = [
  {
    icon: Leaf,
    title: "Zero Waste",
    description: "Every gram of surplus food redirected is a step towards a sustainable planet.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: ShieldCheck,
    title: "Safe & Verified",
    description: "Our community of volunteers and NGOs ensures every donation meets quality standards.",
    color: "bg-sky-100 text-sky-600"
  },
  {
    icon: TrendingUp,
    title: "Trackable Impact",
    description: "See the real-time difference your contributions are making in people's lives.",
    color: "bg-secondary/10 text-secondary"
  }
];

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-8 pt-12 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Live: 24 active donations nearby</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[0.95] tracking-tight mb-8">
              Ending Waste, <br/><span className="text-primary">Sharing Surplus.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
              HarvestShare connects fresh surplus food to those who need it most. Join the fastest growing food rescue network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/post" 
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-primary hover:bg-primary-dark transition-all duration-300"
              >
                New Donation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/discovery" 
                className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all duration-300"
              >
                Browse Feed
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-elevation border-8 border-white max-w-md mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1488459711635-0c00488aeaf3?auto=format&fit=crop&q=80&w=800" 
                alt="Donation Box"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 md:-left-12 z-20 bg-white p-4 rounded-2xl shadow-elevation border border-slate-100 flex items-center gap-4 max-w-xs"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                 <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order #8821</p>
                <p className="text-sm font-bold text-slate-900">Meals in Transit to NGO</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Community Impact</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <StatCard stat={{
                label: 'Meals Saved',
                value: '1,240',
                description: '',
                icon: Leaf,
                color: 'bg-emerald-50 text-emerald-700',
              }} />
              <StatCard stat={{
                label: 'Active NGOs',
                value: '42',
                description: '',
                icon: Users,
                color: 'bg-blue-50 text-blue-700',
              }} />
              <StatCard stat={{
                label: 'Rescue Areas',
                value: '12 Districts',
                description: '',
                icon: MapPin,
                color: 'bg-slate-100 text-slate-700',
              }} />
            </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm col-span-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Zero Waste Distribution</h3>
            <p className="text-slate-500 leading-relaxed max-w-md">Our algorithm optimizes routes for volunteers to ensure food reaches NGOs while it's still fresh, reducing waste by 95% across our network.</p>
          </div>
          <div className="bg-emerald-600 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Safe & Verified</h3>
                <p className="text-emerald-50 text-sm leading-relaxed">Every NGO and donor is verified to ensure the highest safety standards for all beneficiaries.</p>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10">
                <ShieldCheck className="w-48 h-48" />
             </div>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Trackable Impact</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Donors receive real-time updates and an annual impact report detailing their contribution to community health.</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl text-white col-span-2 relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div>
                  <h3 className="text-2xl font-bold mb-2">Become a Partner NGO</h3>
                  <p className="text-slate-400 max-w-sm">Join over 40+ NGOs already benefiting from our surplus food network and scale your impact.</p>
               </div>
               <Link to="/discovery" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all text-center">
                  Apply Today
               </Link>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="w-32 h-32" />
             </div>
          </div>
        </div>
      </section>

      {/* Trust Element */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="bg-slate-50 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-slate-200 shadow-inner">
           <div className="max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex justify-center gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-emerald-500 fill-emerald-500" />)}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">Join the movement to end local hunger and food waste.</h2>
              <p className="text-slate-500 mb-10 text-lg">Whether you're a business with surplus or a citizen with a car, you can make a difference today.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/post" 
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-primary"
                >
                  Start Donating
                </Link>
                 <Link 
                  to="/tasks" 
                  className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                >
                  Volunteer Now
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
