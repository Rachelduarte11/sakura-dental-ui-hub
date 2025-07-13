"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  DollarSign,
  User,
  Stethoscope,
  Loader2
} from 'lucide-react';
import { usePatientStore, usePaymentStore, useQuotationStore, type Patient, type Payment, type Quotation } from '@/shared/stores';
import { toast } from 'sonner';

interface PatientProfileProps {
  patientId: number;
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patientId, onBack }) => {
  const { 
    selectedPatient, 
    isLoading: patientLoading, 
    error: patientError, 
    fetchPatientById, 
    clearError: clearPatientError 
  } = usePatientStore();

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

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPatientById(patientId);
    fetchPayments();
    fetchQuotations();
  }, [patientId, fetchPatientById, fetchPayments, fetchQuotations]);

  // Manejar errores
  useEffect(() => {
    if (patientError) {
      toast.error(patientError);
      clearPatientError();
    }
    if (paymentsError) {
      toast.error(paymentsError);
      clearPaymentsError();
    }
    if (quotationsError) {
      toast.error(quotationsError);
      clearQuotationsError();
    }
  }, [patientError, paymentsError, quotationsError, clearPatientError, clearPaymentsError, clearQuotationsError]);

  // Filtrar pagos y cotizaciones del paciente
  const patientPayments = payments.filter(payment => {
    const quotation = quotations.find(q => q.quotation_id === payment.quotation_id);
    return quotation?.patient_id === patientId;
  });

  const patientQuotations = quotations.filter(quotation => quotation.patient_id === patientId);

  const isLoading = patientLoading || paymentsLoading || quotationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando perfil del paciente...</span>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-500">Paciente no encontrado</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completado', className: 'bg-green-100 text-green-700' },
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
      draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-700' },
      sent: { label: 'Enviada', className: 'bg-blue-100 text-blue-700' },
      accepted: { label: 'Aceptada', className: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rechazada', className: 'bg-red-100 text-red-700' },
      CONFIRMADO: { label: 'Confirmado', className: 'bg-green-100 text-green-700' },
      PENDIENTE: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
      ANULADO: { label: 'Anulado', className: 'bg-red-100 text-red-700' },
      PAGADA: { label: 'Pagada', className: 'bg-green-100 text-green-700' },
      ACEPTADA: { label: 'Aceptada', className: 'bg-blue-100 text-blue-700' },
      ANULADA: { label: 'Anulada', className: 'bg-red-100 text-red-700' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-sakura-red hover:text-sakura-red-dark"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-sakura-red">Perfil del Paciente</h1>
              <p className="text-sm text-gray-600">ID: {selectedPatient.patient_id}</p>
            </div>
          </div>
          <Button variant="outline" className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {`${selectedPatient.first_name} ${selectedPatient.last_name}`}
                  </h3>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                    {selectedPatient.status ? 'Paciente Activo' : 'Paciente Inactivo'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{selectedPatient.email || 'Sin email'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{selectedPatient.phone || 'Sin teléfono'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Registrado: {new Date(selectedPatient.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">DNI: {selectedPatient.doc_number || 'Sin documento'}</span>
                </div>
                
                {selectedPatient.birth_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Nacimiento: {new Date(selectedPatient.birth_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Payments and Quotes */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagos ({patientPayments.length})
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Cotizaciones ({patientQuotations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                {patientPayments.length > 0 ? (
                  <div className="space-y-4">
                    {patientPayments.map((payment) => (
                      <div key={payment.payment_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">S/ {payment.amount.toFixed(2)}</span>
                            {getStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                          {payment.method && (
                            <p className="text-sm text-gray-500 mt-1">Método: {payment.method.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay pagos registrados para este paciente
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cotizaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {patientQuotations.length > 0 ? (
                  <div className="space-y-4">
                    {patientQuotations.map((quotation) => (
                      <div key={quotation.quotation_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">S/ {quotation.total_amount.toFixed(2)}</span>
                            {getStatusBadge(quotation.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(quotation.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {quotation.quotation_id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay cotizaciones registradas para este paciente
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientProfile; 