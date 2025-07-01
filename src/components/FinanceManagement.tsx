
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, FileText, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  id: number;
  date: string;
  patientName: string;
  doctorName: string;
  service: string;
  amount: number;
  currency: 'Soles' | 'Dólares';
  doctorPercentage: number;
  clinicAmount: number;
  doctorAmount: number;
}

const FinanceManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

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
      doctorPercentage: 60,
      clinicAmount: 80.00,
      doctorAmount: 120.00,
    },
  ];

  const doctors = ['Dr. Carlos Mendoza', 'Dra. Ana Rodriguez', 'Dr. Miguel Torres'];

  const filteredTransactions = selectedDoctor === 'all' 
    ? transactions 
    : transactions.filter(t => t.doctorName === selectedDoctor);

  const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalClinicAmount = filteredTransactions.reduce((sum, t) => sum + t.clinicAmount, 0);
  const totalDoctorAmount = filteredTransactions.reduce((sum, t) => sum + t.doctorAmount, 0);

  const doctorSummary = doctors.map(doctor => {
    const doctorTransactions = filteredTransactions.filter(t => t.doctorName === doctor);
    const doctorTotal = doctorTransactions.reduce((sum, t) => sum + t.doctorAmount, 0);
    const transactionCount = doctorTransactions.length;
    return { doctor, total: doctorTotal, count: transactionCount };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sakura-gray-medium">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Finanzas</h1>
          <Button variant="outline" className="border-sakura-red text-sakura-red hover:bg-sakura-red/10">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
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
            <SelectTrigger className="w-full sm:w-48">
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
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardTitle className="text-sm font-medium">Para la Clínica</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                S/ {totalClinicAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((totalClinicAmount / totalIncome) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Para Doctores</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sakura-red">
                S/ {totalDoctorAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((totalDoctorAmount / totalIncome) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>

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
