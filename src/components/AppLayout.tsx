
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Users, Settings, ShoppingCart, Package, Calculator, UserCheck } from 'lucide-react';

type Screen = 'home' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentScreen, onNavigate }) => {
  const navigationItems = [
    { id: 'sales' as Screen, label: 'Ventas', icon: ShoppingCart },
    { id: 'home' as Screen, label: 'Home', icon: Home },
    { id: 'patients' as Screen, label: 'Pacientes', icon: Users },
    { id: 'services' as Screen, label: 'Servicios', icon: Settings },
    { id: 'inventory' as Screen, label: 'Inventario', icon: Package },
    { id: 'finances' as Screen, label: 'Finanzas', icon: Calculator },
    { id: 'doctors' as Screen, label: 'Doctores', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sidebar for desktop (md and above) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-sakura-gray-medium">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-sakura-gray-medium">
            <h1 className="text-xl font-bold text-sakura-red">Sakura Dental</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    isActive 
                      ? "bg-sakura-red text-white hover:bg-sakura-red-dark" 
                      : "text-sakura-gray hover:bg-sakura-gray-light hover:text-sakura-red"
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom navigation for mobile (below md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sakura-gray-medium">
        <nav className="flex overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-1 min-w-0 flex flex-col items-center justify-center h-16 space-y-1 ${
                  isActive 
                    ? "text-sakura-red bg-sakura-red/10" 
                    : "text-sakura-gray hover:text-sakura-red hover:bg-sakura-red/5"
                }`}
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
