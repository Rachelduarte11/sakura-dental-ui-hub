import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Check,
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

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

interface QuotePaymentProcessorProps {
  quote: Quote;
  patient: Patient;
  onBack: () => void;
}

type PaymentStep = 'services' | 'payment-method' | 'document-type' | 'processing' | 'completed';

const QuotePaymentProcessor: React.FC<QuotePaymentProcessorProps> = ({ 
  quote, 
  patient, 
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('services');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [documentType, setDocumentType] = useState<'boleta' | 'factura'>('boleta');
  const [ruc, setRuc] = useState('');

  const selectedServicesData = quote.services.filter(service => 
    selectedServices.includes(service.id)
  );

  const totalSelected = selectedServicesData.reduce((sum, service) => sum + service.price, 0);
  const remainingAmount = quote.total - totalSelected;

  // Cálculo de IGV
  const totalBase = selectedServices.length > 0 ? totalSelected / 1.18 : 0;
  const igv = selectedServices.length > 0 ? totalSelected - totalBase : 0;

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === quote.services.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedServices([]);
    } else {
      // Seleccionar todos
      setSelectedServices(quote.services.map(service => service.id));
    }
  };

  const handleContinueToPayment = () => {
    if (selectedServices.length > 0) {
      setPaymentAmount(totalSelected.toString());
      setCurrentStep('payment-method');
    }
  };

  const handleContinueToDocument = () => {
    setCurrentStep('document-type');
  };

  const handleProcessPayment = () => {
    setCurrentStep('processing');
    // Simular procesamiento
    setTimeout(() => {
      setCurrentStep('completed');
    }, 2000);
  };

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

  const renderServicesStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Seleccionar Servicios</h2>
            <p className="text-gray-500">Cotización #{quote.id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(quote.status)}>
          {getStatusText(quote.status)}
        </Badge>
      </div>

      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Historial Médico</p>
              <p className="text-gray-900">{patient.medicalHistory}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Servicios a Cobrar
            </CardTitle>
            <button
              onClick={handleSelectAll}
              className="text-sm text-sakura-red hover:text-sakura-red/80 font-medium"
            >
              {selectedServices.length === quote.services.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quote.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sakura-red">S/ {service.price}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Resumen de Selección</h3>
                <Badge className="bg-sakura-red text-white">
                  {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {selectedServicesData.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span>S/ {service.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total a Cobrar:</span>
                  <span className="text-sakura-red">S/ {totalSelected}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinueToPayment}
          disabled={selectedServices.length === 0}
          className="bg-sakura-red hover:bg-sakura-red/90"
        >
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPaymentMethodStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep('services')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Método de Pago</h2>
            <p className="text-gray-500">Total: S/ {totalSelected}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Seleccionar Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cash' ? 'border-sakura-red bg-sakura-red/5' : 'border-gray-200 hover:border-sakura-red/50'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center gap-3">
                <Banknote className="h-6 w-6 text-sakura-red" />
                <div className="flex-1">
                  <h3 className="font-medium">Efectivo</h3>
                  <p className="text-sm text-gray-600">Pago en efectivo</p>
                </div>
                {paymentMethod === 'cash' && <Check className="h-5 w-5 text-sakura-red" />}
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'card' ? 'border-sakura-red bg-sakura-red/5' : 'border-gray-200 hover:border-sakura-red/50'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-sakura-red" />
                <div className="flex-1">
                  <h3 className="font-medium">Tarjeta</h3>
                  <p className="text-sm text-gray-600">Débito o crédito</p>
                </div>
                {paymentMethod === 'card' && <Check className="h-5 w-5 text-sakura-red" />}
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'transfer' ? 'border-sakura-red bg-sakura-red/5' : 'border-gray-200 hover:border-sakura-red/50'
              }`}
              onClick={() => setPaymentMethod('transfer')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-sakura-red" />
                <div className="flex-1">
                  <h3 className="font-medium">Transferencia</h3>
                  <p className="text-sm text-gray-600">Transferencia bancaria</p>
                </div>
                {paymentMethod === 'transfer' && <Check className="h-5 w-5 text-sakura-red" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinueToDocument}
          className="bg-sakura-red hover:bg-sakura-red/90"
        >
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDocumentTypeStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep('payment-method')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tipo de Documento</h2>
            <p className="text-gray-500">Método: {paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}</p>
          </div>
        </div>
      </div>

      {/* Document Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Seleccionar Tipo de Documento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                documentType === 'boleta' ? 'border-sakura-red bg-sakura-red/5' : 'border-gray-200 hover:border-sakura-red/50'
              }`}
              onClick={() => setDocumentType('boleta')}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">B</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Boleta</h3>
                  <p className="text-sm text-gray-600">Documento de venta simple</p>
                </div>
                {documentType === 'boleta' && <Check className="h-5 w-5 text-sakura-red" />}
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                documentType === 'factura' ? 'border-sakura-red bg-sakura-red/5' : 'border-gray-200 hover:border-sakura-red/50'
              }`}
              onClick={() => setDocumentType('factura')}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">F</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Factura</h3>
                  <p className="text-sm text-gray-600">Documento con RUC</p>
                </div>
                {documentType === 'factura' && <Check className="h-5 w-5 text-sakura-red" />}
              </div>
            </div>
          </div>

          {/* RUC Input for Factura */}
          {documentType === 'factura' && (
            <div className="mt-4 p-4 border border-sakura-red/20 rounded-lg bg-sakura-red/5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC del Cliente
              </label>
              <Input
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="Ingrese el RUC (11 dígitos)"
                maxLength={11}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                El RUC debe tener 11 dígitos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paciente:</span>
              <span className="font-medium">{patient.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Servicios:</span>
              <span>{selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago:</span>
              <span className="capitalize">{paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipo de documento:</span>
              <span className="capitalize">{documentType === 'boleta' ? 'Boleta' : 'Factura'}</span>
            </div>
            {documentType === 'factura' && (
              <div className="flex justify-between">
                <span>RUC:</span>
                <span className="font-medium">{ruc || 'No especificado'}</span>
              </div>
            )}
            <div className="border-t pt-2 flex flex-col gap-1 font-bold text-lg">
              <div className="flex justify-between text-base font-normal">
                <span>Total base (sin IGV):</span>
                <span>S/ {totalBase.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-normal">
                <span>IGV (18%):</span>
                <span>S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total con IGV:</span>
                <span className="text-sakura-red">S/ {totalSelected.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleProcessPayment}
          disabled={documentType === 'factura' && ruc.length !== 11}
          className="bg-sakura-red hover:bg-sakura-red/90"
        >
          <Check className="h-4 w-4 mr-2" />
          Procesar Pago
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sakura-red"></div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando Pago</h2>
        <p className="text-gray-600">Generando {documentType === 'boleta' ? 'boleta' : 'factura'} con SUNAT...</p>
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Procesado!</h2>
        <p className="text-gray-600 mb-4">
          {documentType === 'boleta' ? 'Boleta' : 'Factura'} generada exitosamente
        </p>
      </div>
      
      <Button
        onClick={onBack}
        className="bg-sakura-red hover:bg-sakura-red/90"
      >
        Nueva Venta
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      {currentStep === 'services' && renderServicesStep()}
      {currentStep === 'payment-method' && renderPaymentMethodStep()}
      {currentStep === 'document-type' && renderDocumentTypeStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'completed' && renderCompletedStep()}
    </div>
  );
};

export default QuotePaymentProcessor; 