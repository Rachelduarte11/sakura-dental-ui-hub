import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Users, 
  Settings, 
  UserCheck, 
  Package, 
  Calculator,
  CreditCard,
  Calendar
} from 'lucide-react';
import SakuraIcon from './SakuraIcon';

interface SidebarProps {
  currentScreen?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen = 'home' }) => {
  const router = useRouter();

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', route: '/home' },
    { id: 'agenda', icon: Calendar, label: 'Agenda', route: '/agenda' },
    { id: 'sales', icon: ShoppingCart, label: 'POS', route: '/sales' },
    { id: 'quotes', icon: FileText, label: 'Cotizaciones', route: '/quotes' },
    { id: 'payments', icon: DollarSign, label: 'Pagos', route: '/payments' },
    { id: 'finances', icon: Calculator, label: 'Finanzas', route: '/finances' },
    { id: 'patient-account', icon: CreditCard, label: 'Cuentas', route: '/patient-account' },
    { id: 'patients', icon: Users, label: 'Pacientes', route: '/patients' },
    { id: 'doctors', icon: UserCheck, label: 'Doctores', route: '/doctors' },
    { id: 'services', icon: Settings, label: 'Servicios', route: '/services' },
    { id: 'inventory', icon: Package, label: 'Inventario', route: '/inventory' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
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
        {navigationItems.map((item) => {
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
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">M</span>
          </div>
          <div className="text-sm">
            <p className="font-medium">Mohammad</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 