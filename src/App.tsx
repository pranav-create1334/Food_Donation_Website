import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Truck, 
  User, 
  Bell, 
  PlusCircle, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages (to be implemented)
const Landing = React.lazy(() => import('./pages/Landing'));
const DonorDashboard = React.lazy(() => import('./pages/DonorDashboard'));
const RecipientDiscovery = React.lazy(() => import('./pages/RecipientDiscovery'));
const DonationDetails = React.lazy(() => import('./pages/DonationDetails'));
const VolunteerTasks = React.lazy(() => import('./pages/VolunteerTasks'));
const PostDonation = React.lazy(() => import('./pages/PostDonation'));

export default function App() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Navbar */}
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md py-4 border-slate-200 shadow-sm" 
          : "bg-white py-4 border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">H</div>
            <span className="text-xl font-bold tracking-tight text-primary-dark">
              HarvestShare
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link to="/discovery" className="hover:text-primary transition-colors">Donations</Link>
            <Link to="/tasks" className="hover:text-primary transition-colors">Pickups</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Impact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-48 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-hidden"
              />
            </div>
            <Link 
              to="/post" 
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Donation</span>
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary-container border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <User className="text-primary w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 bg-surface">
        <React.Suspense fallback={
          <div className="h-[80vh] flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-primary font-heading font-bold"
            >
              Harvesting...
            </motion.div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DonorDashboard />} />
            <Route path="/discovery" element={<RecipientDiscovery />} />
            <Route path="/donation/:id" element={<DonationDetails />} />
            <Route path="/tasks" element={<VolunteerTasks />} />
            <Route path="/post" element={<PostDonation />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200 mt-12 pb-32 md:pb-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">H</div>
              <span className="text-lg font-bold text-primary-dark tracking-tight">HarvestShare</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              © 2024 HarvestShare. Every meal saved is a community served. Reducing waste, sharing hope.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">Safety Guide</a>
            <a href="#" className="hover:text-primary transition-colors">NGO Network</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 z-50 flex justify-around items-center px-4 py-3 pb-8 shadow-elevation">
        <Link to="/" className={cn("flex flex-col items-center gap-1", location.pathname === '/' ? "text-primary" : "text-slate-400")}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link to="/discovery" className={cn("flex flex-col items-center gap-1", location.pathname === '/discovery' ? "text-primary" : "text-slate-400")}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
        </Link>
        <Link to="/tasks" className={cn("flex flex-col items-center gap-1", location.pathname === '/tasks' ? "text-primary" : "text-slate-400")}>
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Tasks</span>
        </Link>
        <Link to="/dashboard" className={cn("flex flex-col items-center gap-1", location.pathname === '/dashboard' ? "text-primary" : "text-slate-400")}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
