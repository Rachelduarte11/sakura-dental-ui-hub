
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Edit, Trash2, ArrowUp, Loader2, User, Mail, Phone, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useEmployeeStore, type Employee } from '@/shared/stores';
import { useMasterData } from '@/shared/hooks';
import { toast } from 'sonner';

const DoctorManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title_id: 0,
    hired_at: new Date().toISOString().split('T')[0],
    district_id: 1, // Default district
    gender_id: 1, // Default gender
    document_type_id: 1, // Default document type
    status: true,
  });

  const { 
    employees, 
    isLoading, 
    error, 
    fetchEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    clearError 
  } = useEmployeeStore();

  const {
    jobTitles,
    loadJobTitles
  } = useMasterData();

  // Cargar datos al montar el componente solo si es necesario
  useEffect(() => {
    fetchEmployees();
    // Los datos maestros se cargarán cuando se abran los selects
  }, [fetchEmployees]);

  // Handler para cargar job titles cuando se abre el select
  const handleJobTitleSelectOpen = async (open: boolean) => {
    if (open && jobTitles.length === 0) {
      await loadJobTitles();
    }
  };

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const filteredDoctors = employees.filter(employee =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = async () => {
    if (!newDoctor.first_name || !newDoctor.last_name || !newDoctor.email) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    try {
      await createEmployee(newDoctor);
      toast.success('Doctor registrado exitosamente');
      setNewDoctor({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title_id: 0,
        hired_at: new Date().toISOString().split('T')[0],
        district_id: 1,
        gender_id: 1,
        document_type_id: 1,
        status: true,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Error al registrar doctor');
    }
  };

  const getJobTitleName = (jobTitleId: number) => {
    const jobTitle = jobTitles.find(jt => jt.job_title_id === jobTitleId);
    return jobTitle?.name || 'Sin especificar';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando doctores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sakura-gray-medium">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Gestión de Doctores</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sakura-red hover:bg-sakura-red-dark">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={newDoctor.first_name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })}
                    className="mt-1"
                    placeholder="Ingrese el nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={newDoctor.last_name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })}
                    className="mt-1"
                    placeholder="Ingrese el apellido"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="mt-1"
                    placeholder="ejemplo@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="mt-1"
                    placeholder="+51 999 999 999"
                  />
                </div>
                <div>
                  <Label htmlFor="job_title">Cargo</Label>
                  <Select onValueChange={(value) => setNewDoctor({ ...newDoctor, job_title_id: parseInt(value) })} onOpenChange={handleJobTitleSelectOpen}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {jobTitles.map((jobTitle) => (
                        <SelectItem key={jobTitle.job_title_id} value={jobTitle.job_title_id.toString()}>
                          {jobTitle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hired_at">Fecha de Contratación</Label>
                  <Input
                    id="hired_at"
                    type="date"
                    value={newDoctor.hired_at}
                    onChange={(e) => setNewDoctor({ ...newDoctor, hired_at: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddDoctor} className="w-full bg-sakura-red hover:bg-sakura-red-dark">
                  Registrar Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-sakura-gray-medium">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sakura-gray h-4 w-4" />
          <Input
            placeholder="Buscar doctores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay doctores registrados</h3>
            <p className="text-gray-500 mb-6">Comience registrando el primer doctor del sistema</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-sakura-red hover:bg-sakura-red-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Doctor
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.employee_id} className="shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {doctor.first_name} {doctor.last_name}
                      </CardTitle>
                      <p className="text-sm text-sakura-gray mt-1">
                        {getJobTitleName(doctor.job_title_id)}
                      </p>
                    </div>
                    <Badge variant={doctor.status ? "default" : "secondary"}>
                      {doctor.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-sakura-red" />
                    <span>{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-sakura-red" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-sakura-red" />
                    <span>Contratado: {new Date(doctor.hired_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
