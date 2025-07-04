export const ROUTES = {
  WELCOME: '/welcome',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  SERVICES: '/services',
  QUOTES: '/quotes',
  SALES: '/sales',
  INVENTORY: '/inventory',
  FINANCES: '/finances',
  PAYMENTS: '/payments',
  PATIENT_ACCOUNT: '/patient-account',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey]; 