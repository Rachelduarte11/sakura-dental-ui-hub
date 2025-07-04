
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, FileText, Download, Calendar, Users, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

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

  // Mock data
  const transactions: Transaction[] = [
    {
      id: 1,
      date: '2024-01-15',
      patientName: 'Maria Antonieta Lugo',
      doctorName: 'Dr. Carlos Mendoza',
      service: 'Limpieza Dental',
      amount: 150.00,
      currency: 'Soles',
      paymentMethod: 'Efectivo',
      doctorPercentage: 60,
      clinicAmount: 60.00,
      doctorAmount: 90.00,
    },
    {
      id: 2,
      date: '2024-01-14',
      patientName: 'Carlos Mariano Justo',
      doctorName: 'Dra. Ana Rodriguez',
      service: 'Ortodoncia',
      amount: 850.00,
      currency: 'Soles',
      paymentMethod: 'Yape',
      doctorPercentage: 70,
      clinicAmount: 255.00,
      doctorAmount: 595.00,
    },
    {
      id: 3,
      date: '2024-01-13',
      patientName: 'Luis Fernando Castro',
      doctorName: 'Dr. Carlos Mendoza',
      service: 'Extracción',
      amount: 200.00,
      currency: 'Soles',
      paymentMethod: 'Tarjeta',
      doctorPercentage: 60,
      clinicAmount: 80.00,
      doctorAmount: 120.00,
    },
  ];

  const doctors = ['Dr. Carlos Mendoza', 'Dra. Ana Rodriguez', 'Dr. Miguel Torres'];
  const paymentMethods = ['Efectivo', 'Yape', 'Plin', 'Tarjeta', 'Transferencia'];

  const filteredTransactions = transactions.filter(t => {
    const doctorMatch = selectedDoctor === 'all' || t.doctorName === selectedDoctor;
    const paymentMatch = selectedPaymentMethod === 'all' || t.paymentMethod === selectedPaymentMethod;
    return doctorMatch && paymentMatch;
  });

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
      </div>
    </div>
  );
};

export default FinanceManagement;
