export type Role = 'DONOR' | 'VOLUNTEER' | 'ADMIN';

export type DonationStatus = 'REQUESTED' | 'ON_THE_WAY' | 'RECEIVED';

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Donation {
  id: number;
  donorId: number;
  donorUsername: string;
  assignedVolunteerId: number | null;
  assignedVolunteerUsername: string | null;
  pickupAddress: string;
  foodDescription: string | null;
  imageUrl: string | null;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationPayload {
  pickupAddress: string;
  foodDescription: string;
  imageUrl: string;
  passcode: string;
}

export interface UpdateDonationStatusPayload {
  status: DonationStatus;
  passcode?: string;
}

