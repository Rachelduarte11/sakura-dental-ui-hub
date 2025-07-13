import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { Search, Plus, Edit, Trash2, ArrowUp, Loader2, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { usePatientStore, type Patient } from '@/shared/stores';
import { useMasterData } from '@/shared/hooks';
import { EmptyPatients } from '@/shared/components';
import PatientForm from '../components/PatientForm';
import { toast } from 'sonner';

interface PatientManagementProps {
  onBack: () => void;
  onPatientClick: (patientId: number) => void;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ onBack, onPatientClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    dni: '',
    districtId: 0,
    genderId: 0,
    documentTypeId: 0,
    status: true
  });

  const { 
    patients, 
    isLoading, 
    error, 
    fetchPatients, 
    createPatient, 
    updatePatient, 
    deletePatient,
    setFilters,
    clearError 
  } = usePatientStore();

  const { 
    districts, 
    genders, 
    documentTypes, 
    loadDistricts,
    loadGenders,
    loadDocumentTypes
  } = useMasterData();

  // Cargar datos al montar el componente solo si es necesario
  useEffect(() => {
    fetchPatients();
    // Los datos maestros se cargarán cuando se abran los selects en el formulario
  }, [fetchPatients]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Aplicar filtros de búsqueda
  useEffect(() => {
    setFilters({ search: searchQuery });
  }, [searchQuery, setFilters]);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.dni?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toLocalDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr;
    return `${dateStr}T00:00:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Formatea la fecha antes de enviar
    const formDataToSend = {
      ...formData,
      birthDate: toLocalDateTime(formData.birthDate)
    };

    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patientId, formDataToSend);
        toast.success('Paciente actualizado exitosamente');
      } else {
        await createPatient(formDataToSend);
        toast.success('Paciente creado exitosamente');
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar paciente');
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      email: patient.email || '',
      phone: patient.phone || '',
      birthDate: patient.birthDate || '',
      dni: patient.dni || '',
      districtId: patient.districtId || 0,
      genderId: patient.genderId || 0,
      documentTypeId: patient.documentTypeId || 0,
      status: patient.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (patientId: number) => {
    try {
      await deletePatient(patientId);
      toast.success('Paciente eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar paciente');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      dni: '',
      districtId: 0,
      genderId: 0,
      documentTypeId: 0,
      status: true
    });
    setEditingPatient(null);
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="mb-4 shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPatientClick(patient.patientId)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-sakura-red" />
              <h3 className="font-semibold text-gray-800 text-lg">
                {patient.firstName} {patient.lastName}
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
              {patient.phone && <p><strong>Teléfono:</strong> {patient.phone}</p>}
              {patient.dni && <p><strong>DNI:</strong> {patient.dni}</p>}
              {patient.birthDate && <p><strong>Fecha de nacimiento:</strong> {new Date(patient.birthDate).toLocaleDateString()}</p>}
              <p><strong>Registro:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge variant={patient.status ? "default" : "secondary"} className="mt-2">
              {patient.status ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-sakura-gray hover:text-sakura-red"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleEdit(patient);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleDelete(patient.patientId);
              }} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sakura-gray-medium">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-sakura-red hover:text-sakura-red-dark"
            >
              <ArrowUp className="h-6 w-6 rotate-[-90deg]" />
            </Button>
            <h1 className="text-xl font-bold text-sakura-red">Gestión de Pacientes</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-sakura-red hover:bg-sakura-red-dark text-white"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
                </DialogTitle>
              </DialogHeader>
              <PatientForm
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingPatient}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-sakura-gray-medium">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sakura-gray h-4 w-4" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
            <span className="ml-2 text-sakura-gray">Cargando pacientes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <User className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar pacientes</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => fetchPatients()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <EmptyPatients onAddPatient={() => setIsDialogOpen(true)} />
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.patientId} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement; 