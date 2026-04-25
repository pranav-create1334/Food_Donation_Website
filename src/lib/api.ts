import type {
  AuthResponse,
  CreateDonationPayload,
  Donation,
  Role,
  UpdateDonationStatusPayload,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT';

async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    let message = data?.message ?? data?.error ?? 'Request failed';
    
    // If there are validation error details, use the first one for a more specific message
    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      message = data.details[0];
    }
    
    throw new Error(message);
  }

  return data as T;
}

export function signin(username: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/signin', 'POST', { username, password });
}

export function signup(username: string, password: string, role: Role): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/signup', 'POST', { username, password, role });
}

export function getDonations(token: string): Promise<Donation[]> {
  return apiRequest<Donation[]>('/donations', 'GET', undefined, token);
}

export function createDonation(payload: CreateDonationPayload, token: string): Promise<Donation> {
  return apiRequest<Donation>('/donations', 'POST', payload, token);
}

export function updateDonationStatus(
  donationId: number,
  payload: UpdateDonationStatusPayload,
  token: string,
): Promise<Donation> {
  return apiRequest<Donation>(`/donations/${donationId}/status`, 'PUT', payload, token);
}

