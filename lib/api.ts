import { Capacitor } from '@capacitor/core';

const isMobile = typeof window !== 'undefined' && Capacitor.isNativePlatform();

function getApiBaseUrl(): string {
  // Always favor the environment variables if they exist
  if (isMobile) {
    return process.env.NEXT_PUBLIC_MOBILE_API_URL || 'http://192.168.0.1:8001/api';
  }
  
  // For desktop/web, check if we have a specific desktop IP defined
  const desktopUrl = process.env.NEXT_PUBLIC_DESKTOP_API_URL;
  if (desktopUrl) {
    return desktopUrl;
  }

  // Fallback to dynamic resolution if no specific override is found
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8001/api`;
  }
  return 'http://localhost:8001/api';
}

function getWsBaseUrl(): string {
  if (isMobile) {
    return process.env.NEXT_PUBLIC_MOBILE_WS_URL || 'ws://192.168.0.1:8001/ws';
  }
  
  const desktopWsUrl = process.env.NEXT_PUBLIC_DESKTOP_WS_URL;
  if (desktopWsUrl) {
    return desktopWsUrl;
  }

  if (typeof window !== 'undefined') {
    return `ws://${window.location.hostname}:8001/ws`;
  }
  return 'ws://localhost:8001/ws';
}

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();

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
