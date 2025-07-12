import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { 
  Search,
  User,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  medicalHistory: string;
  dni: string;
}

interface Quote {
  id: number;
  patientId: number;
  date: string;
  total: number;
  status: 'pending' | 'partial' | 'completed';
  services: QuoteService[];
}

interface QuoteService {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface PatientQuoteSelectorProps {
  onQuoteSelect: (quote: Quote) => void;
}

const PatientQuoteSelector: React.FC<PatientQuoteSelectorProps> = ({ onQuoteSelect }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Mock data
  const patients: Patient[] = [
    { id: 1, name: 'María García López', phone: '999-123-456', email: 'maria@email.com', medicalHistory: 'MH001', dni: '12345678' },
    { id: 2, name: 'Carlos Rodríguez Pérez', phone: '999-789-123', email: 'carlos@email.com', medicalHistory: 'MH002', dni: '87654321' },
    { id: 3, name: 'Ana Martínez Silva', phone: '999-456-789', email: 'ana@email.com', medicalHistory: 'MH003', dni: '11223344' },
    { id: 4, name: 'Luis Fernández Torres', phone: '999-321-654', email: 'luis@email.com', medicalHistory: 'MH004', dni: '44332211' },
  ];

  const quotes: Quote[] = [
    {
      id: 1,
      patientId: 1,
      date: '2024-01-15',
      total: 450,
      status: 'partial',
      services: [
        { id: 1, name: 'Limpieza Dental', price: 80, category: 'Preventivo' },
        { id: 2, name: 'Empaste', price: 120, category: 'Restaurativo' },
        { id: 3, name: 'Corona Dental', price: 300, category: 'Protésico' },
      ]
    },
    {
      id: 2,
      patientId: 1,
      date: '2024-01-20',
      total: 200,
      status: 'pending',
      services: [
        { id: 4, name: 'Blanqueamiento', price: 200, category: 'Estético' },
      ]
    },
    {
      id: 3,
      patientId: 2,
      date: '2024-01-18',
      total: 370,
      status: 'pending',
      services: [
        { id: 5, name: 'Endodoncia', price: 250, category: 'Especialidad' },
        { id: 6, name: 'Extracción', price: 150, category: 'Cirugía' },
      ]
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone.includes(patientSearch) ||
    patient.medicalHistory.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const patientQuotes = selectedPatient 
    ? quotes.filter(quote => quote.patientId === selectedPatient.id)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'partial': return 'Parcial';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Seleccionar Paciente y Cotización</h2>
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Buscar Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono o historial médico..."
              className="pl-10"
            />
          </div>

          {patientSearch && (
            <div className="mt-4 space-y-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'border-sakura-red bg-sakura-red/5'
                      : 'border-gray-200 hover:border-sakura-red/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        {patient.phone} • {patient.medicalHistory}
                      </p>
                    </div>
                    {selectedPatient?.id === patient.id && (
                      <Badge className="bg-sakura-red text-white">Seleccionado</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Quotes */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cotizaciones de {selectedPatient.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientQuotes.length > 0 ? (
              <div className="space-y-4">
                {patientQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-sakura-red/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onQuoteSelect(quote)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-medium text-gray-900">
                            Cotización #{quote.id}
                          </h3>
                          <Badge className={getStatusColor(quote.status)}>
                            {getStatusText(quote.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(quote.date).toLocaleDateString('es-ES')}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            S/ {quote.total}
                          </div>
                          <div>
                            {quote.services.length} servicio{quote.services.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {quote.services.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay cotizaciones para este paciente</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientQuoteSelector; 