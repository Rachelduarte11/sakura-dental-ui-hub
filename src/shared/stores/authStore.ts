import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../utils/api-client';

export interface User {
  user_id: number;
  username: string;
  email: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  role_id: number;
  employee_id?: number;
}

export interface Role {
  role_id: number;
  name: string;
  descripcion: string;
  status: boolean;
}

export interface Permission {
  permission_id: number;
  code: string;
  descripcion: string;
  status: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(username, password) as any;
          
          // Your backend returns { success: true, token: "...", username: "...", userId: ... }
          if (response.success && response.token) {
            const user = {
              user_id: response.userId,
              username: response.username,
              email: '', // Will be populated later if needed
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              role_id: 1, // Default role
            };
            
            set({
              user: user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error de autenticación',
            isLoading: false,
          });
          throw error; // Re-throw so the component can handle it
        }
      },

      logout: () => {
        // Clear all auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Clear localStorage/sessionStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          sessionStorage.removeItem('auth-storage');
          
          // Clear cookies
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
          document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        // Initialize auth state from persisted storage
        // This is handled automatically by Zustand persist middleware
        // but we can add any additional initialization logic here
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 