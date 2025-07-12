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
            {patientQuotes.length > 0 ? (
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
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay cotizaciones para este paciente</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientQuoteSelector; 