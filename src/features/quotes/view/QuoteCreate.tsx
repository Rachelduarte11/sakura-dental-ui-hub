import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  PatientSelector,
  TreatmentSelector,
  QuoteSummary,
  QuoteActions,
  Patient,
  Treatment,
  QuoteItem
} from '../components';

interface QuoteCreateProps {
  onBack: () => void;
}

const QuoteCreate: React.FC<QuoteCreateProps> = ({ onBack }) => {
  // State management
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);

  // Mock data - In a real app, this would come from a service
  const treatments: Treatment[] = [
    { id: 1, name: 'Limpieza Dental', price: 80, category: 'Preventivo' },
    { id: 2, name: 'Empaste', price: 120, category: 'Restaurativo' },
    { id: 3, name: 'Extracción', price: 150, category: 'Cirugía' },
    { id: 4, name: 'Corona Dental', price: 300, category: 'Protésico' },
    { id: 5, name: 'Blanqueamiento', price: 200, category: 'Estético' },
    { id: 6, name: 'Endodoncia', price: 250, category: 'Especialidad' },
    { id: 7, name: 'Ortodoncia', price: 500, category: 'Especialidad' },
    { id: 8, name: 'Implante Dental', price: 800, category: 'Cirugía' },
  ];

  const patients: Patient[] = [
    { id: 1, name: 'María García López', phone: '999-123-456', email: 'maria@email.com' },
    { id: 2, name: 'Carlos Rodríguez Pérez', phone: '999-789-123', email: 'carlos@email.com' },
    { id: 3, name: 'Ana Martínez Silva', phone: '999-456-789', email: 'ana@email.com' },
    { id: 4, name: 'Luis Fernández Torres', phone: '999-321-654', email: 'luis@email.com' },
  ];

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
  const handleSaveQuote = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      alert('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    // Lógica para guardar cotización
    alert('Cotización guardada exitosamente');
    onBack(); // Volver al listado después de guardar
  };

  const handleExportPDF = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      alert('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    // Lógica para exportar PDF
    alert('Exportando cotización a PDF...');
  };

  const handleSendWhatsApp = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      alert('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    // Lógica para enviar por WhatsApp
    alert('Enviando cotización por WhatsApp...');
  };

  const handleSendEmail = () => {
    if (!selectedPatient || quoteItems.length === 0) {
      alert('Por favor selecciona un paciente y al menos un tratamiento');
      return;
    }
    // Lógica para enviar por email
    alert('Enviando cotización por correo...');
  };

  const canPerformActions = selectedPatient && quoteItems.length > 0;

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