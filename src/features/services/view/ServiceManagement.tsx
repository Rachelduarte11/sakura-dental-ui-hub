import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Search, Plus, Edit, Trash2, ArrowUp } from 'lucide-react';
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
import FormService, { ServiceFormData } from '../components/FormService';
import List from '../components/ListService';
import { useMemo } from 'react';

interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
}

interface ServiceManagementProps {
  onBack: () => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      nombre: "Limpieza Dental",
      descripcion: "Limpieza profesional completa con ultrasonido y pulido",
      precio: 80,
      categoria: "Preventivo",
      activo: true
    },
    {
      id: 2,
      nombre: "Blanqueamiento Dental",
      descripcion: "Blanqueamiento profesional con gel de peróxido",
      precio: 350,
      categoria: "Estético",
      activo: true
    },
    {
      id: 3,
      nombre: "Tratamiento de Conducto",
      descripcion: "Endodoncia completa con obturación",
      precio: 450,
      categoria: "Endodoncia",
      activo: true
    },
    {
      id: 4,
      nombre: "Corona Dental",
      descripcion: "Corona de porcelana o zirconia",
      precio: 800,
      categoria: "Prótesis",
      activo: true
    }
  ]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    activo: true
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map(s => s.categoria).filter(Boolean)));
    return ['Todas', ...unique];
  }, [services]);

  const filteredServices = services.filter(service =>
    (service.nombre.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'Todas' || service.categoria === selectedCategory)
  );

  const handleSubmit = (data: ServiceFormData) => {
    if (editingService) {
      setServices(services.map(service =>
        service.id === editingService.id
          ? { ...service, ...data, categoria: data.categoria || '' }
          : service
      ));
    } else {
      const newService: Service = {
        id: services.length + 1,
        ...data,
        categoria: data.categoria || ''
      };
      setServices([...services, newService]);
    }
    setFormData({ nombre: '', descripcion: '', precio: 0, categoria: '', activo: true });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio,
      categoria: service.categoria,
      activo: service.activo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: number) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const toggleServiceStatus = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, activo: !service.activo }
        : service
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
            <div className="text-sakura-red px-4 py-2 rounded-lg">
              <h1 className="text-lg font-semibold text-black">Gestión de Servicios</h1>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-sakura-red hover:bg-sakura-red-dark text-white"
                onClick={() => {
                  setEditingService(null);
                  setFormData({ nombre: '', descripcion: '', precio: 0, categoria: '', activo: true });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sakura-red">
                  {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                </DialogTitle>
              </DialogHeader>
              <FormService
                initialData={formData}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
                  setFormData({ nombre: '', descripcion: '', precio: 0, categoria: '', activo: true });
                }}
                submitButtonText={editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar y Filtro de Categoría */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar servicio por nombre"
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-12 px-3 py-2 text-sm rounded-xl border border-sakura-gray-medium focus:border-sakura-red focus:ring-sakura-red/20 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services List */}
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>
        <List
          services={filteredServices}
          onEdit={handleEdit}
          onToggleStatus={toggleServiceStatus}
          onDelete={handleDelete}
        />
        {filteredServices.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No se encontraron servicios</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
