import Cookies from 'js-cookie';
import type { AuthResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const ACCESS_KEY = 'jb_access';
const REFRESH_KEY = 'jb_refresh';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return Cookies.get(ACCESS_KEY) || null;
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return Cookies.get(REFRESH_KEY) || null;
}

export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set(ACCESS_KEY, accessToken, { expires: 1 });
  Cookies.set(REFRESH_KEY, refreshToken, { expires: 7 });
}

export function clearTokens() {
  Cookies.remove(ACCESS_KEY);
  Cookies.remove(REFRESH_KEY);
}

export function persistAuth(data: AuthResponse) {
  setTokens(data.accessToken, data.refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem('jb_user', JSON.stringify(data.user));
  }
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('jb_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  clearTokens();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jb_user');
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearAuth();
      return null;
    }
    const data = (await res.json()) as AuthResponse;
    persistAuth(data);
    return data.accessToken;
  } catch {
    clearAuth();
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let token = options.token;
  if (options.auth !== false && token === undefined) {
    token = getAccessToken();
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });

  let res = await doFetch();

  if (res.status === 401 && options.auth !== false) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      res = await doFetch();
    }
  }

  if (!res.ok) {
    let message = 'Error en la solicitud';
    try {
      const err = await res.json();
      message = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message || message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function serverFetch<T>(
  path: string,
  searchParams?: Record<string, string | undefined>,
): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error('No se pudo cargar la información');
  }
  return res.json() as Promise<T>;
}
