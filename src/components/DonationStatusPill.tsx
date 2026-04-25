import type { DonationStatus } from '../types';

const STATUS_LABELS: Record<DonationStatus, string> = {
  REQUESTED: 'Requested',
  ON_THE_WAY: 'On The Way',
  RECEIVED: 'Received',
};

export default function DonationStatusPill({ status }: { status: DonationStatus }) {
  return <span className={`status-pill status-${status.toLowerCase()}`}>{STATUS_LABELS[status]}</span>;
}

