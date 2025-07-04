
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { 
  Search, 
  DollarSign, 
  MessageCircle, 
  Calendar,
  FileText,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface PatientAccount {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalQuotes: number;
  totalDebt: number;
  totalPaid: number;
  lastPayment: string;
  quotes: Array<{
    id: number;
    date: string;
    total: number;
    paid: number;
    pending: number;
    status: 'pending' | 'partial' | 'paid';
    treatments: string[];
    payments: Array<{
      date: string;
      amount: number;
      method: string;
    }>;
  }>;
}

const PatientAccount: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientAccount | null>(null);

  // Mock data
  const patientAccounts: PatientAccount[] = [
    {
      id: 1,
      name: 'María García López',
      phone: '999-123-456',
      email: 'maria@email.com',
      totalQuotes: 3,
      totalDebt: 550.00,
      totalPaid: 1250.00,
      lastPayment: '2024-01-10',
      quotes: [
        {
          id: 1,
          date: '2024-01-15',
          total: 850.00,
          paid: 300.00,
          pending: 550.00,
          status: 'partial',
          treatments: ['Limpieza Dental', 'Empaste'],
          payments: [
            { date: '2024-01-15', amount: 300.00, method: 'Efectivo' }
          ]
        },
        {
          id: 2,
          date: '2024-01-01',
          total: 400.00,
          paid: 400.00,
          pending: 0.00,
          status: 'paid',
          treatments: ['Blanqueamiento'],
          payments: [
            { date: '2024-01-01', amount: 200.00, method: 'Yape' },
            { date: '2024-01-10', amount: 200.00, method: 'Efectivo' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Carlos Rodríguez Pérez',
      phone: '999-789-123',
      email: 'carlos@email.com',
      totalQuotes: 2,
      totalDebt: 1600.00,
      totalPaid: 0.00,
      lastPayment: 'Sin pagos',
      quotes: [
        {
          id: 3,
          date: '2024-01-14',
          total: 1200.00,
          paid: 0.00,
          pending: 1200.00,
          status: 'pending',
          treatments: ['Ortodoncia', 'Blanqueamiento'],
          payments: []
        },
        {
          id: 4,
          date: '2024-01-05',
          total: 400.00,
          paid: 0.00,
          pending: 400.00,
          status: 'pending',
          treatments: ['Limpieza Dental'],
          payments: []
        }
      ]
    }
  ];

  const filteredPatients = patientAccounts.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: 'pending' | 'partial' | 'paid') => {
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

  const handleSendReminder = (patient: PatientAccount) => {
    alert(`Enviando recordatorio de pago a ${patient.name} (${patient.phone})`);
  };

  const handleRegisterPayment = (patient: PatientAccount, quoteId: number) => {
    alert(`Registrando pago para cotización ${quoteId} de ${patient.name}`);
  };

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => setSelectedPatient(null)}
                className="mb-2"
              >
                ← Volver
              </Button>
              <h1 className="text-xl font-bold text-sakura-red">{selectedPatient.name}</h1>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Patient Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Deuda</p>
                  <p className="text-2xl font-bold text-red-600">
                    S/ {selectedPatient.totalDebt.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/ {selectedPatient.totalPaid.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Cotizaciones</p>
                  <p className="text-2xl font-bold text-sakura-red">
                    {selectedPatient.totalQuotes}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Último Pago</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedPatient.lastPayment}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleSendReminder(selectedPatient)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar Recordatorio
            </Button>
            <Button
              onClick={() => handleRegisterPayment(selectedPatient, selectedPatient.quotes[0]?.id)}
              className="bg-sakura-red hover:bg-sakura-red/90"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Registrar Pago
            </Button>
          </div>

          {/* Quotes History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPatient.quotes.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">Cotización #{quote.id}</span>
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

                      {quote.status !== 'paid' && (
                        <Button
                          onClick={() => handleRegisterPayment(selectedPatient, quote.id)}
                          className="bg-sakura-red hover:bg-sakura-red/90"
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Pagar
                        </Button>
                      )}
                    </div>

                    {/* Payment History */}
                    {quote.payments.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Historial de Pagos:</h4>
                        <div className="space-y-2">
                          {quote.payments.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-600" />
                                <span>{payment.date}</span>
                                <span>•</span>
                                <span>{payment.method}</span>
                              </div>
                              <span className="font-medium text-green-600">
                                S/ {payment.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Estado de Cuenta - Pacientes</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar paciente por nombre o teléfono..."
            className="pl-10"
          />
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                      {patient.totalDebt > 0 && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{patient.phone}</p>
                      <p>Último pago: {patient.lastPayment}</p>
                    </div>
                    
                    <div className="flex gap-4 mt-3 text-sm">
                      <span>Deuda: <span className="font-medium text-red-600">S/ {patient.totalDebt.toFixed(2)}</span></span>
                      <span>Pagado: <span className="font-medium text-green-600">S/ {patient.totalPaid.toFixed(2)}</span></span>
                      <span>Cotizaciones: <span className="font-medium">{patient.totalQuotes}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {patient.totalDebt > 0 && (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegisterPayment(patient, patient.quotes[0]?.id);
                          }}
                          className="bg-sakura-red hover:bg-sakura-red/90"
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Registrar Pago
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReminder(patient);
                          }}
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                          size="sm"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Recordatorio
                        </Button>
                      </>
                    )}
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

export default PatientAccount;
