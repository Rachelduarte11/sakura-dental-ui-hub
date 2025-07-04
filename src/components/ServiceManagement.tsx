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

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'PEN' | 'USD';
  category: string;
  duration: number; // in minutes
  isActive: boolean;
}

interface ServiceManagementProps {
  onBack: () => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'PEN' as 'PEN' | 'USD',
    category: '',
    duration: ''
  });

  // Mock data for services
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Limpieza Dental",
      description: "Limpieza profesional completa con ultrasonido y pulido",
      price: 80,
      currency: 'PEN',
      category: "Preventivo",
      duration: 45,
      isActive: true
    },
    {
      id: 2,
      name: "Blanqueamiento Dental",
      description: "Blanqueamiento profesional con gel de peróxido",
      price: 350,
      currency: 'PEN',
      category: "Estético",
      duration: 90,
      isActive: true
    },
    {
      id: 3,
      name: "Tratamiento de Conducto",
      description: "Endodoncia completa con obturación",
      price: 450,
      currency: 'PEN',
      category: "Endodoncia",
      duration: 120,
      isActive: true
    },
    {
      id: 4,
      name: "Corona Dental",
      description: "Corona de porcelana o zirconia",
      price: 800,
      currency: 'PEN',
      category: "Prótesis",
      duration: 60,
      isActive: true
    }
  ]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.price),
              currency: formData.currency,
              category: formData.category,
              duration: parseInt(formData.duration)
            }
          : service
      ));
    } else {
      // Add new service
      const newService: Service = {
        id: services.length + 1,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        duration: parseInt(formData.duration),
        isActive: true
      };
      setServices([...services, newService]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'PEN',
      category: '',
      duration: ''
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      currency: service.currency,
      category: service.category,
      duration: service.duration.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: number) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const toggleServiceStatus = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="mb-4 shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-800 text-lg">{service.name}</h3>
              <Badge 
                variant="secondary" 
                className={service.isActive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
                }
              >
                {service.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Precio:</strong> {service.currency === 'PEN' ? 'S/' : '$'} {service.price.toFixed(2)}</p>
              <p><strong>Categoría:</strong> {service.category}</p>
              <p><strong>Duración:</strong> {service.duration} minutos</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-sakura-gray hover:text-sakura-red">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
              <DropdownMenuItem onClick={() => handleEdit(service)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleServiceStatus(service.id)}>
                {service.isActive ? 'Desactivar' : 'Activar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-red-600">
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
            <div className="bg-sakura-red px-4 py-2 rounded-lg">
              <h1 className="text-lg font-semibold text-black">Gestión de Servicios</h1>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-sakura-red hover:bg-sakura-red-dark text-white"
                onClick={() => {
                  setEditingService(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    currency: 'PEN',
                    category: '',
                    duration: ''
                  });
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Servicio</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Limpieza Dental"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción del servicio"
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      required
                      className="focus:border-sakura-red focus:ring-sakura-red/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value as 'PEN' | 'USD'})}
                      className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus:border-sakura-red focus:ring-sakura-red/20"
                    >
                      <option value="PEN">Soles (PEN)</option>
                      <option value="USD">Dólares (USD)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Ej: Preventivo, Estético, Endodoncia"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="60"
                    required
                    className="focus:border-sakura-red focus:ring-sakura-red/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-sakura-red hover:bg-sakura-red-dark text-white"
                >
                  {editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
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
            placeholder="Buscar servicio por nombre o categoría"
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          
          {filteredServices.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No se encontraron servicios</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
