'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';
import { useDoctors } from '../hooks/useDoctors';
import type { Doctor } from '../api/types';

export const DoctorsList: React.FC = () => {
  const {
    doctors,
    specializations,
    doctorStats,
    isLoading,
    error,
    fetchDoctors,
    fetchSpecializations,
    fetchDoctorStats,
    handleSearchDoctors,
    handleFilterBySpecialization,
    handleFilterByStatus,
    clearFilters,
    getDoctorFullName,
  } = useDoctors();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
    fetchDoctorStats();
  }, [fetchDoctors, fetchSpecializations, fetchDoctorStats]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    handleSearchDoctors(value);
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    handleFilterBySpecialization(value === 'all' ? null : parseInt(value));
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    handleFilterByStatus(value === 'all' ? null : value === 'active');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('all');
    setSelectedStatus('all');
    clearFilters();
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="outline">Inactivo</Badge>
    );
  };

  const getSpecializationBadge = (specialization: string) => {
    return (
      <Badge variant="secondary" className="text-xs">
        {specialization}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando doctores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Doctores</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar doctores..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={selectedSpecialization} onValueChange={handleSpecializationChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Especialización" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especializaciones</SelectItem>
                {specializations.map((specialization) => (
                  <SelectItem key={specialization.specialization_id} value={specialization.specialization_id.toString()}>
                    {specialization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpiar
            </Button>
          </div>

          {/* Tabla de doctores */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Especialización</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Salario</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No se encontraron doctores
                    </TableCell>
                  </TableRow>
                ) : (
                  doctors.map((doctor) => (
                    <TableRow key={doctor.doctor_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(doctor.first_name, doctor.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{getDoctorFullName(doctor)}</div>
                            <div className="text-sm text-gray-500">DNI: {doctor.dni}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSpecializationBadge(doctor.specialization)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{doctor.email}</div>
                          <div className="text-sm text-gray-500">{doctor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">{doctor.license_number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-medium">S/ {doctor.salary.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            Desde: {new Date(doctor.hire_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{doctor.commission_percentage}%</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            Horarios
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumen */}
          {doctorStats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{doctorStats.total_doctors}</div>
                  <div className="text-sm text-gray-500">Total Doctores</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {doctorStats.active_doctors}
                  </div>
                  <div className="text-sm text-gray-500">Doctores Activos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {doctorStats.total_appointments}
                  </div>
                  <div className="text-sm text-gray-500">Total Citas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {doctorStats.total_patients}
                  </div>
                  <div className="text-sm text-gray-500">Total Pacientes</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Estadísticas adicionales */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-semibold text-green-600">
                  S/ {doctors.reduce((total, doctor) => total + doctor.salary, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Salarios</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-semibold text-orange-600">
                  {doctors.length > 0 
                    ? (doctors.reduce((total, doctor) => total + doctor.commission_percentage, 0) / doctors.length).toFixed(1)
                    : '0'}%
                </div>
                <div className="text-sm text-gray-500">Comisión Promedio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-semibold text-blue-600">
                  {doctorStats?.average_rating?.toFixed(1) || '0.0'} ⭐
                </div>
                <div className="text-sm text-gray-500">Rating Promedio</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 