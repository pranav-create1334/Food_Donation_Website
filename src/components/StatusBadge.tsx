import { cn } from '../lib/utils';
import { DonationStatus } from '../types';

interface StatusBadgeProps {
  status: DonationStatus;
  className?: string;
}

const statusStyles: Record<DonationStatus, { bg: string; text: string; label: string }> = {
  [DonationStatus.POSTED]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    label: 'Posted'
  },
  [DonationStatus.ACCEPTED]: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    label: 'Accepted'
  },
  [DonationStatus.COLLECTED]: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    label: 'Picked Up'
  },
  [DonationStatus.DELIVERED]: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    label: 'Delivered'
  },
  [DonationStatus.COMPLETED]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'Completed'
  },
  [DonationStatus.EXPIRED]: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    label: 'Expired'
  }
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span className={cn(
      "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-tight inline-flex items-center gap-1.5",
      style.bg,
      style.text,
      className
    )}>
      {style.label}
    </span>
  );
}
