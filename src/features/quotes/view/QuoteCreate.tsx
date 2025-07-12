import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  PatientSelector,
  TreatmentSelector,
  QuoteSummary,
  QuoteActions,
  Patient,
  Treatment,
  QuoteItem
} from '../components';
import { usePatientStore, useServiceStore, useQuotationStore, type Patient as StorePatient, type Service } from '@/shared/stores';
import { toast } from 'sonner';

interface QuoteCreateProps {
  onBack: () => void;
}

const QuoteCreate: React.FC<QuoteCreateProps> = ({ onBack }) => {
  // State management
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);

  const { 
    patients, 
    isLoading: patientsLoading, 
    error: patientsError, 
    fetchPatients, 
    clearError: clearPatientsError 
  } = usePatientStore();

  const { 
    services, 
    isLoading: servicesLoading, 
    error: servicesError, 
    fetchServices, 
    clearError: clearServicesError 
  } = useServiceStore();

  const { 
    createQuotation, 
    isLoading: quotationLoading, 
    error: quotationError, 
    clearError: clearQuotationError 
  } = useQuotationStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPatients();
    fetchServices();
  }, [fetchPatients, fetchServices]);

  // Manejar errores
  useEffect(() => {
    if (patientsError) {
      toast.error(patientsError);
      clearPatientsError();
    }
    if (servicesError) {
      toast.error(servicesError);
      clearServicesError();
    }
    if (quotationError) {
      toast.error(quotationError);
      clearQuotationError();
    }
  }, [patientsError, servicesError, quotationError, clearPatientsError, clearServicesError, clearQuotationError]);

  // Convertir datos de stores a formato esperado por componentes
  const treatments: Treatment[] = services.map(service => ({
    id: service.service_id,
    name: service.name,
    price: service.base_price,
    category: 'Sin categoría' // TODO: Agregar categoría cuando esté disponible en el tipo Service
  }));

  const patientsData: Patient[] = patients.map(patient => ({
    id: patient.patient_id,
    name: `${patient.first_name} ${patient.last_name}`,
    phone: patient.phone || '',
    email: patient.email || ''
  }));

  // Business logic handlers
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientClear = () => {
    setSelectedPatient(null);
  };

  const handleAddTreatment = (treatment: Treatment) => {
    const existingItem = quoteItems.find(item => item.id === treatment.id);
    if (existingItem) {
      setQuoteItems(quoteItems.map(item =>
        item.id === treatment.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setQuoteItems([...quoteItems, { ...treatment, quantity: 1 }]);
    }
  };

  const handleRemoveTreatment = (treatmentId: number) => {
    const existingItem = quoteItems.find(item => item.id === treatmentId);
    if (existingItem && existingItem.quantity > 1) {
      setQuoteItems(quoteItems.map(item =>
        item.id === treatmentId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setQuoteItems(quoteItems.filter(item => item.id !== treatmentId));
    }
  };

  const handleDiscountChange = (newDiscount: number) => {
    setDiscount(newDiscount);
  };

  // Action handlers
  const handleSaveQuote = async () => {
    if (!selectedPatient || quoteItems.length === 0) {
      toast.error('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }

    try {
      const totalAmount = quoteItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - discount;
      
      const quotationData = {
        patient_id: selectedPatient.id,
        total_amount: totalAmount,
        status: 'PENDIENTE' as const,
        items: quoteItems.map(item => ({
          service_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        })) as any // TODO: Ajustar tipo cuando se defina correctamente QuotationItem
      };

      await createQuotation(quotationData);
      toast.success('Cotización guardada exitosamente');
      onBack();
    } catch (error) {
      toast.error('Error al guardar la cotización');
    }
  };

  const handleExportPDF = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      toast.error('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    toast.success('Exportando cotización a PDF...');
  };

  const handleSendWhatsApp = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      toast.error('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    toast.success('Enviando cotización por WhatsApp...');
  };

  const handleSendEmail = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      toast.error('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    toast.success('Enviando cotización por correo...');
  };

  const canPerformActions = selectedPatient && quoteItems.length > 0;
  const isLoading = patientsLoading || servicesLoading || quotationLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-xl font-bold text-sakura-red">Nueva Cotización</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32 md:pb-6">
        {/* Patient Selection */}
        <PatientSelector
          patients={patientsData}
          selectedPatient={selectedPatient}
          onPatientSelect={handlePatientSelect}
          onPatientClear={handlePatientClear}
        />

        {/* Treatments Selection */}
        <TreatmentSelector
          treatments={treatments}
          quoteItems={quoteItems}
          onAddTreatment={handleAddTreatment}
          onRemoveTreatment={handleRemoveTreatment}
        />

        {/* Quote Summary */}
        <QuoteSummary
          items={quoteItems}
          discount={discount}
          onDiscountChange={handleDiscountChange}
        />
      </div>

      {/* Actions */}
      <QuoteActions
        onSave={handleSaveQuote}
        onExportPDF={handleExportPDF}
        onSendWhatsApp={handleSendWhatsApp}
        onSendEmail={handleSendEmail}
        disabled={!canPerformActions}
      />
    </div>
  );
};

export default QuoteCreate; 