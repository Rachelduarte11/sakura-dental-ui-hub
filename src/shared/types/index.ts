export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'assistant';
}

export interface NavigationProps {
  onNavigate: (route: string) => void;
  currentScreen?: string;
}

export interface BaseComponentProps {
  onBack?: () => void;
} 