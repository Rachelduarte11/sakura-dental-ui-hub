
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, FileText, Download, Calendar, Users, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { usePaymentStore, useQuotationStore, useEmployeeStore, usePatientStore, type Payment, type Quotation, type Employee, type Patient } from '@/shared/stores';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  date: string;
  patientName: string;
  doctorName: string;
  service: string;
  amount: number;
  currency: 'Soles' | 'Dólares';
  paymentMethod: string;
  doctorPercentage: number;
  clinicAmount: number;
  doctorAmount: number;
}

const FinanceManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');

  const { 
    payments, 
    isLoading: paymentsLoading, 
    error: paymentsError, 
    fetchPayments, 
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
    employees, 
    isLoading: employeesLoading, 
    error: employeesError, 
    fetchEmployees, 
    clearError: clearEmployeesError 
  } = useEmployeeStore();

  const { 
    patients, 
    isLoading: patientsLoading, 
    error: patientsError, 
    fetchPatients, 
    clearError: clearPatientsError 
  } = usePatientStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPayments();
    fetchQuotations();
    fetchEmployees();
    fetchPatients();
  }, [fetchPayments, fetchQuotations, fetchEmployees, fetchPatients]);

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
    if (employeesError) {
      toast.error(employeesError);
      clearEmployeesError();
    }
    if (patientsError) {
      toast.error(patientsError);
      clearPatientsError();
    }
  }, [paymentsError, quotationsError, employeesError, patientsError, clearPaymentsError, clearQuotationsError, clearEmployeesError, clearPatientsError]);

  // Crear transacciones combinando pagos y cotizaciones
  const transactions = payments.map(payment => {
    const quotation = quotations.find(q => q.quotation_id === payment.quotation_id);
    const patient = patients.find(p => p.patient_id === (quotation?.patient_id || 0));
    
    return {
      id: payment.payment_id,
      date: payment.payment_date,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente',
      doctorName: 'Doctor Asignado', // Mock data
      service: 'Servicio Dental',
      amount: payment.amount,
      currency: 'Soles',
      paymentMethod: 'Efectivo', // Mock data
      doctorPercentage: 60, // Mock data
      clinicAmount: payment.amount * 0.4, // Mock calculation
      doctorAmount: payment.amount * 0.6, // Mock calculation
    };
  });

  const doctors = employees.map(emp => `${emp.first_name} ${emp.last_name}`);
  const paymentMethods = ['Efectivo', 'Yape', 'Plin', 'Tarjeta', 'Transferencia'];

  const filteredTransactions = transactions.filter(t => {
    const doctorMatch = selectedDoctor === 'all' || t.doctorName === selectedDoctor;
    const paymentMatch = selectedPaymentMethod === 'all' || t.paymentMethod === selectedPaymentMethod;
    return doctorMatch && paymentMatch;
  });

  const isLoading = paymentsLoading || quotationsLoading || employeesLoading || patientsLoading;

  const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalClinicAmount = filteredTransactions.reduce((sum, t) => sum + t.clinicAmount, 0);
  const totalDoctorAmount = filteredTransactions.reduce((sum, t) => sum + t.doctorAmount, 0);

  // KPIs adicionales
  const todayIncome = 1250.00; // Mock data
  const activeDebts = 3450.00; // Mock data
  const pendingPatients = 8; // Mock data
  const topTreatments = [
    { name: 'Ortodoncia', count: 12, amount: 6000 },
    { name: 'Blanqueamiento', count: 8, amount: 1600 },
    { name: 'Limpieza Dental', count: 15, amount: 1200 },
  ];

  const doctorSummary = doctors.map(doctor => {
    const doctorTransactions = filteredTransactions.filter(t => t.doctorName === doctor);
    const doctorTotal = doctorTransactions.reduce((sum, t) => sum + t.doctorAmount, 0);
    const transactionCount = doctorTransactions.length;
    return { doctor, total: doctorTotal, count: transactionCount };
  });

  const paymentMethodSummary = paymentMethods.map(method => {
    const methodTransactions = filteredTransactions.filter(t => t.paymentMethod === method);
    const methodTotal = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = methodTransactions.length;
    return { method, total: methodTotal, count: transactionCount };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Reportes Financieros</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="border-sakura-red text-sakura-red hover:bg-sakura-red/10">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" className="border-sakura-red text-sakura-red hover:bg-sakura-red/10">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
            <span className="ml-2 text-sakura-gray">Cargando reportes financieros...</span>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar doctor" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todos los Doctores</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Método de pago" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todos los Métodos</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPIs Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                S/ {todayIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15% vs ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deudas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                S/ {activeDebts.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingPatients} pacientes pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                S/ {totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cotizaciones Emitidas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sakura-red">
                24
              </div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorSummary.map((summary) => (
                  <div key={summary.doctor} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <h3 className="font-medium">{summary.doctor}</h3>
                      <p className="text-sm text-gray-600">{summary.count} tratamientos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sakura-red">S/ {summary.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Comisión</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodSummary.filter(p => p.count > 0).map((summary) => (
                  <div key={summary.method} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <h3 className="font-medium">{summary.method}</h3>
                      <p className="text-sm text-gray-600">{summary.count} transacciones</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">S/ {summary.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {((summary.total / totalIncome) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Treatments */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Tratamientos Cotizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTreatments.map((treatment, index) => (
                <div key={treatment.name} className="p-4 rounded-lg bg-gradient-to-r from-sakura-red/10 to-sakura-red/5 border border-sakura-red/20">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-sakura-red text-white">#{index + 1}</Badge>
                    <span className="font-bold text-sakura-red">S/ {treatment.amount.toFixed(0)}</span>
                  </div>
                  <h3 className="font-medium">{treatment.name}</h3>
                  <p className="text-sm text-gray-600">{treatment.count} cotizaciones</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Para la Clínica</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                S/ {totalClinicAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalIncome > 0 ? ((totalClinicAmount / totalIncome) * 100).toFixed(1) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Para Doctores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sakura-red">
                S/ {totalDoctorAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalIncome > 0 ? ((totalDoctorAmount / totalIncome) * 100).toFixed(1) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {filteredTransactions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                En el período seleccionado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto Total</TableHead>
                    <TableHead>% Doctor</TableHead>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Doctor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.patientName}</TableCell>
                      <TableCell>{transaction.doctorName}</TableCell>
                      <TableCell>{transaction.service}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={
                            transaction.currency === 'Soles' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }>
                            {transaction.currency}
                          </Badge>
                          <span className="font-medium">
                            {transaction.currency === 'Soles' ? 'S/' : '$'} {transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.doctorPercentage}%</TableCell>
                      <TableCell className="text-blue-600 font-medium">
                        S/ {transaction.clinicAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sakura-red font-medium">
                        S/ {transaction.doctorAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceManagement;
