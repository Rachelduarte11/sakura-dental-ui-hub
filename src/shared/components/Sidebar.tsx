import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Users, 
  Stethoscope, 
  UserCheck, 
  Package, 
  Calculator,
  CreditCard,
  Calendar,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  List,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import SakuraIcon from './SakuraIcon';

interface SidebarProps {
  currentScreen?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen = 'home' }) => {
  const router = useRouter();
  const [expandedQuotes, setExpandedQuotes] = useState(false);
  const [expandedPayments, setExpandedPayments] = useState(currentScreen === 'payments' || currentScreen === 'payments-history');

  // Expandir cotizaciones si estamos en una vista de cotizaciones
  React.useEffect(() => {
    if (currentScreen === 'quotes' || currentScreen === 'quotes-create') {
      setExpandedQuotes(true);
    }
    if (currentScreen === 'payments' || currentScreen === 'payments-history') {
      setExpandedPayments(true);
    }
  }, [currentScreen]);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', route: '/home' },
    { id: 'agenda', icon: Calendar, label: 'Agenda', route: '/agenda' },
    { id: 'sales', icon: ShoppingCart, label: 'POS', route: '/sales' },
    { id: 'finances', icon: Calculator, label: 'Finanzas', route: '/finances' },
    { id: 'patients', icon: Users, label: 'Pacientes', route: '/patients' },
    { id: 'doctors', icon: UserCheck, label: 'Doctores', route: '/doctors' },
    { id: 'services', icon: Stethoscope, label: 'Servicios', route: '/services' },
    { id: 'inventory', icon: Package, label: 'Inventario', route: '/inventory' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleQuotesToggle = () => {
    setExpandedQuotes(!expandedQuotes);
  };

  const handleQuotesSubNavigation = (route: string) => {
    router.push(route);
  };

  const handleUserMenuAction = (action: string) => {
    switch (action) {
      case 'profile':
        // TODO: Navegar a perfil del usuario
        console.log('Ir a perfil');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        // TODO: Implementar logout
        console.log('Cerrar sesión');
        break;
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-white shadow-simple-shadow z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sakura-red rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">SAKURA DENTAL</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Elementos relacionados con pagos primero */}
        {navigationItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-sakura-red text-white shadow-simple-shadow' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Elementos de pagos */}
        {/* Submenú de Pagos */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedPayments(!expandedPayments)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all duration-200 ${
              currentScreen === 'payments' || currentScreen === 'payments-history'
                ? 'bg-sakura-red text-white shadow-simple-shadow'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5" />
              <span className="font-medium text-sm">Pagos</span>
            </div>
            {expandedPayments ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedPayments && (
            <div className="ml-6 space-y-1">
              <button
                onClick={() => handleNavigation('/payments')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                  currentScreen === 'payments'
                    ? 'bg-sakura-red/10 text-sakura-red'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Gestión de Pagos</span>
              </button>
              <button
                onClick={() => handleNavigation('/payments/history')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                  currentScreen === 'payments-history'
                    ? 'bg-sakura-red/10 text-sakura-red'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Historial de Pagos</span>
              </button>
            </div>
          )}
        </div>

        {/* Cotizaciones con subopciones */}
        <div className="space-y-1">
          <button
            onClick={handleQuotesToggle}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all duration-200 ${
              currentScreen === 'quotes' || currentScreen === 'quotes-create'
                ? 'bg-sakura-red text-white shadow-simple-shadow' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span className="font-medium text-sm">Cotizaciones</span>
            </div>
            {expandedQuotes ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedQuotes && (
            <div className="ml-6 space-y-1">
              <button
                onClick={() => handleQuotesSubNavigation('/quotes')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                  currentScreen === 'quotes'
                    ? 'bg-sakura-red/10 text-sakura-red' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Ver Cotizaciones</span>
              </button>
              <button
                onClick={() => handleQuotesSubNavigation('/quotes/create')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                  currentScreen === 'quotes-create'
                    ? 'bg-sakura-red/10 text-sakura-red' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Crear Nueva</span>
              </button>
            </div>
          )}
        </div>

        {/* Resto de elementos */}
        {navigationItems.slice(5).map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-sakura-red text-white shadow-simple-shadow' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">M</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Mohammad</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-sakura-gray-medium">
            <DropdownMenuItem 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleUserMenuAction('profile')}
            >
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleUserMenuAction('settings')}
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center space-x-2 cursor-pointer text-red-600"
              onClick={() => handleUserMenuAction('logout')}
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar; 