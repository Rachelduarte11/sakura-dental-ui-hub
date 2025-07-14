export const ROUTES = {
  WELCOME: '/welcome',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  SERVICES: '/services',
  QUOTES: '/quotes',
  QUOTES_CREATE: '/quotes/create',
  SALES: '/sales',
  INVENTORY: '/inventory',
  FINANCES: '/finances',
  PAYMENTS: '/payments',

} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey]; 