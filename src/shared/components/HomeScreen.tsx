
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Settings, Users, Package, Calculator, UserCheck, DollarSign, AlertTriangle, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { usePaymentStore, useQuotationStore, usePatientStore, useServiceStore } from '@/shared/stores';
import { toast } from 'sonner';

interface HomeScreenProps {
  onNavigateToPatients: () => void;
  onNavigateToServices: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToPatients, onNavigateToServices }) => {
  const [searchQuery, setSearchQuery] = useState('');

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
    patients, 
    isLoading: patientsLoading, 
    error: patientsError, 
    fetchPatients, 
    clearError: clearPatientsError 
  } = usePatientStore();

  const { 
    services, 
    isLoading: servicesLoading, 
    error: servicesError, 
    fetchServices, 
    clearError: clearServicesError 
  } = useServiceStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPayments();
    fetchQuotations();
    fetchPatients();
    fetchServices();
  }, [fetchPayments, fetchQuotations, fetchPatients, fetchServices]);

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
    if (patientsError) {
      toast.error(patientsError);
      clearPatientsError();
    }
    if (servicesError) {
      toast.error(servicesError);
      clearServicesError();
    }
  }, [paymentsError, quotationsError, patientsError, servicesError, clearPaymentsError, clearQuotationsError, clearPatientsError, clearServicesError]);

  // Calcular métricas del dashboard
  const todayIncome = payments
    .filter(payment => {
      const today = new Date().toDateString();
      return new Date(payment.payment_date).toDateString() === today;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalDebt = quotations
    .filter(quotation => quotation.status === 'PENDIENTE')
    .reduce((sum, quotation) => sum + quotation.total_amount, 0);

  const pendingPatientsCount = quotations
    .filter(quotation => quotation.status === 'PENDIENTE')
    .length;

  // Top tratamientos basados en cotizaciones
  const topTreatments = services
    .map(service => {
      const serviceQuotations = quotations.filter(q => 
        q.items?.some(item => item.service_id === service.service_id)
      );
      return {
        name: service.name,
        count: serviceQuotations.length,
        amount: serviceQuotations.reduce((sum, q) => sum + q.total_amount, 0)
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Datos recientes
  const recentPayments = payments
    .slice(0, 3)
    .map(payment => {
      const quotation = quotations.find(q => q.quotation_id === payment.quotation_id);
      const patient = patients.find(p => p.patient_id === (quotation?.patient_id || 0));
      return {
        id: payment.payment_id,
        name: patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente',
        amount: payment.amount,
        currency: "Soles",
        type: "payment",
        hasDebt: false
      };
    });

  const recentQuotes = quotations
    .slice(0, 3)
    .map(quotation => {
      const patient = patients.find(p => p.patient_id === quotation.patient_id);
      return {
        id: quotation.quotation_id,
        name: patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente',
        amount: quotation.total_amount,
        currency: "Soles",
        type: "quote",
        hasDebt: quotation.status === 'PENDIENTE'
      };
    });

  const isLoading = paymentsLoading || quotationsLoading || patientsLoading || servicesLoading;

  const TransactionCard = ({ item }: { item: typeof recentPayments[0] }) => (
    <Card className="mb-3 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1"
              >
                {item.currency}
              </Badge>
              {item.hasDebt && (
                <Badge 
                  variant="secondary" 
                  className="bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1"
                >
                  Pendiente
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">S/ {item.amount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold" style={{ color: '#FF6E63' }}>Home</h1>
          </div>
        </div>
      </div>

      {/* Dashboard Metrics - Desktop */}
      <div className="hidden md:block p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cobrado Hoy</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/ {todayIncome.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% vs ayer
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
                  <p className="text-sm font-medium text-gray-600">Monto en Deuda</p>
                  <p className="text-2xl font-bold text-red-600">
                    S/ {totalDebt.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pendingPatientsCount} pacientes
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Pendientes</p>
                  <p className="text-2xl font-bold text-sakura-red">
                    {pendingPatientsCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    Con pago pendiente
                  </p>
                </div>
                <Users className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Tratamiento</p>
                  <p className="text-lg font-bold text-sakura-red">
                    {topTreatments[0]?.name || 'Sin datos'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {topTreatments[0]?.count || 0} cotizaciones
                  </p>
                </div>
                <FileText className="h-8 w-8 text-sakura-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Treatments */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Top 3 Tratamientos Cotizados</h3>
            <div className="grid grid-cols-3 gap-4">
              {topTreatments.map((treatment, index) => (
                <div key={treatment.name} className="p-3 rounded-lg bg-gradient-to-r from-sakura-red/10 to-sakura-red/5 border border-sakura-red/20">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-sakura-red text-white text-xs">#{index + 1}</Badge>
                    <span className="font-bold text-sakura-red text-sm">S/ {treatment.amount.toFixed(0)}</span>
                  </div>
                  <h4 className="font-medium text-sm">{treatment.name}</h4>
                  <p className="text-xs text-gray-600">{treatment.count} cotizaciones</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Quick Access - Only visible on mobile */}
      <div className="md:hidden p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Gestión rápida</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300"
            style={{ borderColor: '#FF6E63', color: '#FF6E63' }}
            onClick={onNavigateToServices}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Servicios</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300"
            style={{ borderColor: '#FF6E63', color: '#FF6E63' }}
            onClick={onNavigateToPatients}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Pacientes</span>
          </Button>
        </div>

        {/* Mobile Dashboard Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs text-gray-600">Hoy</p>
                <p className="text-lg font-bold text-green-600">S/ {todayIncome.toFixed(0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs text-gray-600">Deuda</p>
                <p className="text-lg font-bold text-red-600">S/ {totalDebt.toFixed(0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Pagos Recientes</h2>
                <Badge className="bg-green-100 text-green-700">3</Badge>
              </div>
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <TransactionCard key={payment.id} item={payment} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay pagos recientes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Cotizaciones Recientes</h2>
                <Badge className="bg-blue-100 text-blue-700">3</Badge>
              </div>
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <TransactionCard key={quote.id} item={quote} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay cotizaciones recientes
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
