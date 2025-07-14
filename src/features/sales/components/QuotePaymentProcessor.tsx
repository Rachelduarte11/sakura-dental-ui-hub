import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Check,
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  ArrowRight,
  Receipt,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentConfig } from './PaymentConfiguration';

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
  paymentConfig: PaymentConfig;
  onBack: () => void;
}

type PaymentStep = 'summary' | 'processing' | 'completed';

const QuotePaymentProcessor: React.FC<QuotePaymentProcessorProps> = ({ 
  quote, 
  patient, 
  paymentConfig,
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('summary');

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

  const getPaymentMethodInfo = () => {
    switch (paymentConfig.methodId) {
      case 1:
        return { name: 'Yape', icon: CreditCard, color: 'text-green-600' };
      case 2:
        return { name: 'Transferencia', icon: Banknote, color: 'text-blue-600' };
      case 3:
        return { name: 'Efectivo', icon: Banknote, color: 'text-green-600' };
      case 4:
        return { name: 'Tarjeta', icon: CreditCard, color: 'text-purple-600' };
      default:
        return { name: 'Efectivo', icon: Banknote, color: 'text-green-600' };
    }
  };

  const handleProcessPayment = async () => {
    setCurrentStep('processing');
    
    try {
      // Log del payload antes de enviarlo
      console.log('Payload enviado a /api/payments:', paymentConfig);
      // Llamada real al API de pagos
      const response = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentConfig)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Respuesta del backend:', result);
      
      setCurrentStep('completed');
      toast.success('Pago procesado exitosamente');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
      setCurrentStep('summary');
    }
  };

  const renderSummaryStep = () => {
    const paymentMethodInfo = getPaymentMethodInfo();
    const PaymentIcon = paymentMethodInfo.icon;

    return (
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
              <h2 className="text-2xl font-bold text-gray-800">Confirmar Pago</h2>
              <p className="text-gray-500">Cotización #{quote.id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {getStatusText(quote.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen de la Cotización */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Resumen de Cotización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Cotización #{quote.id}</h3>
                <p className="text-sm text-gray-600">Fecha: {new Date(quote.date).toLocaleDateString('es-ES')}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Servicios:</h4>
                {quote.services.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">S/ {service.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-sakura-red">S/ {quote.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Pago */}
          <div className="space-y-6">
            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
                {patient.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{patient.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Método de Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PaymentIcon className={`h-5 w-5 ${paymentMethodInfo.color}`} />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <PaymentIcon className={`h-6 w-6 ${paymentMethodInfo.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{paymentMethodInfo.name}</p>
                    <p className="text-sm text-gray-500">
                      {paymentConfig.methodId === 1 && 'Pago móvil'}
                      {paymentConfig.methodId === 2 && 'Transferencia bancaria'}
                      {paymentConfig.methodId === 3 && 'Pago en efectivo'}
                      {paymentConfig.methodId === 4 && 'Tarjeta de crédito/débito'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tipo de Documento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tipo de Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Documento</p>
                  <p className="text-gray-900">
                    {paymentConfig.documentType === 'RUC' ? 'RUC' : 'DNI'}
                  </p>
                  {paymentConfig.documentNumber && (
                    <p className="text-gray-900 font-mono text-sm mt-1">
                      {paymentConfig.documentNumber}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón de Procesar */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleProcessPayment}
            size="lg"
            className="bg-sakura-red hover:bg-sakura-red/90 text-white px-8"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Procesar Pago
          </Button>
        </div>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sakura-red mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Procesando Pago</h2>
      <p className="text-gray-500">Por favor espera mientras procesamos tu pago...</p>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Pago Completado!</h2>
      <p className="text-gray-500 mb-6">El pago ha sido procesado exitosamente.</p>
      
      <div className="space-y-4 w-full max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">Total Pagado</p>
              <p className="text-2xl font-bold text-sakura-red">S/ {quote.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Cotización #{quote.id}</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex-1"
          >
            Imprimir Recibo
          </Button>
          <Button
            onClick={() => {
              setCurrentStep('summary');
              onBack();
            }}
            className="flex-1 bg-sakura-red hover:bg-sakura-red/90 text-white"
          >
            Nuevo Pago
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {currentStep === 'summary' && renderSummaryStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'completed' && renderCompletedStep()}
    </div>
  );
};

export default QuotePaymentProcessor; 