
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Settings, Users, Package, Calculator, UserCheck } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToPatients: () => void;
  onNavigateToServices: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToPatients, onNavigateToServices }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for payments and quotes
  const recentPayments = [
    { id: 1, name: "Maria Antonieta Lugo", amount: 850.00, currency: "Soles", type: "payment" },
    { id: 2, name: "Carlos Mariano Justo", amount: 850.00, currency: "Soles", type: "payment", hasDebt: true },
    { id: 3, name: "Maria Antonieta Lugo", amount: 850.00, currency: "Soles", type: "payment" },
  ];

  const recentQuotes = [
    { id: 1, name: "Maria Antonieta Lugo", amount: 850.00, currency: "Soles", type: "quote" },
    { id: 2, name: "Carlos Mariano Justo", amount: 850.00, currency: "Soles", type: "quote", hasDebt: true },
    { id: 3, name: "Maria Antonieta Lugo", amount: 850.00, currency: "Soles", type: "quote" },
  ];

  const TransactionCard = ({ item }: { item: typeof recentPayments[0] }) => (
    <Card className="mb-3 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1"
              >
                {item.currency}
              </Badge>
              {item.hasDebt && (
                <Badge 
                  variant="secondary" 
                  className="bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1"
                >
                  Dolares
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">S/ {item.amount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold" style={{ color: '#FF6E63' }}>Home</h1>
          </div>
        </div>
      </div>

      {/* Management Quick Access - Only visible on mobile */}
      <div className="md:hidden p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Gestión rápida</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300"
            style={{ borderColor: '#FF6E63', color: '#FF6E63' }}
            onClick={onNavigateToServices}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Servicios</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300"
            style={{ borderColor: '#FF6E63', color: '#FF6E63' }}
            onClick={onNavigateToPatients}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Pacientes</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca por paciente"
            className="pl-10 h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-offset-2"
            style={{ '--tw-ring-color': '#FF6E63' } as any}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Recent Payments Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Últimos pagos</h2>
          </div>
          
          <div className="space-y-2">
            {recentPayments.map((payment) => (
              <TransactionCard key={`payment-${payment.id}`} item={payment} />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl transition-all duration-200"
            style={{ 
              borderColor: '#FF6E63', 
              backgroundColor: 'rgba(255, 110, 99, 0.1)', 
              color: '#FF6E63' 
            }}
          >
            Ver todos
          </Button>
        </div>

        {/* Recent Quotes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Últimas cotizaciones</h2>
          </div>
          
          <div className="space-y-2">
            {recentQuotes.map((quote) => (
              <TransactionCard key={`quote-${quote.id}`} item={quote} />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl transition-all duration-200"
            style={{ 
              borderColor: '#FF6E63', 
              backgroundColor: 'rgba(255, 110, 99, 0.1)', 
              color: '#FF6E63' 
            }}
          >
            Ver todos
          </Button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: '#FF6E63' }}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
