const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = () => {
  return localStorage.getItem('nrxtoo_token');
};

export const getPlatformToken = () => {
  return localStorage.getItem('nrxtoo_platform_token');
};

export async function apiRequest(endpoint, options = {}, isPlatform = false) {
  const token = isPlatform ? getPlatformToken() : getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}
