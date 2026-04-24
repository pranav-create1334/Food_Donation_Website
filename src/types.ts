import { LucideIcon } from 'lucide-react';

export enum DonationStatus {
  POSTED = 'Posted',
  ACCEPTED = 'Accepted',
  COLLECTED = 'Collected',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired'
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string; // Renamed from title to foodName
  description: string;
  quantity: string;
  category: string;
  location: Location;
  expiryTime: string;
  imageUrl: string;
  status: DonationStatus;
  createdAt: string;
  volunteerId?: string;
  volunteerName?: string;
  recipientOrg?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  type: 'Donor' | 'NGO' | 'Volunteer';
  email: string;
  location?: string;
}

export interface StatCard {
  label: string;
  value: string;
  description: string; // Renamed from subtext
  icon: LucideIcon; // Component instead of string icon name
  color: string;
  trend?: string;
}
