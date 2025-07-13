
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Download,
  MessageCircle,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePaymentStore, useQuotationStore, usePatientStore, type Payment, type Quotation, type Patient } from '@/shared/stores';
import { toast } from 'sonner';

const PaymentManagement: React.FC = () => {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { 
    payments, 
    isLoading: paymentsLoading, 
    error: paymentsError, 
    fetchPayments, 
    createPayment, 
    clearError: clearPaymentsError 
  } = usePaymentStore();

  const { 
    quotations, 
    isLoading: quotationsLoading, 
    error: quotationsError, 
    fetchQuotations, 
    clearError: clearQuotationsError 
  } = useQuotationStore();

  const { 
    patients, 
    fetchPatients 
  } = usePatientStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPayments();
    fetchQuotations();
    fetchPatients();
  }, [fetchPayments, fetchQuotations, fetchPatients]);

  // Manejar errores
  useEffect(() => {
    if (paymentsError) {
      toast.error(paymentsError);
      clearPaymentsError();
    }
    if (quotationsError) {
      toast.error(quotationsError);
      clearQuotationsError();
    }
  }, [paymentsError, quotationsError, clearPaymentsError, clearQuotationsError]);

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo', icon: Banknote },
    { value: 'yape', label: 'Yape', icon: Smartphone },
    { value: 'plin', label: 'Plin', icon: Smartphone },
    { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
    { value: 'transferencia', label: 'Transferencia', icon: CreditCard },
  ];

  const getStatusBadge = (status: Quotation['status']) => {
    switch (status) {
      case 'PAGADA':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">✅ Pagado</Badge>;
      case 'ACEPTADA':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">⚠️ Aceptada</Badge>;
      case 'PENDIENTE':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">❌ Pendiente</Badge>;
      case 'ANULADA':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">❌ Anulada</Badge>;
      default:
        return null;
    }
  };

  const calculateQuotationTotals = (quotation: Quotation) => {
    const total = quotation.total_amount || 0;
    const paid = payments
      .filter(p => p.quotation_id === quotation.quotation_id)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pending = total - paid;
    
    return { total, paid, pending };
  };

  const handleRegisterPayment = async () => {
    if (!selectedQuotation || !paymentAmount || !paymentMethod) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const amount = parseFloat(paymentAmount);
    const { pending } = calculateQuotationTotals(selectedQuotation);
    
    if (amount <= 0 || amount > pending) {
      toast.error('Monto inválido');
      return;
    }

    try {
      const newPayment: Omit<Payment, 'payment_id'> = {
        quotation_id: selectedQuotation.quotation_id,
        amount: amount,
        payment_date: paymentDate,
        status: 'CONFIRMADO',
        created_by: 1, // TODO: Get from auth store
        method_id: 1, // TODO: Map payment method to method_id
        balance_remaining: 0 // TODO: Calculate remaining balance
      };

      await createPayment(newPayment);
      toast.success(`Pago de S/ ${amount} registrado exitosamente`);
      setIsPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentMethod('');
      setSelectedQuotation(null);
    } catch (error) {
      toast.error('Error al registrar el pago');
    }
  };

  const handleSendReceipt = (quotation: Quotation) => {
    const patient = patients.find(p => p.patient_id === quotation.patient_id);
    if (patient?.phone) {
      toast.success(`Enviando comprobante por WhatsApp a ${patient.phone}`);
    } else {
      toast.error('No se encontró el número de teléfono del paciente');
    }
  };

  const handleDownloadReceipt = (quotation: Quotation) => {
    const patient = patients.find(p => p.patient_id === quotation.patient_id);
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente';
    toast.success(`Descargando comprobante de ${patientName}`);
  };

  const isLoading = paymentsLoading || quotationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando pagos...</span>
        </div>
      </div>
    );
  }

  // Calcular totales
  const totalPending = quotations.reduce((sum, q) => {
    const { pending } = calculateQuotationTotals(q);
    return sum + pending;
  }, 0);

  const totalPaid = quotations.reduce((sum, q) => {
    const { paid } = calculateQuotationTotals(q);
    return sum + paid;
  }, 0);

  const activeQuotations = quotations.filter(q => {
    const { pending } = calculateQuotationTotals(q);
    return pending > 0;
  });

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
                    S/ {totalPending.toFixed(2)}
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
                    S/ {totalPaid.toFixed(2)}
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
                    {activeQuotations.length}
                  </p>
                </div>
                <User className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations List */}
        <div className="space-y-4">
          {quotations.map((quotation) => {
            const { total, paid, pending } = calculateQuotationTotals(quotation);
            const patient = patients.find(p => p.patient_id === quotation.patient_id);
            
            return (
              <Card key={quotation.quotation_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                                              <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente'}</h3>
                          {getStatusBadge(quotation.status)}
                        </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </p>
                        <p>Cotización ID: {quotation.quotation_id}</p>
                      </div>
                      
                      <div className="flex gap-4 mt-3 text-sm">
                        <span>Total: <span className="font-medium">S/ {total.toFixed(2)}</span></span>
                        <span>Pagado: <span className="font-medium text-green-600">S/ {paid.toFixed(2)}</span></span>
                        <span>Pendiente: <span className="font-medium text-red-600">S/ {pending.toFixed(2)}</span></span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {pending > 0 && (
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedQuotation(quotation)}
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
                                <p className="font-medium">{patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente'}</p>
                                <p className="text-sm text-gray-600">Pendiente: S/ {pending.toFixed(2)}</p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="amount">Monto Recibido</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="0.00"
                                  max={pending}
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
                        onClick={() => handleDownloadReceipt(quotation)}
                        className="border-gray-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReceipt(quotation)}
                        className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
