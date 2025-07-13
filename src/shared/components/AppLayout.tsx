
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { 
  Search,
  Bell,
  User
} from 'lucide-react';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { API_ENDPOINTS } from '@/config/api';
import { useAuthStore } from '@/shared/stores/authStore';

type Screen = 'home' | 'agenda' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors' | 'quotes' | 'payments' | 'patient-account';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  title?: string;
}

interface NavigationItem {
  id: Screen;
  icon: React.ComponentType<unknown>;
  label: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentScreen, onNavigate, title }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Get user info from auth store if available
    const user = useAuthStore.getState().user;
    if (user && user.username) {
      setUsername(user.username);
    } else {
      // Fallback: try to get from token/cookie if auth store is empty
      // For now, set a default or handle this case
      setUsername('Usuario');
    }
  }, []);

  async function handleLogout() {
    try {
      // Call backend logout endpoint to clear cookie/session
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      // Always clear frontend state and redirect, regardless of backend response
      logout();
      
      // Force clear any remaining storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Use window.location for a hard redirect to ensure clean state
      window.location.href = '/login';
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* New Sidebar */}
      <Sidebar currentScreen={currentScreen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-60">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200 shadow-simple-shadow">
          {/* Left side - Page Title and Welcome */}
          <div className="flex items-center space-x-6">
            <span className="text-slate-600">Bienvenido, <b>{username}</b></span>
          </div>
          {/* Right side - Search and icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="pl-10 w-64 bg-slate-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-offset-2"
                style={{ '--tw-ring-color': '#FF6E63' } as React.CSSProperties}
              />
            </div>
            {/* Notification */}
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
            </Button>
            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                  <Avatar>
                    <AvatarFallback>
                      {username
                        ? username[0].toUpperCase()
                        : <User className="h-4 w-4 text-white" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
