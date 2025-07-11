import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Search, FileText, Download, MessageCircle, Send, Plus, ArrowLeft } from 'lucide-react';
import { Quote, Patient } from '../components/types';

interface QuoteListProps {
  onBack: () => void;
  onCreateNew: () => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ onBack, onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - In a real app, this would come from a service
  const quotes: Quote[] = [
    {
      id: 1,
      patient: { id: 1, name: 'María García López', phone: '999-123-456', email: 'maria@email.com' },
      items: [
        { id: 1, name: 'Limpieza Dental', price: 80, category: 'Preventivo', quantity: 1 },
        { id: 2, name: 'Empaste', price: 120, category: 'Restaurativo', quantity: 2 }
      ],
      discount: 20,
      subtotal: 320,
      total: 300,
      createdAt: new Date('2024-01-15'),
      status: 'sent'
    },
    {
      id: 2,
      patient: { id: 2, name: 'Carlos Rodríguez Pérez', phone: '999-789-123', email: 'carlos@email.com' },
      items: [
        { id: 4, name: 'Corona Dental', price: 300, category: 'Protésico', quantity: 1 }
      ],
      discount: 0,
      subtotal: 300,
      total: 300,
      createdAt: new Date('2024-01-14'),
      status: 'accepted'
    },
    {
      id: 3,
      patient: { id: 3, name: 'Ana Martínez Silva', phone: '999-456-789', email: 'ana@email.com' },
      items: [
        { id: 5, name: 'Blanqueamiento', price: 200, category: 'Estético', quantity: 1 },
        { id: 6, name: 'Endodoncia', price: 250, category: 'Especialidad', quantity: 1 }
      ],
      discount: 50,
      subtotal: 450,
      total: 400,
      createdAt: new Date('2024-01-13'),
      status: 'draft'
    }
  ];

  // Get unique recent patients
  const recentPatients = useMemo(() => {
    const uniquePatients = new Map<number, Patient>();
    quotes.forEach(quote => {
      if (!uniquePatients.has(quote.patient.id)) {
        uniquePatients.set(quote.patient.id, quote.patient);
      }
    });
    return Array.from(uniquePatients.values()).slice(0, 5); // Last 5 patients
  }, [quotes]);

  // Filter quotes by search query
  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return quotes;
    
    return quotes.filter(quote =>
      quote.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.patient.phone.includes(searchQuery) ||
      quote.id?.toString().includes(searchQuery)
    );
  }, [quotes, searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-700' },
      sent: { label: 'Enviada', className: 'bg-blue-100 text-blue-700' },
      accepted: { label: 'Aceptada', className: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rechazada', className: 'bg-red-100 text-red-700' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleExportPDF = (quoteId: number) => {
    alert(`Exportando cotización ${quoteId} a PDF...`);
  };

  const handleSendWhatsApp = (quote: Quote) => {
    alert(`Enviando cotización ${quote.id} por WhatsApp a ${quote.patient.name}...`);
  };

  const handleSendEmail = (quote: Quote) => {
    alert(`Enviando cotización ${quote.id} por email a ${quote.patient.email}...`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-sakura-red hover:text-sakura-red-dark"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-sakura-red">Cotizaciones</h1>
          </div>
          <Button 
            onClick={onCreateNew}
            className="bg-sakura-red hover:bg-sakura-red/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cotización
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de paciente, teléfono o número de cotización..."
            className="pl-10"
          />
        </div>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.phone}</div>
                  <div className="text-sm text-gray-600">{patient.email}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Cotizaciones ({filteredQuotes.length})</h2>
          </div>
          
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Cotización #{quote.id}</h3>
                      {getStatusBadge(quote.status || 'draft')}
                    </div>
                    <div className="text-gray-600">
                      <p><strong>Paciente:</strong> {quote.patient.name}</p>
                      <p><strong>Teléfono:</strong> {quote.patient.phone}</p>
                      <p><strong>Fecha:</strong> {quote.createdAt?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sakura-red">
                      S/ {quote.total.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {quote.items.length} tratamiento{quote.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quote.items.map((item) => (
                      <Badge key={item.id} variant="outline" className="text-xs">
                        {item.name} x{item.quantity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(quote.id!)}
                      className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(quote)}
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendEmail(quote)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredQuotes.length === 0 && (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron cotizaciones</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteList; 