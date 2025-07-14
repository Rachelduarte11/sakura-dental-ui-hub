import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { 
  Search,
  User,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { useQuotationStore, usePatientStore, type Quotation, type Patient } from '@/shared/stores';
import { EmptyState } from '@/shared/components';
import { toast } from 'sonner';

interface PatientQuoteSelectorProps {
  onQuoteSelect: (quotation: Quotation, selectedServices: any[]) => void;
}

interface SelectedService {
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  selected: boolean;
}

const PatientQuoteSelector: React.FC<PatientQuoteSelectorProps> = ({ onQuoteSelect }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const { 
    quotations, 
    isLoading: quotationsLoading, 
    error: quotationsError, 
    fetchQuotations, 
    clearError: clearQuotationsError 
  } = useQuotationStore();

  const { 
    patients, 
    isLoading: patientsLoading, 
    error: patientsError, 
    fetchPatients, 
    clearError: clearPatientsError 
  } = usePatientStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchQuotations();
    fetchPatients();
  }, [fetchQuotations, fetchPatients]);

  // Manejar errores
  useEffect(() => {
    if (quotationsError) {
      toast.error(quotationsError);
      clearQuotationsError();
    }
    if (patientsError) {
      toast.error(patientsError);
      clearPatientsError();
    }
  }, [quotationsError, patientsError, clearQuotationsError, clearPatientsError]);

  // Filtrar pacientes usando la misma lógica que PatientSelector
  const filteredPatients = patients.filter(patient => {
    const searchLower = patientSearch.toLowerCase();
    return (
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
      patient.phone?.includes(patientSearch) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.dni?.includes(patientSearch) ||
      // También buscar por nombre y apellido por separado
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower)
    );
  });

  const patientQuotes = selectedPatient 
    ? quotations.filter(quotation => quotation.patient_id === selectedPatient.patientId)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'partial': return 'Parcial';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedQuote(null);
    setSelectedServices([]);
    setPatientSearch(''); // Limpiar búsqueda al seleccionar
  };

  const handlePatientClear = () => {
    setSelectedPatient(null);
    setSelectedQuote(null);
    setSelectedServices([]);
  };

  const handleQuoteSelect = (quotation: Quotation) => {
    setSelectedQuote(quotation);
    
    // Convertir los items de la cotización al formato de servicios seleccionables
    const services: SelectedService[] = (quotation.items || []).map((item: any) => ({
      serviceId: item.service_id || item.serviceId,
      serviceName: item.service_name || item.serviceName || 'Servicio',
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || item.unitPrice || item.price || 0,
      subtotal: (item.quantity || 1) * (item.unit_price || item.unitPrice || item.price || 0),
      selected: false
    }));
    
    setSelectedServices(services);
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.map(service => 
        service.serviceId === serviceId 
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const handleSelectAllServices = () => {
    setSelectedServices(prev => 
      prev.map(service => ({ ...service, selected: true }))
    );
  };

  const handleDeselectAllServices = () => {
    setSelectedServices(prev => 
      prev.map(service => ({ ...service, selected: false }))
    );
  };

  const handleContinue = () => {
    const selectedServicesList = selectedServices.filter(service => service.selected);
    
    if (selectedServicesList.length === 0) {
      toast.error('Por favor selecciona al menos un servicio para continuar');
      return;
    }

    if (selectedQuote) {
      onQuoteSelect(selectedQuote, selectedServicesList);
    }
  };

  const selectedServicesTotal = selectedServices
    .filter(service => service.selected)
    .reduce((sum, service) => sum + service.subtotal, 0);

  const selectedServicesCount = selectedServices.filter(service => service.selected).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Seleccionar Paciente y Cotización</h2>
      </div>

      {/* Loading State */}
      {patientsLoading || quotationsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
          <span className="ml-2 text-sakura-gray">Cargando datos...</span>
        </div>
      ) : patientsError || quotationsError ? (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar datos</h3>
            <p className="text-red-600 mb-4">
              {patientsError || quotationsError}
            </p>
            <Button 
              onClick={() => {
                fetchPatients();
                fetchQuotations();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reintentar
            </Button>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          title="No hay pacientes registrados"
          description="Para procesar pagos, primero necesitas registrar pacientes en el sistema."
          icon={
            <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-sakura-red" />
            </div>
          }
          actionLabel="Ir a Pacientes"
          onAction={() => window.location.href = '/patients'}
        />
      ) : quotations.length === 0 ? (
        <EmptyState
          title="No hay cotizaciones disponibles"
          description="Para procesar pagos, primero necesitas crear cotizaciones para los pacientes."
          icon={
            <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-sakura-red" />
            </div>
          }
          actionLabel="Crear Cotización"
          onAction={() => window.location.href = '/quotes/create'}
        />
      ) : (
        <>
          {/* Patient Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Buscar Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Buscar por nombre, teléfono, email o DNI..."
                    className="pl-10"
                  />
                </div>

                {/* Mostrar resultados de búsqueda */}
                {patientSearch && !selectedPatient && (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {filteredPatients.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No se encontraron pacientes con "{patientSearch}"
                      </div>
                    ) : (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.patientId}
                          onClick={() => handlePatientSelect(patient)}
                          className="p-3 rounded-lg border cursor-pointer transition-colors border-gray-200 hover:border-gray-300"
                        >
                          <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                          <div className="text-sm text-gray-600">
                            {patient.phone && `${patient.phone} • `}
                            {patient.dni || patient.email}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Mostrar paciente seleccionado */}
                {selectedPatient && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-green-800">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </div>
                        <div className="text-sm text-green-600">
                          {selectedPatient.phone && `${selectedPatient.phone} • `}
                          {selectedPatient.dni || selectedPatient.email}
                        </div>
                      </div>
                      <button
                        onClick={handlePatientClear}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient Quotes */}
          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cotizaciones de {selectedPatient.firstName} {selectedPatient.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
                    <span className="ml-2 text-sakura-gray">Cargando cotizaciones...</span>
                  </div>
                ) : quotationsError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar cotizaciones</h3>
                      <p className="text-red-600 mb-4">{quotationsError}</p>
                      <Button 
                        onClick={() => fetchQuotations()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : patientQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {patientQuotes.map((quotation) => (
                      <div
                        key={quotation.quotation_id}
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${
                          selectedQuote?.quotation_id === quotation.quotation_id
                            ? 'border-sakura-red bg-sakura-red/5'
                            : 'border-gray-200 hover:border-sakura-red/50 hover:shadow-md'
                        }`}
                        onClick={() => handleQuoteSelect(quotation)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-medium text-gray-900">
                                Cotización #{quotation.quotation_id}
                              </h3>
                              <Badge className={getStatusColor(quotation.status)}>
                                {getStatusText(quotation.status)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(quotation.created_at).toLocaleDateString('es-ES')}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                S/ {quotation.total_amount}
                              </div>
                              <div>
                                {quotation.items?.length || 0} servicio{(quotation.items?.length || 0) !== 1 ? 's' : ''}
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                {quotation.items?.length ? 'Servicios incluidos' : 'Sin servicios'}
                              </p>
                            </div>
                          </div>
                          
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No hay cotizaciones para este paciente"
                    description={`${selectedPatient.firstName} ${selectedPatient.lastName} no tiene cotizaciones pendientes de pago.`}
                    variant="compact"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Quote Services Selection */}
          {selectedQuote && selectedServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Seleccionar Servicios - Cotización #{selectedQuote.quotation_id}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllServices}
                    className="text-sm"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Seleccionar Todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllServices}
                    className="text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Deseleccionar Todo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <div
                      key={service.serviceId}
                      className={`p-4 border rounded-lg transition-colors ${
                        service.selected
                          ? 'border-sakura-red bg-sakura-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={service.selected}
                            onCheckedChange={() => handleServiceToggle(service.serviceId)}
                            className="data-[state=checked]:bg-sakura-red data-[state=checked]:border-sakura-red"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>Cantidad: {service.quantity}</span>
                              <span>Precio unitario: S/ {service.unitPrice.toFixed(2)}</span>
                              <span className="font-medium text-sakura-red">
                                Subtotal: S/ {service.subtotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Servicios seleccionados: {selectedServicesCount} de {selectedServices.length}
                      </p>
                      <p className="text-lg font-semibold text-sakura-red">
                        Total a pagar: S/ {selectedServicesTotal.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      onClick={handleContinue}
                      disabled={selectedServicesCount === 0}
                      className="bg-sakura-red hover:bg-sakura-red/90 text-white"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientQuoteSelector; 