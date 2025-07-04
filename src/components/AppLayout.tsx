
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Users, 
  Settings, 
  ShoppingCart, 
  Package, 
  Calculator, 
  UserCheck,
  Search,
  Bell,
  User
} from 'lucide-react';

type Screen = 'home' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

interface NavigationItem {
  id: Screen;
  icon: React.ComponentType<any>;
  label: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentScreen, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems: NavigationItem[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'sales', icon: ShoppingCart, label: 'POS' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'services', icon: Settings, label: 'Servicios' },
    { id: 'doctors', icon: UserCheck, label: 'Doctores' },
    { id: 'finances', icon: Calculator, label: 'Finanzas' },
    { id: 'inventory', icon: Package, label: 'Inventario' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Desktop only */}
      <div className="hidden md:flex md:w-20 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF6E63' }}>
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </div>
          
          {/* Navigation Icons */}
          <nav className="flex-1 px-3 py-6 space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={`w-14 h-14 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "text-white hover:opacity-90" 
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  style={isActive ? { backgroundColor: '#FF6E63' } : {}}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-20">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200">
          {/* Left side - Greeting */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-slate-800">
              Hola Mohammad 👋
            </h1>
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
                style={{ '--tw-ring-color': '#FF6E63' } as any}
              />
            </div>
            
            {/* Notification */}
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* User Avatar */}
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6E63' }}>
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <nav className="flex">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-1 min-w-0 flex flex-col items-center justify-center h-16 space-y-1 ${
                  isActive 
                    ? "bg-red-50" 
                    : "hover:bg-slate-50"
                }`}
                style={isActive ? { color: '#FF6E63' } : { color: '#64748b' }}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
