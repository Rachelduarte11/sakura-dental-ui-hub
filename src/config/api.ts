// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  USERNAME: `${API_BASE_URL}/api/users/username`,
  USERS: `${API_BASE_URL}/api/users`,
  PATIENTS: `${API_BASE_URL}/api/patients`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  SERVICES: `${API_BASE_URL}/api/services`,
  DOCTORS: `${API_BASE_URL}/api/doctors`,
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  QUOTES: `${API_BASE_URL}/api/quotes`,
  SALES: `${API_BASE_URL}/api/sales`,
  FINANCES: `${API_BASE_URL}/api/finances`,
  AGENDA: `${API_BASE_URL}/api/agenda`,
} as const; 