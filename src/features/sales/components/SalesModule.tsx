
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Check,
  Clock,
  Search,
  ChevronDown,
  User,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import ConstanciaPago from './ConstanciaPago';

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
  medicalHistory: string;
  dni: string;
}

type SaleStep = 'services' | 'document-type' | 'payment' | 'processing' | 'completed' | 'constancia';
type PaymentMethod = 'cash' | 'card' | 'transfer';

const SalesModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SaleStep>('services');
  const [documentType, setDocumentType] = useState<'boleta' | 'factura'>('boleta');
  const [ruc, setRuc] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [patientSearch, setPatientSearch] = useState('');
  const [cartClientSearch, setCartClientSearch] = useState('');
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(true);
  const [showConstancia, setShowConstancia] = useState(false);

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
    { id: 1, name: 'María García López', phone: '999-123-456', email: 'maria@email.com', medicalHistory: 'MH001', dni: '12345678' },
    { id: 2, name: 'Carlos Rodríguez Pérez', phone: '999-789-123', email: 'carlos@email.com', medicalHistory: 'MH002', dni: '87654321' },
    { id: 3, name: 'Ana Martínez Silva', phone: '999-456-789', email: 'ana@email.com', medicalHistory: 'MH003', dni: '11223344' },
    { id: 4, name: 'Luis Fernández Torres', phone: '999-321-654', email: 'luis@email.com', medicalHistory: 'MH004', dni: '44332211' },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone.includes(patientSearch) ||
    patient.medicalHistory.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredCartPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(cartClientSearch.toLowerCase()) ||
    patient.medicalHistory.toLowerCase().includes(cartClientSearch.toLowerCase())
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
    // Simulate processing
    setTimeout(() => {
      setCurrentStep('constancia');
    }, 2000);
  };

  const emitComprobante = () => {
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
    setDocumentType('boleta');
    setRuc('');
    setShowConstancia(false);
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
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${cart.length > 0 && isCartSidebarOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}>
        {services.map((service) => {
          const cartItem = cart.find(item => item.id === service.id);
          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs font-regular text-gray-500">
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
    </div>
  );

  const renderDocumentTypeStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tipo de Documento</h2>
      
      {/* Document Type Selection */}
      <div className="grid gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            documentType === 'boleta' ? 'border-sakura-red bg-sakura-red/5' : 'hover:shadow-md'
          }`}
          onClick={() => setDocumentType('boleta')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">B</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Boleta</h3>
                <p className="text-gray-600">Documento de venta simple</p>
              </div>
              {documentType === 'boleta' && <Check className="h-6 w-6 text-sakura-red" />}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            documentType === 'factura' ? 'border-sakura-red bg-sakura-red/5' : 'hover:shadow-md'
          }`}
          onClick={() => setDocumentType('factura')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">F</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Factura</h3>
                <p className="text-gray-600">Documento con RUC</p>
              </div>
              {documentType === 'factura' && <Check className="h-6 w-6 text-sakura-red" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RUC Input for Factura */}
      {documentType === 'factura' && (
        <Card className="border-sakura-red/20">
          <CardHeader>
            <CardTitle className="text-lg">Datos de Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  RUC del Cliente
                </label>
                <Input
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  placeholder="Ingrese el RUC (11 dígitos)"
                  className="w-full"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El RUC debe tener 11 dígitos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Info Display */}
      {selectedPatient && (
        <Card className="border-sakura-red/20 bg-sakura-red/5">
          <CardHeader>
            <CardTitle className="text-lg">Cliente Seleccionado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{selectedPatient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Historia Clínica:</span>
                <span>{selectedPatient.medicalHistory}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">DNI:</span>
                <span>{selectedPatient.dni}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Teléfono:</span>
                <span>{selectedPatient.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{selectedPatient.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          disabled={documentType === 'factura' && ruc.length !== 11}
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
              <span>DNI:</span>
              <span className="font-medium">{selectedPatient?.dni}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipo de documento:</span>
              <span className="capitalize">{documentType === 'boleta' ? 'Boleta' : 'Factura'}</span>
            </div>
            {documentType === 'factura' && (
              <div className="flex justify-between">
                <span>RUC:</span>
                <span className="font-medium">{ruc}</span>
              </div>
            )}
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
          onClick={() => setCurrentStep('document-type')}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Comprobante Emitido!</h2>
        <p className="text-gray-600 mb-4">
          {documentType === 'boleta' ? 'Boleta' : 'Factura'} generada exitosamente con SUNAT
        </p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              {documentType === 'boleta' ? 'Boleta de Venta' : 'Factura de Venta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Paciente:</span>
                <span>{selectedPatient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>DNI:</span>
                <span>{selectedPatient?.dni}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo de documento:</span>
                <span className="capitalize">{documentType === 'boleta' ? 'Boleta' : 'Factura'}</span>
              </div>
              {documentType === 'factura' && (
                <div className="flex justify-between">
                  <span>RUC:</span>
                  <span>{ruc}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">S/ {getTotalAmount()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <Badge className="bg-green-100 text-green-700">
                  {documentType === 'boleta' ? 'Boleta emitida' : 'Factura emitida'}
                </Badge>
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

  const renderConstanciaStep = () => {
    return (
      <ConstanciaPago
        selectedPatient={selectedPatient}
        cart={cart}
        paymentMethod={paymentMethod}
        documentType={documentType}
        ruc={ruc}
        onBack={() => setCurrentStep('payment')}
        onEmitComprobante={emitComprobante}
      />
    );
  };

  // Fixed Cart Sidebar Component
  const renderCartSidebar = () => {
    if (cart.length === 0) return null;

    if (!isCartSidebarOpen) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsCartSidebarOpen(true)}
            className="relative bg-sakura-red hover:bg-sakura-red-dark text-white rounded-full w-14 h-14 shadow-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
              {cart.length}
            </Badge>
          </Button>
        </div>
      );
    }

    return (
      <div className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-sakura-red/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-sakura-red" />
                <h2 className="text-lg font-semibold text-gray-800">Carrito de Compras</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartSidebarOpen(false)}
                className="h-8 w-8 p-0 hover:bg-sakura-red/10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Client Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Seleccionar Cliente</label>
              <div className="relative">
                <Input
                  value={cartClientSearch}
                  onChange={(e) => {
                    setCartClientSearch(e.target.value);
                    setIsCartDropdownOpen(true);
                    // Clear selected patient if search doesn't match
                    if (selectedPatient && !e.target.value.toLowerCase().includes(selectedPatient.name.toLowerCase())) {
                      setSelectedPatient(null);
                    }
                  }}
                  onFocus={() => setIsCartDropdownOpen(true)}
                  onBlur={() => {
                    // Delay closing to allow click on dropdown items
                    setTimeout(() => setIsCartDropdownOpen(false), 200);
                  }}
                  placeholder="Buscar por nombre o historia clínica..."
                  className="pr-8"
                />
                <User className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Client Dropdown */}
              {isCartDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {cartClientSearch ? (
                    // Show filtered results when searching
                    filteredCartPatients.length > 0 ? (
                      filteredCartPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setCartClientSearch(patient.name);
                            setIsCartDropdownOpen(false);
                          }}
                        >
                          <div className="font-medium text-sm">{patient.name}</div>
                          <div className="text-xs text-gray-500">
                            Historia: {patient.medicalHistory} | DNI: {patient.dni} | Tel: {patient.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No se encontraron resultados
                      </div>
                    )
                  ) : (
                    // Show all patients when no search
                    patients.map((patient) => (
                      <div
                        key={patient.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setCartClientSearch(patient.name);
                          setIsCartDropdownOpen(false);
                        }}
                      >
                        <div className="font-medium text-sm">{patient.name}</div>
                        <div className="text-xs text-gray-500">
                          Historia: {patient.medicalHistory} | DNI: {patient.dni} | Tel: {patient.phone}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Selected Client Display */}
              {selectedPatient && (
                <div className="mt-2 p-2 bg-sakura-red/5 border border-sakura-red/20 rounded-md">
                  <div className="text-sm font-medium">{selectedPatient.name}</div>
                  <div className="text-xs text-gray-600">
                    Historia: {selectedPatient.medicalHistory} | DNI: {selectedPatient.dni}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-2 flex-1">
              <h3 className="text-sm font-medium text-gray-700">Servicios Seleccionados</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">#{item.quantity} ({item.name})</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">S/ {item.price * item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {/* Total */}
            <div className="mb-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-sakura-red">S/ {getTotalAmount()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                              <Button
                  onClick={() => setCurrentStep('document-type')}
                  disabled={!selectedPatient}
                  className="w-full bg-sakura-red hover:bg-sakura-red-dark disabled:opacity-50"
                >
                  Continuar Compra
                </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCart([]);
                  setSelectedPatient(null);
                  setCartClientSearch('');
                  setIsCartDropdownOpen(false);
                  setIsCartSidebarOpen(false);
                }}
                className="w-full"
              >
                Limpiar Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 w-full">
      <div className={`${cart.length > 0 && isCartSidebarOpen ? 'pr-80' : ''} transition-all duration-300`}>
        {currentStep === 'services' && renderServicesStep()}
        {currentStep === 'document-type' && renderDocumentTypeStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'completed' && renderCompletedStep()}
        {currentStep === 'constancia' && renderConstanciaStep()}
      </div>
      {renderCartSidebar()}
    </div>
  );
};

export default SalesModule;
