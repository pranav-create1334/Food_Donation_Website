import React from 'react';
import { motion } from 'motion/react';
import { StatCard as StatCardType } from '../types';
import { cn } from '../lib/utils';

interface StatCardProps {
  stat: StatCardType;
  key?: React.Key;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-2xl flex flex-col items-center text-center sm:items-start sm:text-left",
      stat.color || "bg-white border border-slate-100 shadow-sm"
    )}>
      <p className="text-2xl font-bold">{stat.value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
    </div>
  );
}
