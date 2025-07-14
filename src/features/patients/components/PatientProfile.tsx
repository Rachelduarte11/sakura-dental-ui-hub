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
import { pdfService } from '@/shared/services/pdfService';

interface PatientProfileProps {
  patientId: number;
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patientId, onBack }) => {
  const { 
    selectedPatient, 
    patientQuotations,
    services,
    isLoading: patientLoading, 
    isLoadingQuotations,
    isLoadingServices,
    error: patientError, 
    quotationsError,
    servicesError,
    fetchPatientById, 
    fetchPatientQuotations,
    fetchServices,
    clearError: clearPatientError,
    clearQuotationsError,
    clearServicesError
  } = usePatientStore();

  const { 
    payments, 
    isLoading: paymentsLoading, 
    error: paymentsError, 
    fetchPayments, 
    clearError: clearPaymentsError 
  } = usePaymentStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPatientById(patientId);
    fetchPatientQuotations(patientId);
    fetchServices();
    fetchPayments();
  }, [patientId, fetchPatientById, fetchPatientQuotations, fetchServices, fetchPayments]);

  // Manejar errores
  useEffect(() => {
    if (patientError) {
      toast.error(patientError);
      clearPatientError();
    }
    if (quotationsError) {
      toast.error(quotationsError);
      clearQuotationsError();
    }
    if (servicesError) {
      toast.error(servicesError);
      clearServicesError();
    }
    if (paymentsError) {
      toast.error(paymentsError);
      clearPaymentsError();
    }
  }, [patientError, quotationsError, servicesError, paymentsError, clearPatientError, clearQuotationsError, clearServicesError, clearPaymentsError]);

  // Filtrar pagos del paciente
  const patientPayments = payments.filter(payment => {
    const quotation = patientQuotations.find(q => q.quotationId === payment.quotation_id);
    return quotation?.patientId === patientId;
  });

  const isLoading = patientLoading || isLoadingQuotations || isLoadingServices || paymentsLoading;

  // Handle PDF export
  const handlePDFExport = async (quotation: Quotation) => {
    if (!selectedPatient) {
      toast.error('No se pudo cargar la información del paciente');
      return;
    }

    try {
      await pdfService.generateQuotationPDF({
        quotation,
        patient: selectedPatient
      });
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  // Handle WhatsApp send
  const handleWhatsAppSend = async (quotation: Quotation) => {
    if (!selectedPatient) {
      toast.error('No se pudo cargar la información del paciente');
      return;
    }

    try {
      // First generate and download the PDF
      await pdfService.generateQuotationPDF({
        quotation,
        patient: selectedPatient
      });

      // Check if patient has phone number
      if (!selectedPatient.phone) {
        toast.error('El paciente no tiene número de teléfono registrado');
        return;
      }

      // Clean phone number (remove spaces, dashes, parentheses, and +)
      const cleanPhone = selectedPatient.phone.replace(/[\s\-\(\)\+]/g, '');
      
      // Ensure phone starts with country code (51 for Peru)
      const phone = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;

      // Create WhatsApp message (without emojis for better compatibility)
      const message = `Hola ${selectedPatient.firstName}, aquí tienes tu cotización #${quotation.quotationId}.

Cotización: #${quotation.quotationId}
Paciente: ${selectedPatient.firstName} ${selectedPatient.lastName}
Total: S/ ${quotation.totalAmount.toFixed(2)}
Fecha: ${quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString('es-ES') : 'N/A'}
Tratamientos: ${quotation.items?.length || 0}

Gracias por confiar en Sakura Dental!`;

      // Open WhatsApp Web
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('PDF descargado y WhatsApp abierto. Busca el archivo PDF en tu carpeta de descargas y adjúntalo al chat.', {
        duration: 5000
      });
    } catch (error) {
      console.error('Error preparing WhatsApp message:', error);
      toast.error('Error al preparar el mensaje de WhatsApp');
    }
  };

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
              <p className="text-sm text-gray-600">ID: {selectedPatient.patientId}</p>
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
                    {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
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
                      Registrado: {new Date(selectedPatient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">DNI: {selectedPatient.dni || 'Sin documento'}</span>
                </div>
                
                {selectedPatient.birthDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Nacimiento: {new Date(selectedPatient.birthDate).toLocaleDateString()}
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
                      <div key={quotation.quotationId} className="bg-white border rounded-lg p-6 shadow-sm">
                        {/* Header with title and status */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Cotización #{quotation.quotationId}
                            </h3>
                            {getStatusBadge(quotation.status)}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-sakura-red">
                              S/ {quotation.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {quotation.items?.length || 0} tratamiento{(quotation.items?.length || 0) !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        {/* Patient info and date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Paciente:</span> {selectedPatient?.firstName} {selectedPatient?.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span> {quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </div>
                          {selectedPatient?.phone && (
                            <div>
                              <span className="font-medium">Teléfono:</span> {selectedPatient.phone}
                            </div>
                          )}
                        </div>

                        {/* Services/Treatments */}
                        {quotation.items && quotation.items.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {quotation.items.map((item, index) => (
                                <div key={item.itemId || index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                  <span className="font-medium">{item.serviceName || 'Servicio'}</span>
                                  {item.quantity > 1 && (
                                    <span className="text-gray-600 ml-1">x{item.quantity}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-4 border-t">
                          <button 
                            onClick={() => handlePDFExport(quotation)}
                            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            Descargar PDF
                          </button>
                          <button 
                            onClick={() => handleWhatsAppSend(quotation)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            Enviar por WhatsApp
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                            <Mail className="h-4 w-4" />
                            Email
                          </button>
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