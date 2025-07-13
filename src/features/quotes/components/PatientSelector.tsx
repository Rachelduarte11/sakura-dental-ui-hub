import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Patient } from './types';
import { usePatientStore } from '@/shared/stores';

interface PatientSelectorProps {
  patients: any[];
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient) => void;
  onPatientClear?: () => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatient,
  onPatientSelect,
  onPatientClear
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change - búsqueda local en datos del store
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };



  // Convertir datos del store al formato esperado por el componente
  const patientsData: Patient[] = patients.map(patient => ({
    id: patient.patientId,
    name: `${patient.firstName} ${patient.lastName}`,
    phone: patient.phone || '',
    email: patient.email || ''
  }));

  const filteredPatients = patientsData.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchLower) ||
      // También buscar por nombre y apellido por separado
      patient.name.split(' ').some(part => part.toLowerCase().includes(searchLower))
    );
  });

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchQuery('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seleccionar Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar paciente..."
              className="pl-10"
            />

          </div>

          {searchQuery && !selectedPatient && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No se encontraron pacientes con "{searchQuery}"
                </div>
              ) : (
                filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 rounded-lg border cursor-pointer transition-colors border-gray-200 hover:border-gray-300"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.phone}</div>
                </div>
                ))
              )}
            </div>
          )}

          {selectedPatient && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-green-800">{selectedPatient.name}</div>
                  <div className="text-sm text-green-600">{selectedPatient.phone}</div>
                  <div className="text-sm text-green-600">{selectedPatient.email}</div>
                </div>
                {onPatientClear && (
                  <button
                    onClick={onPatientClear}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSelector; 