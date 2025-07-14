import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { 
  CreditCard,
  Wallet,
  Smartphone,
  Building2,
  ArrowLeft,
  ArrowRight,
  User,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentConfigurationProps {
  quote: {
    id: number;
    total: number;
    services: Array<{
      id: number;
      name: string;
      price: number;
    }>;
  };
  patient: {
    name: string;
    phone: string;
    email: string;
  };
  onBack: () => void;
  onContinue: (paymentConfig: PaymentConfig) => void;
}

export interface PaymentConfig {
  quotationId: number;
  methodId: number;
  amount: number;
  balanceRemaining: number;
  createdBy: number;
  documentType?: 'RUC';
  documentNumber?: string;
}

const PaymentConfiguration: React.FC<PaymentConfigurationProps> = ({
  quote,
  patient,
  onBack,
  onContinue
}) => {
  const [documentType, setDocumentType] = useState<'DNI' | 'RUC'>('DNI');
  const [rucNumber, setRucNumber] = useState('');
  const paymentMethods = [
    { id: 1, value: 'efectivo', label: 'Efectivo', icon: Wallet },
    { id: 2, value: 'tarjeta_credito', label: 'Tarjeta de Crédito', icon: CreditCard },
    { id: 3, value: 'tarjeta_debito', label: 'Tarjeta de Débito', icon: CreditCard },
    { id: 4, value: 'transferencia', label: 'Transferencia Bancaria', icon: Building2 },
    { id: 5, value: 'yape', label: 'Yape', icon: Smartphone },
    { id: 6, value: 'plin', label: 'Plin', icon: Smartphone },
  ];

  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0].value);

  const handleContinue = () => {
    // Validaciones
    if (documentType === 'RUC' && !rucNumber.trim()) {
      toast.error('Por favor ingresa el número de RUC');
      return;
    }

    if (documentType === 'RUC' && rucNumber.length !== 11) {
      toast.error('El RUC debe tener 11 dígitos');
      return;
    }

    // Buscar el método de pago seleccionado
    const selectedMethod = paymentMethods.find(m => m.value === paymentMethod);
    const methodId = selectedMethod ? selectedMethod.id : null;
    if (!methodId) {
      toast.error('Método de pago inválido');
      return;
    }

    // NOTA: El campo documentType solo se usa para distinguir pagos con factura (RUC).
    const paymentConfig: PaymentConfig = {
      quotationId: quote.id,
      methodId,
      amount: quote.total,
      balanceRemaining: 0.00,
      createdBy: 1,
      ...(documentType === 'RUC'
        ? { documentType: 'RUC', documentNumber: rucNumber }
        : {})
    };

    onContinue(paymentConfig);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-sakura-red hover:text-sakura-red-dark"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Configuración de Pago</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de la Cotización */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Cotización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Cotización #{quote.id}</h3>
              <p className="text-sm text-gray-600">Paciente: {patient.name}</p>
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
          {/* Tipo de Documento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={documentType}
                onValueChange={(value) => setDocumentType(value as 'DNI' | 'RUC')}
                className="space-y-3"
              >
                <div
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    documentType === 'DNI'
                      ? 'border-sakura-red bg-sakura-red/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDocumentType('DNI')}
                >
                  <RadioGroupItem value="DNI" id="DNI" />
                  <div className="flex items-center space-x-3 flex-1">
                    <User className="h-5 w-5 text-sakura-red" />
                    <div>
                      <Label htmlFor="DNI" className="font-medium cursor-pointer">
                        DNI
                      </Label>
                      <p className="text-sm text-gray-500">Documento de identidad</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    documentType === 'RUC'
                      ? 'border-sakura-red bg-sakura-red/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDocumentType('RUC')}
                >
                  <RadioGroupItem value="RUC" id="RUC" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Building className="h-5 w-5 text-sakura-red" />
                    <div>
                      <Label htmlFor="RUC" className="font-medium cursor-pointer">
                        RUC
                      </Label>
                      <p className="text-sm text-gray-500">Registro único de contribuyentes</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Input RUC (solo si se selecciona RUC) */}
          {documentType === 'RUC' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Número de RUC</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="rucNumber">RUC *</Label>
                  <Input
                    id="rucNumber"
                    value={rucNumber}
                    onChange={(e) => setRucNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="11 dígitos"
                    maxLength={11}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresa solo números (11 dígitos)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Método de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
                className="space-y-3"
              >
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.value
                          ? 'border-sakura-red bg-sakura-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <RadioGroupItem value={method.value} id={method.value} />
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="h-5 w-5 text-sakura-red" />
                        <div>
                          <Label htmlFor={method.value} className="font-medium cursor-pointer">
                            {method.label}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {method.label === 'Yape' || method.label === 'Plin'
                              ? 'Pago móvil'
                              : method.label === 'Transferencia Bancaria'
                              ? 'Transferencia bancaria'
                              : method.label === 'Efectivo'
                              ? 'Pago en efectivo'
                              : 'Tarjeta de crédito/débito'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <Button
          onClick={handleContinue}
          className="bg-sakura-red hover:bg-sakura-red/90 text-white"
        >
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfiguration; 