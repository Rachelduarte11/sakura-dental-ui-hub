'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { usePatients } from '../hooks/usePatients';
import type { Patient } from '../api/types';

interface PatientListProps {
  onPatientSelect?: (patient: Patient) => void;
  onAddPatient?: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  onPatientSelect, 
  onAddPatient 
}) => {
  const {
    patients,
    isLoading,
    error,
    handleSearch,
    handleStatusFilter,
    clearFilters,
    handleDeletePatient,
  } = usePatients();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleStatusChange = (status: boolean | null) => {
    handleStatusFilter(status);
  };

  const handleDelete = async (patientId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      await handleDeletePatient(patientId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando pacientes...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-8">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pacientes ({patients.length})</CardTitle>
          {onAddPatient && (
            <Button onClick={onAddPatient} size="sm">
              Agregar Paciente
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-4 space-y-2">
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(null)}
            >
              Todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(true)}
            >
              Activos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(false)}
            >
              Inactivos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Lista de pacientes */}
        <div className="space-y-2">
          {patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron pacientes
            </div>
          ) : (
            patients.map((patient) => (
              <div
                key={patient.patient_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <Badge variant={patient.status ? "default" : "secondary"}>
                      {patient.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {patient.email && <div>Email: {patient.email}</div>}
                    {patient.phone && <div>Teléfono: {patient.phone}</div>}
                    {patient.doc_number && <div>DNI: {patient.doc_number}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onPatientSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPatientSelect(patient)}
                    >
                      Ver
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(patient.patient_id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 