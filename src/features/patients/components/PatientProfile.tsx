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
  Stethoscope
} from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  medicalHistory: string;
  registrationDate: string;
  dni?: string;
  birthDate?: string;
  emergencyContact?: string;
}

interface Payment {
  id: number;
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  method: string;
}

interface Quote {
  id: number;
  date: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PatientProfileProps {
  patientId: number;
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Mock data - In a real app, this would come from an API
  useEffect(() => {
    // Simular carga de datos del paciente
    const mockPatient: Patient = {
      id: patientId,
      name: "Maria Antonieta Lugo",
      email: "maria.lugo@email.com",
      phone: "+51 999 888 777",
      address: "Av. Larco 123, Miraflores, Lima",
      medicalHistory: "Historial dental previo: limpieza regular, ortodoncia completada en 2023. Alergia a penicilina. Última revisión: 15/01/2024",
      registrationDate: "2024-01-15",
      dni: "12345678",
      birthDate: "1985-03-15",
      emergencyContact: "+51 999 777 666 (Carlos Lugo - Esposo)"
    };

    const mockPayments: Payment[] = [
      {
        id: 1,
        amount: 150.00,
        date: "2024-01-20",
        description: "Limpieza dental y revisión general",
        status: "completed",
        method: "Efectivo"
      },
      {
        id: 2,
        amount: 300.00,
        date: "2024-02-15",
        description: "Empaste molar superior derecho",
        status: "completed",
        method: "Tarjeta"
      },
      {
        id: 3,
        amount: 200.00,
        date: "2024-03-10",
        description: "Blanqueamiento dental",
        status: "pending",
        method: "Transferencia"
      }
    ];

    const mockQuotes: Quote[] = [
      {
        id: 1,
        date: "2024-01-15",
        total: 450.00,
        status: "accepted",
        items: [
          { name: "Limpieza Dental", quantity: 1, price: 80 },
          { name: "Empaste", quantity: 2, price: 120 },
          { name: "Revisión General", quantity: 1, price: 50 }
        ]
      },
      {
        id: 2,
        date: "2024-02-20",
        total: 800.00,
        status: "sent",
        items: [
          { name: "Corona Dental", quantity: 1, price: 300 },
          { name: "Endodoncia", quantity: 1, price: 250 },
          { name: "Radiografía", quantity: 2, price: 50 }
        ]
      }
    ];

    setPatient(mockPatient);
    setPayments(mockPayments);
    setQuotes(mockQuotes);
  }, [patientId]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando perfil del paciente...</div>
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
      rejected: { label: 'Rechazada', className: 'bg-red-100 text-red-700' }
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
              <p className="text-sm text-gray-600">ID: {patient.id}</p>
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
                  <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                    Paciente Activo
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Registro: {new Date(patient.registrationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {patient.dni && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">DNI</label>
                    <p className="text-gray-900">{patient.dni}</p>
                  </div>
                )}
                {patient.birthDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <p className="text-gray-900">{new Date(patient.birthDate).toLocaleDateString()}</p>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contacto de Emergencia</label>
                    <p className="text-gray-900">{patient.emergencyContact}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Historial Médico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{patient.medicalHistory}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Payments and Quotes */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagos ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Cotizaciones ({quotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{payment.description}</h4>
                          <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Método: {payment.method}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-sakura-red">
                            S/ {payment.amount.toFixed(2)}
                          </div>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay pagos registrados
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
                {quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Cotización #{quote.id}</h4>
                            <p className="text-sm text-gray-600">{new Date(quote.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-sakura-red">
                              S/ {quote.total.toFixed(2)}
                            </div>
                            {getStatusBadge(quote.status)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {quote.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay cotizaciones registradas
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