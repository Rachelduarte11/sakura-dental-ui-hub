"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useMasterData } from '@/shared/hooks';
import { toast } from 'sonner';
import { Switch } from '@/shared/components/ui/switch';
import { useRouter } from 'next/navigation';
import { ArrowUp, Shield, Users, Settings, Image, Globe, Lock, Bell, Link, Key, Sun, Moon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface SettingsManagementProps {
  onBack?: () => void;
}

const SECTIONS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Acceso y Seguridad', icon: Lock },
  { id: 'appearance', label: 'Apariencia', icon: Sun },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'integrations', label: 'Integraciones', icon: Link },
  { id: 'masterdata', label: 'Datos Maestros', icon: Globe },
];

const SettingsManagement: React.FC<SettingsManagementProps> = ({ onBack }) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [activeSection, setActiveSection] = useState<string>('general');
  const [systemName, setSystemName] = useState('Sakura Dental');
  const [language, setLanguage] = useState('es');
  const [timezone, setTimezone] = useState('GMT-5');
  const [logo, setLogo] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mainColor, setMainColor] = useState('#e53e3e');
  const [email, setEmail] = useState('admin@sakura.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Master data management
  const [isAddDistrictOpen, setIsAddDistrictOpen] = useState(false);
  const [isAddGenderOpen, setIsAddGenderOpen] = useState(false);
  const [isAddDocumentTypeOpen, setIsAddDocumentTypeOpen] = useState(false);
  const [newDistrict, setNewDistrict] = useState({ name: '', status: true });
  const [newGender, setNewGender] = useState({ code: '', name: '', status: true });
  const [newDocumentType, setNewDocumentType] = useState({ code: '', name: '', status: true });

  const { 
    districts, 
    genders, 
    documentTypes,
    isLoading,
    error,
    fetchDistricts, 
    fetchGenders, 
    fetchDocumentTypes,
    createDistrict,
    createGender,
    createDocumentType,
    updateDistrict,
    updateGender,
    updateDocumentType,
    deleteDistrict,
    deleteGender,
    deleteDocumentType,
    clearError 
  } = useMasterData('districts');

  const { 
    genders: allGenders,
    isLoading: gendersLoading,
    error: gendersError,
    fetchGenders: fetchAllGenders,
    createGender: createAllGender,
    updateGender: updateAllGender,
    deleteGender: deleteAllGender,
    clearError: clearGendersError
  } = useMasterData('genders');

  const { 
    documentTypes: allDocumentTypes,
    isLoading: documentTypesLoading,
    error: documentTypesError,
    fetchDocumentTypes: fetchAllDocumentTypes,
    createDocumentType: createAllDocumentType,
    updateDocumentType: updateAllDocumentType,
    deleteDocumentType: deleteAllDocumentType,
    clearError: clearDocumentTypesError
  } = useMasterData('documentTypes');

  // Cargar datos maestros al montar el componente
  useEffect(() => {
    fetchDistricts();
    fetchAllGenders();
    fetchAllDocumentTypes();
  }, [fetchDistricts, fetchAllGenders, fetchAllDocumentTypes]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
    if (gendersError) {
      toast.error(gendersError);
      clearGendersError();
    }
    if (documentTypesError) {
      toast.error(documentTypesError);
      clearDocumentTypesError();
    }
  }, [error, clearError, gendersError, clearGendersError, documentTypesError, clearDocumentTypesError]);

  // Permisos disponibles
  const permissions: Permission[] = [
    // Gestión de Pacientes
    { id: 'patients.create', name: 'Crear Pacientes', description: 'Puede registrar nuevos pacientes', category: 'Pacientes' },
    { id: 'patients.read', name: 'Ver Pacientes', description: 'Puede ver la lista de pacientes', category: 'Pacientes' },
    { id: 'patients.update', name: 'Editar Pacientes', description: 'Puede modificar información de pacientes', category: 'Pacientes' },
    { id: 'patients.delete', name: 'Eliminar Pacientes', description: 'Puede eliminar pacientes del sistema', category: 'Pacientes' },
    
    // Gestión de Doctores
    { id: 'doctors.create', name: 'Crear Doctores', description: 'Puede registrar nuevos doctores', category: 'Doctores' },
    { id: 'doctors.read', name: 'Ver Doctores', description: 'Puede ver la lista de doctores', category: 'Doctores' },
    { id: 'doctors.update', name: 'Editar Doctores', description: 'Puede modificar información de doctores', category: 'Doctores' },
    { id: 'doctors.delete', name: 'Eliminar Doctores', description: 'Puede eliminar doctores del sistema', category: 'Doctores' },
    
    // Cotizaciones
    { id: 'quotes.create', name: 'Crear Cotizaciones', description: 'Puede crear nuevas cotizaciones', category: 'Cotizaciones' },
    { id: 'quotes.read', name: 'Ver Cotizaciones', description: 'Puede ver todas las cotizaciones', category: 'Cotizaciones' },
    { id: 'quotes.update', name: 'Editar Cotizaciones', description: 'Puede modificar cotizaciones existentes', category: 'Cotizaciones' },
    { id: 'quotes.delete', name: 'Eliminar Cotizaciones', description: 'Puede eliminar cotizaciones', category: 'Cotizaciones' },
    
    // Ventas
    { id: 'sales.create', name: 'Crear Ventas', description: 'Puede registrar nuevas ventas', category: 'Ventas' },
    { id: 'sales.read', name: 'Ver Ventas', description: 'Puede ver el historial de ventas', category: 'Ventas' },
    { id: 'sales.update', name: 'Editar Ventas', description: 'Puede modificar ventas existentes', category: 'Ventas' },
    { id: 'sales.delete', name: 'Eliminar Ventas', description: 'Puede eliminar ventas', category: 'Ventas' },
    
    // Finanzas
    { id: 'finances.read', name: 'Ver Reportes Financieros', description: 'Puede acceder a reportes financieros', category: 'Finanzas' },
    { id: 'finances.export', name: 'Exportar Reportes', description: 'Puede exportar reportes financieros', category: 'Finanzas' },
    { id: 'finances.settings', name: 'Configurar Finanzas', description: 'Puede configurar parámetros financieros', category: 'Finanzas' },
    
    // Inventario
    { id: 'inventory.create', name: 'Crear Productos', description: 'Puede agregar nuevos productos al inventario', category: 'Inventario' },
    { id: 'inventory.read', name: 'Ver Inventario', description: 'Puede ver el estado del inventario', category: 'Inventario' },
    { id: 'inventory.update', name: 'Editar Inventario', description: 'Puede modificar productos del inventario', category: 'Inventario' },
    { id: 'inventory.delete', name: 'Eliminar Productos', description: 'Puede eliminar productos del inventario', category: 'Inventario' },
    
    // Agenda
    { id: 'agenda.create', name: 'Crear Citas', description: 'Puede programar nuevas citas', category: 'Agenda' },
    { id: 'agenda.read', name: 'Ver Agenda', description: 'Puede ver la agenda de citas', category: 'Agenda' },
    { id: 'agenda.update', name: 'Editar Citas', description: 'Puede modificar citas existentes', category: 'Agenda' },
    { id: 'agenda.delete', name: 'Eliminar Citas', description: 'Puede cancelar citas', category: 'Agenda' },
    
    // Configuración del Sistema
    { id: 'settings.users', name: 'Gestionar Usuarios', description: 'Puede crear y gestionar usuarios del sistema', category: 'Sistema' },
    { id: 'settings.roles', name: 'Gestionar Roles', description: 'Puede crear y gestionar roles y permisos', category: 'Sistema' },
    { id: 'settings.system', name: 'Configuración del Sistema', description: 'Puede modificar configuraciones generales', category: 'Sistema' },
  ];

  // Roles predefinidos
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      permissions: permissions.map(p => p.id)
    },
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Médico con acceso a pacientes y agenda',
      permissions: [
        'patients.read', 'patients.update',
        'quotes.create', 'quotes.read', 'quotes.update',
        'sales.create', 'sales.read',
        'agenda.create', 'agenda.read', 'agenda.update', 'agenda.delete',
        'inventory.read'
      ]
    },
    {
      id: 'assistant',
      name: 'Asistente',
      description: 'Asistente administrativo',
      permissions: [
        'patients.create', 'patients.read', 'patients.update',
        'quotes.create', 'quotes.read', 'quotes.update',
        'sales.create', 'sales.read',
        'agenda.create', 'agenda.read', 'agenda.update',
        'inventory.read', 'inventory.update'
      ]
    },
    {
      id: 'receptionist',
      name: 'Recepcionista',
      description: 'Atención al cliente y agenda',
      permissions: [
        'patients.create', 'patients.read', 'patients.update',
        'quotes.read',
        'agenda.create', 'agenda.read', 'agenda.update',
        'inventory.read'
      ]
    }
  ]);

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  const getCurrentRole = () => roles.find(role => role.id === selectedRole);

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/home');
    }
  };

  // Master data handlers
  const handleAddDistrict = async () => {
    if (!newDistrict.name) {
      toast.error('Por favor ingrese el nombre del distrito');
      return;
    }

    try {
      await createDistrict(newDistrict);
      toast.success('Distrito agregado exitosamente');
      setNewDistrict({ name: '', status: true });
      setIsAddDistrictOpen(false);
    } catch (error) {
      toast.error('Error al agregar distrito');
    }
  };

  const handleAddGender = async () => {
    if (!newGender.code || !newGender.name) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      await createAllGender(newGender);
      toast.success('Género agregado exitosamente');
      setNewGender({ code: '', name: '', status: true });
      setIsAddGenderOpen(false);
    } catch (error) {
      toast.error('Error al agregar género');
    }
  };

  const handleAddDocumentType = async () => {
    if (!newDocumentType.code || !newDocumentType.name) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      await createAllDocumentType(newDocumentType);
      toast.success('Tipo de documento agregado exitosamente');
      setNewDocumentType({ code: '', name: '', status: true });
      setIsAddDocumentTypeOpen(false);
    } catch (error) {
      toast.error('Error al agregar tipo de documento');
    }
  };

  if (isLoading || gendersLoading || documentTypesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="text-sakura-red hover:text-sakura-red-dark"
            >
              <ArrowUp className="h-6 w-6 rotate-[-90deg]" />
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-sakura-red" />
              <h1 className="text-xl font-bold text-sakura-red">Configuración</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Sidebar de navegación */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="bg-white rounded-lg shadow p-4 sticky top-8">
            <ul className="space-y-2">
              {SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <button
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors text-left font-medium text-sm ${
                        activeSection === section.id
                          ? 'bg-sakura-red text-white shadow' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-5 w-5" />
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 space-y-8">
          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Nombre del sistema</Label>
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    value={systemName}
                    onChange={e => setSystemName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Logo</Label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" className="hidden" id="logo-upload" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setLogo(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                    <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100">
                      <Image className="h-4 w-4" /> Subir imagen
                    </label>
                    {logo && <img src={logo} alt="Logo" className="h-10 w-10 rounded object-cover border" />}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Idioma</Label>
                  <select className="border rounded px-3 py-2 flex-1" value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                  </select>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Zona horaria</Label>
                  <select className="border rounded px-3 py-2 flex-1" value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="GMT-5">GMT-5 (Perú, Colombia, Ecuador)</option>
                    <option value="GMT-3">GMT-3 (Argentina, Brasil)</option>
                    <option value="GMT-6">GMT-6 (Centroamérica)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Acceso y Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Doble autenticación</Label>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
                {/* Panel de roles y permisos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Roles Panel */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Roles</h3>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedRole === role.id
                              ? 'bg-sakura-red text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium">{role.name}</div>
                          <div className={`text-sm ${selectedRole === role.id ? 'text-sakura-red-light' : 'text-gray-500'}`}>{role.description}</div>
                          <Badge variant="secondary" className="mt-1">{role.permissions.length} permisos</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Permissions Panel */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4" /> Permisos</h3>
                    <div className="space-y-4">
                      {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
                          <div className="space-y-2">
                            {categoryPermissions.map((permission) => {
                              const hasPermission = getCurrentRole()?.permissions.includes(permission.id);
                              return (
                                <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <div>
                                    <div className="font-medium text-gray-800">{permission.name}</div>
                                    <div className="text-xs text-gray-600">{permission.description}</div>
                                  </div>
                                  <Switch
                                    checked={hasPermission}
                                    onCheckedChange={() => handlePermissionToggle(selectedRole, permission.id)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Tema</Label>
                  <div className="flex items-center gap-4">
                    <Button variant={darkMode ? 'outline' : 'default'} onClick={() => setDarkMode(false)}><Sun className="h-4 w-4 mr-1" /> Claro</Button>
                    <Button variant={darkMode ? 'default' : 'outline'} onClick={() => setDarkMode(true)}><Moon className="h-4 w-4 mr-1" /> Oscuro</Button>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Color principal</Label>
                  <input type="color" value={mainColor} onChange={e => setMainColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent" />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Email</Label>
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Notificaciones por email</Label>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Integraciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">Webhooks</Label>
                  <Button variant="outline" className="ml-auto">Gestionar</Button>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="w-40">API Keys</Label>
                  <Button variant="outline" className="ml-auto">Gestionar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'masterdata' && (
            <div className="space-y-6">
              {/* Districts Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Distritos
                    </CardTitle>
                    <Dialog open={isAddDistrictOpen} onOpenChange={setIsAddDistrictOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-sakura-red hover:bg-sakura-red-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Distrito
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Distrito</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="district-name">Nombre</Label>
                            <Input
                              id="district-name"
                              value={newDistrict.name}
                              onChange={(e) => setNewDistrict({ ...newDistrict, name: e.target.value })}
                              placeholder="Ingrese el nombre del distrito"
                            />
                          </div>
                          <Button onClick={handleAddDistrict} className="w-full">
                            Agregar Distrito
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {districts.map((district) => (
                      <div key={district.district_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{district.name}</span>
                        <Badge variant={district.status ? 'default' : 'secondary'}>
                          {district.status ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Genders Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Géneros
                    </CardTitle>
                    <Dialog open={isAddGenderOpen} onOpenChange={setIsAddGenderOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-sakura-red hover:bg-sakura-red-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Género
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Género</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="gender-code">Código</Label>
                            <Input
                              id="gender-code"
                              value={newGender.code}
                              onChange={(e) => setNewGender({ ...newGender, code: e.target.value })}
                              placeholder="M/F/O"
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender-name">Nombre</Label>
                            <Input
                              id="gender-name"
                              value={newGender.name}
                              onChange={(e) => setNewGender({ ...newGender, name: e.target.value })}
                              placeholder="Masculino/Femenino/Otro"
                            />
                          </div>
                          <Button onClick={handleAddGender} className="w-full">
                            Agregar Género
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {genders.map((gender) => (
                      <div key={gender.gender_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{gender.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({gender.code})</span>
                        </div>
                        <Badge variant={gender.status ? 'default' : 'secondary'}>
                          {gender.status ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Types Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Tipos de Documento
                    </CardTitle>
                    <Dialog open={isAddDocumentTypeOpen} onOpenChange={setIsAddDocumentTypeOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-sakura-red hover:bg-sakura-red-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Tipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Tipo de Documento</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="doc-code">Código</Label>
                            <Input
                              id="doc-code"
                              value={newDocumentType.code}
                              onChange={(e) => setNewDocumentType({ ...newDocumentType, code: e.target.value })}
                              placeholder="DNI/CE/PAS"
                            />
                          </div>
                          <div>
                            <Label htmlFor="doc-name">Nombre</Label>
                            <Input
                              id="doc-name"
                              value={newDocumentType.name}
                              onChange={(e) => setNewDocumentType({ ...newDocumentType, name: e.target.value })}
                              placeholder="Documento Nacional de Identidad"
                            />
                          </div>
                          <Button onClick={handleAddDocumentType} className="w-full">
                            Agregar Tipo
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documentTypes.map((docType) => (
                      <div key={docType.document_type_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{docType.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({docType.code})</span>
                        </div>
                        <Badge variant={docType.status ? 'default' : 'secondary'}>
                          {docType.status ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsManagement; 