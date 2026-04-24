import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, User } from 'lucide-react';
import { Donation } from '../types';
import StatusBadge from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface DonationCardProps {
  donation: Donation;
  key?: React.Key;
}

export default function DonationCard({ donation }: DonationCardProps) {
  const isNew = Date.now() - new Date(donation.createdAt).getTime() < 300000; // 5 mins

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft group relative flex flex-col h-full"
    >
      <div className="relative h-40 overflow-hidden bg-emerald-50">
        <img 
          src={donation.imageUrl} 
          alt={donation.foodName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {isNew && (
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-800 line-clamp-1">
            {donation.foodName}
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-4 line-clamp-2">
          {donation.quantity} • {donation.location.address}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <StatusBadge status={donation.status} />
          <Link 
            to={`/donation/${donation.id}`}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
