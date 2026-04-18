export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8001/ws';

// Get token helper
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('finova_access_token');
  }
  return null;
}

// Set token helper
export function setAuthToken(access: string, refresh?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('finova_access_token', access);
    if (refresh) {
      localStorage.setItem('finova_refresh_token', refresh);
    }
  }
}

// Clear token helper
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('finova_access_token');
    localStorage.removeItem('finova_refresh_token');
  }
}

// Base Fetch Wrapper
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Optionally trigger refresh logic globally or redirect
    clearAuthToken();
    if (typeof window !== 'undefined') {
       window.location.href = '/login';
    }
  }

  return response;
}
