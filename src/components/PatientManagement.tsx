
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, ArrowUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  medicalHistory: string;
  registrationDate: string;
}

interface PatientManagementProps {
  onBack: () => void;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: ''
  });

  // Mock data for patients
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "Maria Antonieta Lugo",
      email: "maria.lugo@email.com",
      phone: "+51 999 888 777",
      address: "Av. Larco 123, Miraflores",
      medicalHistory: "Historial dental previo: limpieza regular, ortodoncia completada",
      registrationDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Carlos Mariano Justo",
      email: "carlos.justo@email.com",
      phone: "+51 987 654 321",
      address: "Jr. Los Rosales 456, San Isidro",
      medicalHistory: "Alergia a anestesia local, tratamiento de conducto pendiente",
      registrationDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Ana Sofia Mendoza",
      email: "ana.mendoza@email.com",
      phone: "+51 912 345 678",
      address: "Calle Las Flores 789, Surco",
      medicalHistory: "Sin antecedentes médicos relevantes",
      registrationDate: "2024-03-10"
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      // Update existing patient
      setPatients(patients.map(patient => 
        patient.id === editingPatient.id 
          ? { ...patient, ...formData }
          : patient
      ));
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: patients.length + 1,
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setPatients([...patients, newPatient]);
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      medicalHistory: ''
    });
    setEditingPatient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      medicalHistory: patient.medicalHistory
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (patientId: number) => {
    setPatients(patients.filter(patient => patient.id !== patientId));
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="mb-4 shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{patient.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Teléfono:</strong> {patient.phone}</p>
              <p><strong>Dirección:</strong> {patient.address}</p>
              <p><strong>Registro:</strong> {new Date(patient.registrationDate).toLocaleDateString()}</p>
            </div>
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
              Activo
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-sakura-gray hover:text-sakura-red">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
              <DropdownMenuItem onClick={() => handleEdit(patient)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(patient.id)} className="text-red-600">
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
                  setEditingPatient(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    medicalHistory: ''
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sakura-red">
                  {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ingrese el nombre completo"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+51 999 888 777"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Dirección completa"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Historial Médico</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                    placeholder="Historial médico y dental relevante"
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-sakura-red hover:bg-sakura-red-dark text-white"
                >
                  {editingPatient ? 'Actualizar Paciente' : 'Registrar Paciente'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar paciente por nombre o email"
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
          
          {filteredPatients.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No se encontraron pacientes</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
