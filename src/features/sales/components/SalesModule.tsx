
import React, { useState } from 'react';
import PatientQuoteSelector from './PatientQuoteSelector';
import QuotePaymentProcessor from './QuotePaymentProcessor';

interface QuoteService {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Quote {
  id: number;
  patientId: number;
  date: string;
  total: number;
  status: 'pending' | 'partial' | 'completed';
  services: QuoteService[];
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  medicalHistory: string;
  dni: string;
}

type SalesStep = 'select' | 'process';

const SalesModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SalesStep>('select');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleQuoteSelect = (quote: Quote) => {
    // Buscar el paciente correspondiente a la cotización
    const patients: Patient[] = [
      { id: 1, name: 'María García López', phone: '999-123-456', email: 'maria@email.com', medicalHistory: 'MH001', dni: '12345678' },
      { id: 2, name: 'Carlos Rodríguez Pérez', phone: '999-789-123', email: 'carlos@email.com', medicalHistory: 'MH002', dni: '87654321' },
      { id: 3, name: 'Ana Martínez Silva', phone: '999-456-789', email: 'ana@email.com', medicalHistory: 'MH003', dni: '11223344' },
      { id: 4, name: 'Luis Fernández Torres', phone: '999-321-654', email: 'luis@email.com', medicalHistory: 'MH004', dni: '44332211' },
    ];
    
    const patient = patients.find(p => p.id === quote.patientId);
    if (patient) {
      setSelectedQuote(quote);
      setSelectedPatient(patient);
      setCurrentStep('process');
    }
  };

  const handleBack = () => {
    setCurrentStep('select');
    setSelectedQuote(null);
    setSelectedPatient(null);
  };

  return (
    <div className="p-6">
      {currentStep === 'select' ? (
        <PatientQuoteSelector onQuoteSelect={handleQuoteSelect} />
      ) : (
        selectedQuote && selectedPatient && (
          <QuotePaymentProcessor
            quote={selectedQuote}
            patient={selectedPatient}
            onBack={handleBack}
          />
        )
      )}
    </div>
  );
};

export default SalesModule;
