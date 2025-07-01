
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Settings, 
  ShoppingCart, 
  Package, 
  Calculator, 
  UserCheck,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

type Screen = 'home' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

interface NavigationGroup {
  id: string;
  label: string;
  items: {
    id: Screen;
    label: string;
    icon: React.ComponentType<any>;
  }[];
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentScreen, onNavigate }) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['inicio', 'operaciones', 'administracion']);

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      items: [
        { id: 'home' as Screen, label: 'Home', icon: Home },
      ]
    },
    {
      id: 'operaciones',
      label: 'Operaciones',
      items: [
        { id: 'sales' as Screen, label: 'Flujo POS (Registrar Venta)', icon: ShoppingCart },
        { id: 'services' as Screen, label: 'Servicios', icon: Settings },
        { id: 'patients' as Screen, label: 'Pacientes', icon: Users },
      ]
    },
    {
      id: 'equipo',
      label: 'Equipo Médico',
      items: [
        { id: 'doctors' as Screen, label: 'Doctores', icon: UserCheck },
      ]
    },
    {
      id: 'administracion',
      label: 'Administración',
      items: [
        { id: 'finances' as Screen, label: 'Finanzas', icon: Calculator },
        { id: 'inventory' as Screen, label: 'Inventario', icon: Package },
      ]
    }
  ];

  // Flat list for mobile navigation
  const mobileNavigationItems = [
    { id: 'home' as Screen, label: 'Home', icon: Home },
    { id: 'sales' as Screen, label: 'POS', icon: ShoppingCart },
    { id: 'patients' as Screen, label: 'Pacientes', icon: Users },
    { id: 'services' as Screen, label: 'Servicios', icon: Settings },
    { id: 'doctors' as Screen, label: 'Doctores', icon: UserCheck },
    { id: 'finances' as Screen, label: 'Finanzas', icon: Calculator },
    { id: 'inventory' as Screen, label: 'Inventario', icon: Package },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sidebar for desktop (md and above) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-sakura-gray-medium">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-sakura-gray-medium">
            <h1 className="text-xl font-bold text-sakura-red">Sakura Dental</h1>
          </div>
          
          {/* Hierarchical Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                {/* Group Header */}
                <Button
                  variant="ghost"
                  className="w-full justify-between h-10 px-3 text-sm font-medium text-sakura-gray hover:bg-sakura-gray-light hover:text-sakura-red"
                  onClick={() => toggleGroup(group.id)}
                >
                  <span>{group.label}</span>
                  {isGroupExpanded(group.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Group Items */}
                {isGroupExpanded(group.id) && (
                  <div className="ml-4 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentScreen === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start h-10 text-sm ${
                            isActive 
                              ? "bg-sakura-red text-white hover:bg-sakura-red-dark" 
                              : "text-sakura-gray hover:bg-sakura-gray-light hover:text-sakura-red"
                          }`}
                          onClick={() => onNavigate(item.id)}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
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
          {mobileNavigationItems.map((item) => {
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
                <Icon className="h-4 w-4" />
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
