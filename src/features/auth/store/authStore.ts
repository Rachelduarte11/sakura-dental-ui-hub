import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../../../shared/utils/api-client';

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
          const response = await authApi.login(username, password);
          const data = response.data as any;
          console.log('✅ Login exitoso:', data);
          if (data.success && data.token && data.username) {
            // Guardar token en cookie para el middleware
            document.cookie = `auth-token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
            
            set({
              user: {
                user_id: data.userId,
                username: data.username,
                email: '', // Puedes pedirlo al backend si lo necesitas
                is_active: true, // O el valor real si lo tienes
                last_login: '',
                created_at: '',
                updated_at: '',
                role_id: 0,
                employee_id: undefined,
              },
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log('✅ Estado de autenticación actualizado');
            console.log('🔍 AuthStore - Estado después del set:', get());
          } else {
            set({
              error: data.message || 'Error de autenticación',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error de autenticación',
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Eliminar cookie al hacer logout
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
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
        // Verificar si existe token en cookies
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
        
        if (authCookie) {
          const token = authCookie.split('=')[1];
          console.log('🔍 Token encontrado en cookies:', token);
          set({ token, isAuthenticated: true });
        }
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