import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { 
  Search,
  User,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useQuotationStore, usePatientStore, type Quotation, type Patient } from '@/shared/stores';
import { EmptyState } from '@/shared/components';
import { toast } from 'sonner';

interface PatientQuoteSelectorProps {
  onQuoteSelect: (quotation: Quotation) => void;
}

const PatientQuoteSelector: React.FC<PatientQuoteSelectorProps> = ({ onQuoteSelect }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone?.includes(patientSearch) ||
    patient.doc_number?.includes(patientSearch)
  );

  const patientQuotes = selectedPatient 
    ? quotations.filter(quotation => quotation.patient_id === selectedPatient.patient_id)
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Buscar por nombre, teléfono o historial médico..."
                  className="pl-10"
                />
              </div>

              {patientSearch && (
                <div className="mt-4 space-y-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.patient_id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPatient?.patient_id === patient.patient_id
                          ? 'border-sakura-red bg-sakura-red/5'
                          : 'border-gray-200 hover:border-sakura-red/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{patient.first_name} {patient.last_name}</h3>
                          <p className="text-sm text-gray-500">
                            {patient.phone} • {patient.doc_number}
                          </p>
                        </div>
                        {selectedPatient?.patient_id === patient.patient_id && (
                          <Badge className="bg-sakura-red text-white">Seleccionado</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Quotes */}
          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cotizaciones de {selectedPatient.first_name} {selectedPatient.last_name}
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
                        className="p-4 border border-gray-200 rounded-lg hover:border-sakura-red/50 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => onQuoteSelect(quotation)}
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
                    description={`${selectedPatient.first_name} ${selectedPatient.last_name} no tiene cotizaciones pendientes de pago.`}
                    variant="compact"
                  />
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientQuoteSelector; 