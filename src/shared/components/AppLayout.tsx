
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { 
  Search,
  Bell,
  User
} from 'lucide-react';
import Sidebar from './Sidebar';

type Screen = 'home' | 'agenda' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors' | 'quotes' | 'quotes-create' | 'payments';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  title?: string;
}

interface NavigationItem {
  id: Screen;
  icon: React.ComponentType<any>;
  label: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentScreen, onNavigate, title }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* New Sidebar */}
      <Sidebar currentScreen={currentScreen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-60">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200 shadow-simple-shadow">
          {/* Left side - Page Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-slate-800">
              {title || 'Dashboard'}
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
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
