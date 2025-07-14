"use client";

import React, { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useMasterData } from '@/shared/hooks';
import { Loader2 } from 'lucide-react';

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  dni: string;
  districtId: number;
  genderId: number;
  documentTypeId: number;
  status: boolean;
}

interface PatientFormProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const { 
    districts, 
    genders, 
    documentTypes, 
    loadDistricts,
    loadGenders,
    loadDocumentTypes,
    isLoading,
    error
  } = useMasterData();

  // Log cuando cambian los datos
  useEffect(() => {
    console.log('📊 PatientForm: Datos actualizados:', {
      districts: districts,
      genders: genders,
      documentTypes: documentTypes,
      isLoading,
      error
    });
  }, [districts, genders, documentTypes, isLoading, error]);

  // Función para reintentar cargar datos maestros
  const handleRetryLoadMasterData = async () => {
    console.log('🔄 PatientForm: Reintentando cargar datos maestros...');
    try {
      await Promise.all([
        loadDistricts(),
        loadGenders(),
        loadDocumentTypes()
      ]);
    } catch (error) {
      console.error('❌ PatientForm: Error en reintento:', error);
    }
  };

  // Handlers para cargar datos cuando se abren los selects
  const handleDistrictSelectOpen = async (open: boolean) => {
    if (open && districts.length === 0) {
      await loadDistricts();
    }
  };

  const handleGenderSelectOpen = async (open: boolean) => {
    if (open && genders.length === 0) {
      await loadGenders();
    }
  };

  const handleDocumentTypeSelectOpen = async (open: boolean) => {
    if (open && documentTypes.length === 0) {
      await loadDocumentTypes();
    }
  };

  // Mostrar mensaje de error si hay problemas cargando datos maestros
  if (error && districts.length === 0 && genders.length === 0 && documentTypes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error de conexión con la base de datos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>No se pudieron cargar los datos maestros desde la base de datos.</p>
                {error.includes('ConcurrentModificationException') && (
                  <p className="mt-1 font-medium">Error de concurrencia en el servidor. El sistema está procesando múltiples solicitudes simultáneamente.</p>
                )}
                {error.includes('timeout') && (
                  <p className="mt-1 font-medium">La solicitud tardó demasiado tiempo. El servidor puede estar sobrecargado.</p>
                )}
                {error.includes('Failed to fetch') && (
                  <p className="mt-1 font-medium">No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetryLoadMasterData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cargando...
                    </>
                  ) : (
                    'Reintentar'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="documentTypeId">Tipo de Documento *</Label>
          <Select 
            value={formData.documentTypeId ? formData.documentTypeId.toString() : ''} 
            onValueChange={(value) => setFormData({...formData, documentTypeId: parseInt(value)})}
            onOpenChange={handleDocumentTypeSelectOpen}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar tipo de documento"} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Cargando tipos de documento...</span>
                </div>
              ) : (
                documentTypes
                  .filter((docType) => docType && docType.documentTypeId && docType.name)
                  .map((docType) => (
                    <SelectItem key={docType.documentTypeId} value={docType.documentTypeId.toString()}>
                      {docType.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dni">Número de Documento</Label>
          <Input
            id="dni"
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="birthDate">Fecha de nacimiento</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="genderId">Género *</Label>
          <Select 
            value={formData.genderId ? formData.genderId.toString() : ''} 
            onValueChange={(value) => setFormData({...formData, genderId: parseInt(value)})}
            onOpenChange={handleGenderSelectOpen}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar género"} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Cargando géneros...</span>
                </div>
              ) : (
                genders
                  .filter((gender) => gender && gender.genderId && gender.name)
                  .map((gender) => (
                    <SelectItem key={gender.genderId} value={gender.genderId.toString()}>
                      {gender.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="districtId">Distrito *</Label>
          <Select 
            value={formData.districtId ? formData.districtId.toString() : ''} 
            onValueChange={(value) => setFormData({...formData, districtId: parseInt(value)})}
            onOpenChange={handleDistrictSelectOpen}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar distrito"} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Cargando distritos...</span>
                </div>
              ) : (
                districts
                  .filter((district) => district && district.districtId && district.name)
                  .map((district) => (
                    <SelectItem key={district.districtId} value={district.districtId.toString()}>
                      {district.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default PatientForm; 