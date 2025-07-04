
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Download,
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quote {
  id: number;
  patientName: string;
  patientPhone: string;
  date: string;
  total: number;
  paid: number;
  pending: number;
  status: 'pending' | 'partial' | 'paid';
  treatments: string[];
}

interface Payment {
  id: number;
  quoteId: number;
  amount: number;
  method: string;
  date: string;
  receipt?: string;
}

const PaymentManagement: React.FC = () => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Mock data
  const quotes: Quote[] = [
    {
      id: 1,
      patientName: 'María García López',
      patientPhone: '999-123-456',
      date: '2024-01-15',
      total: 850.00,
      paid: 300.00,
      pending: 550.00,
      status: 'partial',
      treatments: ['Limpieza Dental', 'Empaste']
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez Pérez',
      patientPhone: '999-789-123',
      date: '2024-01-14',
      total: 1200.00,
      paid: 0.00,
      pending: 1200.00,
      status: 'pending',
      treatments: ['Ortodoncia', 'Blanqueamiento']
    },
    {
      id: 3,
      patientName: 'Ana Martínez Silva',
      patientPhone: '999-456-789',
      date: '2024-01-13',
      total: 450.00,
      paid: 450.00,
      pending: 0.00,
      status: 'paid',
      treatments: ['Extracción']
    },
    {
      id: 4,
      patientName: 'Luis Fernández Torres',
      patientPhone: '999-321-654',
      date: '2024-01-12',
      total: 600.00,
      paid: 200.00,
      pending: 400.00,
      status: 'partial',
      treatments: ['Corona Dental']
    }
  ];

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo', icon: Banknote },
    { value: 'yape', label: 'Yape', icon: Smartphone },
    { value: 'plin', label: 'Plin', icon: Smartphone },
    { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
    { value: 'transferencia', label: 'Transferencia', icon: CreditCard },
  ];

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">✅ Pagado</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">⚠️ Parcial</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">❌ Pendiente</Badge>;
      default:
        return null;
    }
  };

  const handleRegisterPayment = () => {
    if (!selectedQuote || !paymentAmount || !paymentMethod) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedQuote.pending) {
      alert('Monto inválido');
      return;
    }

    // Simular registro de pago
    alert(`Pago de S/ ${amount} registrado exitosamente`);
    setIsPaymentDialogOpen(false);
    setPaymentAmount('');
    setPaymentMethod('');
    setSelectedQuote(null);
  };

  const handleSendReceipt = (quote: Quote) => {
    alert(`Enviando comprobante por WhatsApp a ${quote.patientPhone}`);
  };

  const handleDownloadReceipt = (quote: Quote) => {
    alert(`Descargando comprobante de ${quote.patientName}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Gestión de Pagos</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendiente</p>
                  <p className="text-2xl font-bold text-red-600">
                    S/ {quotes.reduce((sum, q) => sum + q.pending, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cobrado</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/ {quotes.reduce((sum, q) => sum + q.paid, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cotizaciones Activas</p>
                  <p className="text-2xl font-bold text-sakura-red">
                    {quotes.filter(q => q.status !== 'paid').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotes List */}
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{quote.patientName}</h3>
                      {getStatusBadge(quote.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {quote.date}
                      </p>
                      <p>Tratamientos: {quote.treatments.join(', ')}</p>
                    </div>
                    
                    <div className="flex gap-4 mt-3 text-sm">
                      <span>Total: <span className="font-medium">S/ {quote.total.toFixed(2)}</span></span>
                      <span>Pagado: <span className="font-medium text-green-600">S/ {quote.paid.toFixed(2)}</span></span>
                      <span>Pendiente: <span className="font-medium text-red-600">S/ {quote.pending.toFixed(2)}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {quote.status !== 'paid' && (
                      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedQuote(quote)}
                            className="bg-sakura-red hover:bg-sakura-red/90"
                            size="sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Registrar Pago
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Registrar Pago</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">{selectedQuote?.patientName}</p>
                              <p className="text-sm text-gray-600">Pendiente: S/ {selectedQuote?.pending.toFixed(2)}</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="amount">Monto Recibido</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="0.00"
                                max={selectedQuote?.pending || 0}
                                min="0"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="method">Método de Pago</Label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar método" />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                      <div className="flex items-center gap-2">
                                        <method.icon className="h-4 w-4" />
                                        {method.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="date">Fecha</Label>
                              <Input
                                id="date"
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                              />
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={() => setIsPaymentDialogOpen(false)}
                                variant="outline"
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleRegisterPayment}
                                className="flex-1 bg-sakura-red hover:bg-sakura-red/90"
                              >
                                Registrar Pago
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(quote)}
                      className="border-gray-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendReceipt(quote)}
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
