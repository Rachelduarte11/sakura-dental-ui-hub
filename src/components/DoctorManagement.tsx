
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Phone, Mail, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  email: string;
  phone: string;
  licenseNumber: string;
  commissionPercentage: number;
  status: 'Activo' | 'Inactivo';
  experience: string;
  totalTreatments: number;
  totalEarnings: number;
  joinDate: string;
}

const DoctorManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    speciality: '',
    email: '',
    phone: '',
    licenseNumber: '',
    commissionPercentage: 60,
    experience: '',
  });

  // Mock data
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: 'Dr. Carlos Mendoza',
      speciality: 'Odontología General',
      email: 'carlos.mendoza@sakuradental.com',
      phone: '+51 999 123 456',
      licenseNumber: 'COP-12345',
      commissionPercentage: 60,
      status: 'Activo',
      experience: '8 años de experiencia en odontología general y preventiva.',
      totalTreatments: 145,
      totalEarnings: 12450.00,
      joinDate: '2022-03-15',
    },
    {
      id: 2,
      name: 'Dra. Ana Rodriguez',
      speciality: 'Ortodoncia',
      email: 'ana.rodriguez@sakuradental.com',
      phone: '+51 999 654 321',
      licenseNumber: 'COP-67890',
      commissionPercentage: 70,
      status: 'Activo',
      experience: '12 años especializándose en ortodoncia y alineadores dentales.',
      totalTreatments: 89,
      totalEarnings: 18750.00,
      joinDate: '2021-08-20',
    },
    {
      id: 3,
      name: 'Dr. Miguel Torres',
      speciality: 'Cirugía Oral',
      email: 'miguel.torres@sakuradental.com',
      phone: '+51 999 987 654',
      licenseNumber: 'COP-54321',
      commissionPercentage: 65,
      status: 'Activo',
      experience: '15 años en cirugía oral y maxilofacial.',
      totalTreatments: 67,
      totalEarnings: 15300.00,
      joinDate: '2020-11-10',
    },
  ]);

  const specialities = [
    'Odontología General',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Cirugía Oral',
    'Odontopediatría',
    'Prostodoncia',
    'Implantología',
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = () => {
    const doctor: Doctor = {
      id: Date.now(),
      ...newDoctor,
      status: 'Activo',
      totalTreatments: 0,
      totalEarnings: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setDoctors([...doctors, doctor]);
    setNewDoctor({
      name: '',
      speciality: '',
      email: '',
      phone: '',
      licenseNumber: '',
      commissionPercentage: 60,
      experience: '',
    });
    setIsAddDialogOpen(false);
  };

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
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="speciality">Especialidad</Label>
                  <Select onValueChange={(value) => setNewDoctor({ ...newDoctor, speciality: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {specialities.map((speciality) => (
                        <SelectItem key={speciality} value={speciality}>
                          {speciality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="license">Número de Colegiatura</Label>
                  <Input
                    id="license"
                    value={newDoctor.licenseNumber}
                    onChange={(e) => setNewDoctor({ ...newDoctor, licenseNumber: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="commission">Porcentaje de Comisión (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={newDoctor.commissionPercentage}
                    onChange={(e) => setNewDoctor({ ...newDoctor, commissionPercentage: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experiencia</Label>
                  <Textarea
                    id="experience"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    className="mt-1"
                    rows={3}
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
            placeholder="Buscar doctores por nombre, especialidad o correo..."
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red rounded-xl"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-sakura-red">{doctors.length}</div>
              <p className="text-sm text-gray-600">Doctores Activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {doctors.reduce((sum, d) => sum + d.totalTreatments, 0)}
              </div>
              <p className="text-sm text-gray-600">Tratamientos Totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                S/ {doctors.reduce((sum, d) => sum + d.totalEarnings, 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Comisiones Totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <Badge variant={doctor.status === 'Activo' ? 'default' : 'secondary'}>
                    {doctor.status}
                  </Badge>
                </div>
                <p className="text-sakura-red font-medium">{doctor.speciality}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span>{doctor.licenseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Comisión: {doctor.commissionPercentage}%</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{doctor.experience}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-sakura-red">{doctor.totalTreatments}</div>
                    <div className="text-xs text-gray-600">Tratamientos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">S/ {doctor.totalEarnings.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Comisiones</div>
                  </div>
                </div>

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
      </div>
    </div>
  );
};

export default DoctorManagement;
