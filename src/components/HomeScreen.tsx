
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, Plus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HomeScreen: React.FC = () => {
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
    <Card className="mb-3 shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-sakura-gray hover:text-sakura-red">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-sakura-gray-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sakura-gray-medium">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-sakura-red">Home</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sakura-gray hover:text-sakura-red">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Ayuda</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca por paciente"
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
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
            className="w-full h-12 border-sakura-coral bg-sakura-coral/10 text-sakura-red hover:bg-sakura-coral/20 rounded-xl"
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
            className="w-full h-12 border-sakura-coral bg-sakura-coral/10 text-sakura-red hover:bg-sakura-coral/20 rounded-xl"
          >
            Ver todos
          </Button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-sakura-red hover:bg-sakura-red-dark shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium mb-2">
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cotización
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HomeScreen;
