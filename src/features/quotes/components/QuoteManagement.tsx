
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Search, 
  Plus, 
  Minus, 
  Download, 
  Send, 
  DollarSign,
  FileText,
  MessageCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface Treatment {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface QuoteItem extends Treatment {
  quantity: number;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const QuoteManagement: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);

  // Mock data
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone.includes(patientSearch)
  );

  const addTreatment = (treatment: Treatment) => {
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

  const removeTreatment = (treatmentId: number) => {
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

  const getSubtotal = () => {
    return quoteItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    return subtotal - discount;
  };

  const handleSaveQuote = () => {
    // Lógica para guardar cotización
    alert('Cotización guardada exitosamente');
  };

  const handleExportPDF = () => {
    // Lógica para exportar PDF
    alert('Exportando cotización a PDF...');
  };

  const handleSendWhatsApp = () => {
    // Lógica para enviar por WhatsApp
    alert('Enviando cotización por WhatsApp...');
  };

  const handleSendEmail = () => {
    // Lógica para enviar por email
    alert('Enviando cotización por correo...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Nueva Cotización</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32 md:pb-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Buscar paciente..."
                  className="pl-10"
                />
              </div>

              {patientSearch && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'border-sakura-red bg-sakura-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setPatientSearch('');
                      }}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.phone}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800">{selectedPatient.name}</div>
                  <div className="text-sm text-green-600">{selectedPatient.phone}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatments Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tratamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {treatments.map((treatment) => {
                const quoteItem = quoteItems.find(item => item.id === treatment.id);
                return (
                  <div key={treatment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{treatment.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {treatment.category}
                        </Badge>
                      </div>
                      <span className="font-bold text-sakura-red">
                        S/ {treatment.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTreatment(treatment)}
                        className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                      
                      {quoteItem && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTreatment(treatment.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium px-2">{quoteItem.quantity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        {quoteItems.length > 0 && (
          <Card className="border-sakura-red/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen de Cotización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quoteItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">S/ {getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span>Descuento:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-20 h-8 text-right"
                        min="0"
                        max={getSubtotal()}
                      />
                      <span className="text-sm text-gray-600">S/</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-sakura-red">S/ {getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Action Bar */}
      {quoteItems.length > 0 && selectedPatient && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:bottom-auto md:border-0 md:bg-transparent md:p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={handleSaveQuote}
              className="bg-sakura-red hover:bg-sakura-red/90 h-12"
            >
              <FileText className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white h-12"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSendWhatsApp}
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white h-12"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSendEmail}
              className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white h-12"
            >
              <Send className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteManagement;
