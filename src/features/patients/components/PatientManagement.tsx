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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { usePatientStore, useMasterDataStore, type Patient } from '@/shared/stores';
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
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    doc_number: '',
    district_id: 0,
    gender_id: 0,
    document_type_id: 0,
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
    fetchAllMasterData 
  } = useMasterDataStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPatients();
    fetchAllMasterData();
  }, [fetchPatients, fetchAllMasterData]);

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
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.doc_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patient_id, formData);
        toast.success('Paciente actualizado exitosamente');
      } else {
        await createPatient(formData);
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
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email || '',
      phone: patient.phone || '',
      birth_date: patient.birth_date || '',
      doc_number: patient.doc_number || '',
      district_id: patient.district_id,
      gender_id: patient.gender_id,
      document_type_id: patient.document_type_id,
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
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      birth_date: '',
      doc_number: '',
      district_id: 0,
      gender_id: 0,
      document_type_id: 0,
      status: true
    });
    setEditingPatient(null);
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="mb-4 shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPatientClick(patient.patient_id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-sakura-red" />
              <h3 className="font-semibold text-gray-800 text-lg">
                {patient.first_name} {patient.last_name}
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
              {patient.phone && <p><strong>Teléfono:</strong> {patient.phone}</p>}
              {patient.doc_number && <p><strong>DNI:</strong> {patient.doc_number}</p>}
              {patient.birth_date && <p><strong>Fecha de nacimiento:</strong> {new Date(patient.birth_date).toLocaleDateString()}</p>}
              <p><strong>Registro:</strong> {new Date(patient.created_at).toLocaleDateString()}</p>
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
                handleDelete(patient.patient_id);
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
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

                <div>
                  <Label htmlFor="doc_number">DNI</Label>
                  <Input
                    id="doc_number"
                    value={formData.doc_number}
                    onChange={(e) => setFormData({...formData, doc_number: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Género</Label>
                  <Select value={formData.gender_id.toString()} onValueChange={(value) => setFormData({...formData, gender_id: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.gender_id} value={gender.gender_id.toString()}>
                          {gender.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="district">Distrito</Label>
                  <Select value={formData.district_id.toString()} onValueChange={(value) => setFormData({...formData, district_id: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.district_id} value={district.district_id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPatient ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
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
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-sakura-gray mx-auto mb-4" />
            <p className="text-sakura-gray">No se encontraron pacientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.patient_id} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement; 