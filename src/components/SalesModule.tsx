
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Check,
  Clock,
  Search
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends Service {
  quantity: number;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
}

type SaleStep = 'services' | 'patient' | 'payment' | 'processing' | 'completed';
type PaymentMethod = 'cash' | 'card' | 'transfer';

const SalesModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SaleStep>('services');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [patientSearch, setPatientSearch] = useState('');

  // Mock data
  const services: Service[] = [
    { id: 1, name: 'Limpieza Dental', price: 80, category: 'Preventivo' },
    { id: 2, name: 'Empaste', price: 120, category: 'Restaurativo' },
    { id: 3, name: 'Extracción', price: 150, category: 'Cirugía' },
    { id: 4, name: 'Corona Dental', price: 300, category: 'Protésico' },
    { id: 5, name: 'Blanqueamiento', price: 200, category: 'Estético' },
    { id: 6, name: 'Endodoncia', price: 250, category: 'Especialidad' },
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

  const addToCart = (service: Service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId: number) => {
    const existingItem = cart.find(item => item.id === serviceId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === serviceId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== serviceId));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processSale = () => {
    setCurrentStep('processing');
    // Simulate SUNAT processing
    setTimeout(() => {
      setCurrentStep('completed');
    }, 3000);
  };

  const resetSale = () => {
    setCart([]);
    setSelectedPatient(null);
    setPaymentMethod('cash');
    setPatientSearch('');
    setCurrentStep('services');
  };

  const renderServicesStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Seleccionar Servicios</h2>
        {cart.length > 0 && (
          <Badge className="bg-sakura-red text-white">
            {cart.length} servicio{cart.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const cartItem = cart.find(item => item.id === service.id);
          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <span className="text-xl font-bold text-sakura-red">
                    S/ {service.price}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(service)}
                    className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                  {cartItem && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(service.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{cartItem.quantity}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="border-sakura-red/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Resumen de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium">S/ {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-sakura-red">S/ {getTotalAmount()}</span>
              </div>
            </div>
            <Button
              onClick={() => setCurrentStep('patient')}
              className="w-full mt-4 bg-sakura-red hover:bg-sakura-red-dark"
            >
              Registrar Venta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPatientStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Seleccionar Paciente</h2>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Buscar paciente por nombre o teléfono..."
          className="pl-10"
        />
      </div>

      {/* Patient List */}
      <div className="grid gap-3">
        {filteredPatients.map((patient) => (
          <Card 
            key={patient.id}
            className={`cursor-pointer transition-all ${
              selectedPatient?.id === patient.id 
                ? 'border-sakura-red bg-sakura-red/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                {selectedPatient?.id === patient.id && (
                  <Check className="h-5 w-5 text-sakura-red" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('services')}
          className="flex-1"
        >
          Volver
        </Button>
        <Button
          onClick={() => setCurrentStep('payment')}
          disabled={!selectedPatient}
          className="flex-1 bg-sakura-red hover:bg-sakura-red-dark disabled:opacity-50"
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Método de Pago</h2>

      {/* Payment Methods */}
      <div className="grid gap-3">
        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'cash' ? 'border-sakura-red bg-sakura-red/5' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('cash')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-6 w-6 text-sakura-red" />
              <div className="flex-1">
                <h3 className="font-medium">Efectivo</h3>
                <p className="text-sm text-gray-600">Pago en efectivo</p>
              </div>
              {paymentMethod === 'cash' && <Check className="h-5 w-5 text-sakura-red" />}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'card' ? 'border-sakura-red bg-sakura-red/5' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-sakura-red" />
              <div className="flex-1">
                <h3 className="font-medium">Tarjeta</h3>
                <p className="text-sm text-gray-600">Débito o crédito</p>
              </div>
              {paymentMethod === 'card' && <Check className="h-5 w-5 text-sakura-red" />}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'transfer' ? 'border-sakura-red bg-sakura-red/5' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('transfer')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-sakura-red" />
              <div className="flex-1">
                <h3 className="font-medium">Transferencia</h3>
                <p className="text-sm text-gray-600">Transferencia bancaria</p>
              </div>
              {paymentMethod === 'transfer' && <Check className="h-5 w-5 text-sakura-red" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sale Summary */}
      <Card className="border-sakura-red/20">
        <CardHeader>
          <CardTitle>Resumen de Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paciente:</span>
              <span className="font-medium">{selectedPatient?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Servicios:</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago:</span>
              <span className="capitalize">{paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-sakura-red">S/ {getTotalAmount()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('patient')}
          className="flex-1"
        >
          Volver
        </Button>
        <Button
          onClick={processSale}
          className="flex-1 bg-sakura-red hover:bg-sakura-red-dark"
        >
          Procesar Venta
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sakura-red"></div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando Venta</h2>
        <p className="text-gray-600">Generando boleta con SUNAT...</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Clock className="h-4 w-4 text-sakura-red" />
          <span className="text-sm text-sakura-red">En proceso</span>
        </div>
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Venta Completada!</h2>
        <p className="text-gray-600 mb-4">Boleta generada exitosamente (simulada)</p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Boleta de Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Paciente:</span>
                <span>{selectedPatient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">S/ {getTotalAmount()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <Badge className="bg-green-100 text-green-700">Boleta generada (simulada)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button
        onClick={resetSale}
        className="bg-sakura-red hover:bg-sakura-red-dark"
      >
        Nueva Venta
      </Button>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {currentStep === 'services' && renderServicesStep()}
      {currentStep === 'patient' && renderPatientStep()}
      {currentStep === 'payment' && renderPaymentStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'completed' && renderCompletedStep()}
    </div>
  );
};

export default SalesModule;
