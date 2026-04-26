import type {
  AuthResponse,
  CreateDonationPayload,
  Donation,
  Role,
  UpdateDonationStatusPayload,
} from '../types';

const DEFAULT_API_BASE = '/api';
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

type HttpMethod = 'GET' | 'POST' | 'PUT';

function normalizeApiBase(baseUrl?: string): string {
  const value = (baseUrl ?? DEFAULT_API_BASE).trim();
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const apiError = data as { message?: string; error?: string; details?: string[] };
  if (Array.isArray(apiError.details) && apiError.details.length > 0) {
    return apiError.details[0];
  }

  return apiError.message ?? apiError.error ?? fallback;
}

async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Unable to reach server. Please check your connection and try again.');
  }

  const responseType = response.headers.get('content-type') ?? '';
  const data = responseType.includes('application/json')
    ? await response.json().catch(() => null)
    : null;
  if (!response.ok) {
    const fallback = response.status >= 500 ? 'Server error. Please try again in a moment.' : 'Request failed';
    throw new Error(extractErrorMessage(data, fallback));
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
