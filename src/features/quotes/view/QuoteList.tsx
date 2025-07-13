import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Search, FileText, Download, MessageCircle, Send, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuotationStore, usePatientStore, type Quotation, type Patient } from '@/shared/stores';
import { EmptyQuotes } from '@/shared/components';
import { toast } from 'sonner';

interface QuoteListProps {
  onBack: () => void;
  onCreateNew: () => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ onBack, onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    quotations, 
    isLoading, 
    error, 
    fetchQuotations, 
    setFilters, 
    clearError 
  } = useQuotationStore();

  const { patients, fetchPatients } = usePatientStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchQuotations();
    fetchPatients();
  }, [fetchQuotations, fetchPatients]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Aplicar filtros de búsqueda
  useEffect(() => {
    setFilters({ search: searchQuery });
  }, [searchQuery, setFilters]);

  // Get unique recent patients
  const recentPatients = useMemo(() => {
    return patients.slice(0, 5); // Last 5 patients
  }, [patients]);

  // Filter quotations by search query
  const filteredQuotations = useMemo(() => {
    if (!searchQuery.trim()) return quotations;
    
    return quotations.filter(quotation => {
      const patient = patients.find(p => p.patient_id === quotation.patient_id);
      return patient && (
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone?.includes(searchQuery) ||
        quotation.quotation_id?.toString().includes(searchQuery)
      );
    });
  }, [quotations, patients, searchQuery]);

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

  const handleExportPDF = (quotationId: number) => {
    toast.info(`Exportando cotización ${quotationId} a PDF...`);
  };

  const handleSendWhatsApp = (quotation: Quotation) => {
    const patient = patients.find(p => p.patient_id === quotation.patient_id);
    toast.info(`Enviando cotización ${quotation.quotation_id} por WhatsApp a ${patient ? `${patient.first_name} ${patient.last_name}` : 'paciente'}...`);
  };

  const handleSendEmail = (quotation: Quotation) => {
    const patient = patients.find(p => p.patient_id === quotation.patient_id);
    toast.info(`Enviando cotización ${quotation.quotation_id} por email a ${patient?.email || 'paciente'}...`);
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
                <div key={patient.patient_id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-medium">{patient.first_name} {patient.last_name}</div>
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
            <h2 className="text-lg font-semibold">Cotizaciones ({filteredQuotations.length})</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
              <span className="ml-2 text-sakura-gray">Cargando cotizaciones...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar cotizaciones</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => fetchQuotations()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          ) : filteredQuotations.length === 0 ? (
            <EmptyQuotes onCreateQuote={onCreateNew} />
          ) : (
                        filteredQuotations.map((quotation) => {
              const patient = patients.find(p => p.patient_id === quotation.patient_id);
              return (
                <Card key={quotation.quotation_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">Cotización #{quotation.quotation_id}</h3>
                          {getStatusBadge(quotation.status || 'draft')}
                        </div>
                        <div className="text-gray-600">
                          <p><strong>Paciente:</strong> {patient ? `${patient.first_name} ${patient.last_name}` : 'N/A'}</p>
                          <p><strong>Teléfono:</strong> {patient?.phone || 'N/A'}</p>
                          <p><strong>Fecha:</strong> {new Date(quotation.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sakura-red">
                          S/ {quotation.total_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quotation.items?.length || 0} tratamiento{(quotation.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quotation.items?.map((item) => (
                          <Badge key={item.quotation_id} variant="outline" className="text-xs">
                            Servicio x{item.quantity}
                          </Badge>
                        )) || []}
                      </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(quotation.quotation_id)}
                      className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(quotation)}
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendEmail(quotation)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteList; 