
import React, { useState, useEffect } from 'react';
import PatientQuoteSelector from './PatientQuoteSelector';
import PaymentConfiguration from '../components/PaymentConfiguration';
import QuotePaymentProcessor from '../components/QuotePaymentProcessor';
import { useQuotationStore, usePatientStore, type Quotation, type Patient as StorePatient } from '@/shared/stores';
import { toast } from 'sonner';
import type { PaymentConfig } from '../components/PaymentConfiguration';

type SalesStep = 'select' | 'configure' | 'process';

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

interface SelectedService {
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  selected: boolean;
}

const SalesModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SalesStep>('select');
  const [selectedQuotation, setSelectedQuotation] = useState<Quote | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

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

  const handleQuoteSelect = (quotation: Quotation, selectedServicesList: SelectedService[]) => {
    // Buscar el paciente correspondiente a la cotización
    const storePatient = patients.find(p => p.patientId === quotation.patient_id);
    if (storePatient) {
      // Mapear datos de la store a los tipos esperados por QuotePaymentProcessor
      const mappedQuote: Quote = {
        id: quotation.quotation_id,
        patientId: quotation.patient_id,
        date: quotation.created_at,
        total: selectedServicesList.reduce((sum, service) => sum + service.subtotal, 0), // Usar solo servicios seleccionados
        status: quotation.status === 'PENDIENTE' ? 'pending' : 
                quotation.status === 'PAGADA' ? 'completed' : 'partial',
        services: selectedServicesList.map(service => ({
          id: service.serviceId,
          name: service.serviceName,
          price: service.unitPrice,
          category: 'General' // TODO: Obtener categoría del servicio desde la store de servicios
        }))
      };

      const mappedPatient: Patient = {
        id: storePatient.patientId,
        name: `${storePatient.firstName} ${storePatient.lastName}`,
        phone: storePatient.phone || '',
        email: storePatient.email || '',
        medicalHistory: 'Sin historial', // TODO: Agregar campo de historial médico
        dni: storePatient.dni || ''
      };

      setSelectedQuotation(mappedQuote);
      setSelectedPatient(mappedPatient);
      setSelectedServices(selectedServicesList);
      setCurrentStep('configure');
    }
  };

  const handlePaymentConfig = (config: PaymentConfig) => {
    setPaymentConfig(config);
    setCurrentStep('process');
  };

  const handleBackToSelect = () => {
    setCurrentStep('select');
    setSelectedQuotation(null);
    setSelectedPatient(null);
    setSelectedServices([]);
    setPaymentConfig(null);
  };

  const handleBackToConfigure = () => {
    setCurrentStep('configure');
  };

  return (
    <div className="p-6">
      {currentStep === 'select' ? (
        <PatientQuoteSelector onQuoteSelect={handleQuoteSelect} />
      ) : currentStep === 'configure' ? (
        selectedQuotation && selectedPatient && (
          <PaymentConfiguration
            quote={selectedQuotation}
            patient={selectedPatient}
            onBack={handleBackToSelect}
            onContinue={handlePaymentConfig}
          />
        )
      ) : (
        selectedQuotation && selectedPatient && paymentConfig && (
          <QuotePaymentProcessor
            quote={selectedQuotation}
            patient={selectedPatient}
            paymentConfig={paymentConfig}
            onBack={handleBackToConfigure}
          />
        )
      )}
    </div>
  );
};

export default SalesModule;
