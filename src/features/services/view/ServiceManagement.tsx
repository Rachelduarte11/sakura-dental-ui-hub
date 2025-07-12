import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Search, Plus, Edit, Trash2, ArrowUp, Loader2 } from 'lucide-react';
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
import { useServiceStore, type Service } from '@/shared/stores';
import { toast } from 'sonner';

interface ServiceManagementProps {
  onBack: () => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const { 
    services, 
    categories,
    isLoading, 
    error, 
    fetchServices, 
    fetchCategories,
    createService, 
    updateService, 
    deleteService,
    setFilters,
    clearError 
  } = useServiceStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

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

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(services.map(s => s.categorie_service_id).filter(Boolean)));
    return ['Todas', ...unique];
  }, [services]);

  const filteredServices = services.filter(service =>
    (service.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'Todas' || service.categorie_service_id?.toString() === selectedCategory)
  );

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      if (editingService) {
        await updateService(editingService.service_id, {
          name: data.nombre,
          description: data.descripcion,
          base_price: data.precio,
          status: data.activo
        });
        toast.success('Servicio actualizado exitosamente');
      } else {
        await createService({
          name: data.nombre,
          description: data.descripcion,
          base_price: data.precio,
          status: data.activo,
          categorie_service_id: 1 // TODO: Permitir selección de categoría
        });
        toast.success('Servicio creado exitosamente');
      }
      setEditingService(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar el servicio');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: number) => {
    try {
      await deleteService(serviceId);
      toast.success('Servicio eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el servicio');
    }
  };

  const toggleServiceStatus = async (serviceId: number) => {
    try {
      const service = services.find(s => s.service_id === serviceId);
      if (service) {
        await updateService(serviceId, {
          status: !service.status
        });
        toast.success('Estado del servicio actualizado');
      }
    } catch (error) {
      toast.error('Error al actualizar el estado del servicio');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando servicios...</span>
        </div>
      </div>
    );
  }

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
                                 initialData={editingService ? {
                   nombre: editingService.name,
                   descripcion: editingService.description || '',
                   precio: editingService.base_price,
                   categoria: editingService.categorie_service_id?.toString() || '',
                   activo: editingService.status
                 } : {
                  nombre: '',
                  descripcion: '',
                  precio: 0,
                  categoria: '',
                  activo: true
                }}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
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
            placeholder="Buscar servicios..."
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Categoría: {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categoryOptions.map((category) => (
                             <DropdownMenuItem
                 key={category}
                 onClick={() => setSelectedCategory(category.toString())}
               >
                 {category}
               </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Services List */}
      <div className="p-4">
        <List
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleServiceStatus}
        />
      </div>
    </div>
  );
};

export default ServiceManagement;
