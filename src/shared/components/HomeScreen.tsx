
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Settings, Users, Package, Calculator, UserCheck, DollarSign, AlertTriangle, FileText, TrendingUp } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToPatients: () => void;
  onNavigateToServices: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToPatients, onNavigateToServices }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for payments, quotes, and dashboard metrics
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

  // Dashboard metrics
  const dashboardMetrics = {
    todayIncome: 1250.00,
    totalDebt: 3450.00,
    pendingPatientsCount: 8,
    topTreatments: [
      { name: 'Ortodoncia', count: 12, amount: 6000 },
      { name: 'Blanqueamiento', count: 8, amount: 1600 },
      { name: 'Limpieza Dental', count: 15, amount: 1200 },
    ]
  };

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

      {/* Dashboard Metrics - Desktop */}
      <div className="hidden md:block p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cobrado Hoy</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/ {dashboardMetrics.todayIncome.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% vs ayer
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monto en Deuda</p>
                  <p className="text-2xl font-bold text-red-600">
                    S/ {dashboardMetrics.totalDebt.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dashboardMetrics.pendingPatientsCount} pacientes
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Pendientes</p>
                  <p className="text-2xl font-bold text-sakura-red">
                    {dashboardMetrics.pendingPatientsCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    Con pago pendiente
                  </p>
                </div>
                <Users className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Tratamiento</p>
                  <p className="text-lg font-bold text-sakura-red">
                    {dashboardMetrics.topTreatments[0].name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dashboardMetrics.topTreatments[0].count} cotizaciones
                  </p>
                </div>
                <FileText className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Treatments */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Top 3 Tratamientos Cotizados</h3>
            <div className="grid grid-cols-3 gap-4">
              {dashboardMetrics.topTreatments.map((treatment, index) => (
                <div key={treatment.name} className="p-3 rounded-lg bg-gradient-to-r from-sakura-red/10 to-sakura-red/5 border border-sakura-red/20">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-sakura-red text-white text-xs">#{index + 1}</Badge>
                    <span className="font-bold text-sakura-red text-sm">S/ {treatment.amount.toFixed(0)}</span>
                  </div>
                  <h4 className="font-medium text-sm">{treatment.name}</h4>
                  <p className="text-xs text-gray-600">{treatment.count} cotizaciones</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Quick Access - Only visible on mobile */}
      <div className="md:hidden p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Gestión rápida</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
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

        {/* Mobile Dashboard Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">Cobrado Hoy</p>
                <p className="text-lg font-bold text-green-600">
                  S/ {dashboardMetrics.todayIncome.toFixed(0)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">En Deuda</p>
                <p className="text-lg font-bold text-red-600">
                  S/ {dashboardMetrics.totalDebt.toFixed(0)}
                </p>
              </div>
            </CardContent>
          </Card>
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
            variant="ghost" 
            className="w-full h-12 rounded-xl transition-all duration-200 hover:bg-transparent"
            style={{ 
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
            variant="ghost" 
            className="w-full h-12 rounded-xl transition-all duration-200 hover:bg-transparent"
            style={{ 
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
