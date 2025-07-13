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
import { useMasterDataStore, type Patient } from '@/shared/stores';
import { Loader2 } from 'lucide-react';

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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
    fetchAllMasterData,
    isLoading 
  } = useMasterDataStore();

  // Cargar datos maestros al montar el componente
  useEffect(() => {
    console.log('🔄 PatientForm: Cargando datos maestros...');
    console.log('🔍 PatientForm: Estado inicial del store:', {
      districts: districts,
      genders: genders,
      documentTypes: documentTypes,
      isLoading
    });
    
    fetchAllMasterData().then(() => {
      console.log('✅ PatientForm: Datos maestros cargados:', {
        districts: districts,
        genders: genders,
        documentTypes: documentTypes
      });
    }).catch((error) => {
      console.error('❌ PatientForm: Error cargando datos maestros:', error);
    });
  }, [fetchAllMasterData]);

  // Log cuando cambian los datos
  useEffect(() => {
    console.log('📊 PatientForm: Datos actualizados:', {
      districts: districts,
      genders: genders,
      documentTypes: documentTypes,
      isLoading
    });
  }, [districts, genders, documentTypes, isLoading]);

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
          value={formData.phoneNumber}
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="documentTypeId">Tipo de Documento *</Label>
          <Select 
            value={formData.documentTypeId ? formData.documentTypeId.toString() : ''} 
            onValueChange={(value) => setFormData({...formData, documentTypeId: parseInt(value)})}
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