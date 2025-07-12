
import React, { useState, useEffect } from 'react';
import PatientQuoteSelector from './PatientQuoteSelector';
import QuotePaymentProcessor from './QuotePaymentProcessor';
import { useQuotationStore, usePatientStore, type Quotation, type Patient as StorePatient } from '@/shared/stores';
import { toast } from 'sonner';

type SalesStep = 'select' | 'process';

// Tipos esperados por QuotePaymentProcessor
interface Quote {
  id: number;
  patientId: number;
  date: string;
  total: number;
  status: 'pending' | 'partial' | 'completed';
  services: QuoteService[];
}

interface QuoteService {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  medicalHistory: string;
  dni: string;
}

const SalesModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SalesStep>('select');
  const [selectedQuotation, setSelectedQuotation] = useState<Quote | null>(null);
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

  const handleQuoteSelect = (quotation: Quotation) => {
    // Buscar el paciente correspondiente a la cotización
    const storePatient = patients.find(p => p.patient_id === quotation.patient_id);
    if (storePatient) {
      // Mapear datos de la store a los tipos esperados por QuotePaymentProcessor
      const mappedQuote: Quote = {
        id: quotation.quotation_id,
        patientId: quotation.patient_id,
        date: quotation.created_at,
        total: quotation.total_amount,
        status: quotation.status === 'PENDIENTE' ? 'pending' : 
                quotation.status === 'PAGADA' ? 'completed' : 'partial',
        services: quotation.items?.map(item => ({
          id: item.item_id,
          name: 'Servicio', // TODO: Obtener nombre del servicio desde la store de servicios
          price: item.unit_price,
          category: 'General'
        })) || []
      };

      const mappedPatient: Patient = {
        id: storePatient.patient_id,
        name: `${storePatient.first_name} ${storePatient.last_name}`,
        phone: storePatient.phone || '',
        email: storePatient.email || '',
        medicalHistory: 'Sin historial', // TODO: Agregar campo de historial médico
        dni: storePatient.doc_number || ''
      };

      setSelectedQuotation(mappedQuote);
      setSelectedPatient(mappedPatient);
      setCurrentStep('process');
    }
  };

  const handleBack = () => {
    setCurrentStep('select');
    setSelectedQuotation(null);
    setSelectedPatient(null);
  };

  const isLoading = quotationsLoading || patientsLoading;

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sakura-red"></div>
          <span className="ml-2 text-sakura-gray">Cargando datos...</span>
        </div>
      ) : currentStep === 'select' ? (
        <PatientQuoteSelector onQuoteSelect={handleQuoteSelect} />
      ) : (
        selectedQuotation && selectedPatient && (
          <QuotePaymentProcessor
            quote={selectedQuotation}
            patient={selectedPatient}
            onBack={handleBack}
          />
        )
      )}
    </div>
  );
};

export default SalesModule;
