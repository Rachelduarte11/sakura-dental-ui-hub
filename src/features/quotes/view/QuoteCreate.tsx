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
import QuoteFooterBar from '../components/QuoteFooterBar';
import { usePatientStore, useQuotationStore, useCategorieServiceStore, type Patient as StorePatient } from '@/shared/stores';
import { useServiceActions } from '@/features/services/hooks/useServiceActions';
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
    setFilters,
    clearError: clearServicesError
  } = useServiceActions();

  const { 
    categories, 
    isLoading: categoriesLoading, 
    error: categoriesError, 
    fetchCategories, 
    clearError: clearCategoriesError 
  } = useCategorieServiceStore();

  // Cargar datos del store al montar el componente
  useEffect(() => {
    fetchPatients();
    fetchServices();
    fetchCategories();
    setFilters({}); // Para asegurar que no haya filtros activos y traiga todos los servicios
  }, [fetchPatients, fetchServices, fetchCategories, setFilters]);

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
    if (categoriesError) {
      toast.error(categoriesError);
      clearCategoriesError();
    }
  }, [patientsError, servicesError, categoriesError, clearPatientsError, clearServicesError, clearCategoriesError]);

  // Convertir datos del store a formato esperado por componentes
  const treatments: Treatment[] = services.map(service => ({
    id: service['serviceId'],
    name: service['name'],
    price: typeof service['basePrice'] === 'number' ? service['basePrice'] : 0,
    category: categories.find(cat => cat.categorieServiceId === service['categorieServiceId'])?.name || 'Sin categoría',
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

    // Construir payload según backend
    const totalAmount = quoteItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const quotationData = {
      patientId: selectedPatient.id,
      totalAmount,
      status: 'PENDIENTE',
      items: quoteItems.map(item => ({
        serviceId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la cotización');
      }
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
  const isLoading = patientsLoading || servicesLoading || categoriesLoading;

  if (patientsError || servicesError || categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded shadow">
          <div className="font-bold mb-2">Error al cargar datos:</div>
          <div>{patientsError || servicesError || categoriesError}</div>
          <button
            className="mt-4 px-4 py-2 bg-sakura-red text-white rounded hover:bg-sakura-red-dark"
            onClick={() => {
              clearPatientsError();
              clearServicesError();
              clearCategoriesError();
              fetchPatients();
              fetchServices();
              fetchCategories();
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          patients={patients}
          selectedPatient={selectedPatient}
          onPatientSelect={handlePatientSelect}
          onPatientClear={handlePatientClear}
        />

        {/* Treatments Selection */}
        <TreatmentSelector
          treatments={treatments}
          categories={categories}
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
      {quoteItems.length > 0 && (
        <QuoteFooterBar
          quoteItems={quoteItems}
          discount={discount}
          onSave={handleSaveQuote}
          onExportPDF={handleExportPDF}
          onSendWhatsApp={handleSendWhatsApp}
          onSendEmail={handleSendEmail}
          disabled={!selectedPatient}
        />
      )}
    </div>
  );
};

export default QuoteCreate; 