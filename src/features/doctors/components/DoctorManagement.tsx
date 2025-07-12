
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Edit, Phone, Mail, Award, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useEmployeeStore, useMasterDataStore, type Employee } from '@/shared/stores';
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
    fetchJobTitles
  } = useMasterDataStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchEmployees();
    fetchJobTitles();
  }, [fetchEmployees, fetchJobTitles]);

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
                  <Select onValueChange={(value) => setNewDoctor({ ...newDoctor, job_title_id: parseInt(value) })}>
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

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar doctores por nombre o correo..."
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red rounded-xl"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-sakura-red">{employees.length}</div>
              <p className="text-sm text-gray-600">Doctores Registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.status).length}
              </div>
              <p className="text-sm text-gray-600">Doctores Activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {employees.filter(e => e.job_title_id === 1).length}
              </div>
              <p className="text-sm text-gray-600">Doctores</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.employee_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{`${doctor.first_name} ${doctor.last_name}`}</CardTitle>
                  <Badge variant={doctor.status ? 'default' : 'secondary'}>
                    {doctor.status ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sakura-red font-medium">{getJobTitleName(doctor.job_title_id)}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{doctor.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{doctor.phone || 'Sin teléfono'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span>ID: {doctor.employee_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Especialidad: {doctor.specialty || 'Sin especificar'}</span>
                  </div>
                </div>

                {doctor.hired_at && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      Contratado: {new Date(doctor.hired_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-sakura-red text-sakura-red hover:bg-sakura-red/10">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron doctores</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
