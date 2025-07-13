import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { type Service } from '../api/types';
import { useCategorieServiceStore } from '../store/categorieServiceStore';

interface ServiceListProps {
  services: Service[];
  onEdit?: (service: Service) => void;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onEdit, onToggleStatus, onDelete }) => {
  const { categories } = useCategorieServiceStore();

  const getCategoryName = (id: number) => {
    if (!categories.length) return 'Cargando...';
    const cat = categories.find(c => c.categorieServiceId === id);
    return cat ? cat.name : 'Sin categoría';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {services.map(service => (
        <Card key={service.serviceId} className="shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow relative">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-xs text-gray-800 truncate">{service.name}</span>
              <Badge 
                variant="secondary" 
                className={service.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              >
                {service.status ? 'Activo' : 'Inactivo'}
              </Badge>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-slate-100 focus:outline-none">
                      <MoreVertical className="h-4 w-4 text-sakura-gray" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-sakura-gray-medium">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(service)}>
                        <Edit className="h-4 w-4 mr-2" />Editar
                      </DropdownMenuItem>
                    )}
                    {onToggleStatus && (
                      <DropdownMenuItem onClick={() => onToggleStatus(service.serviceId)}>
                        {service.status ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(service.serviceId)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1 line-clamp-2">{service.description}</p>
            <div className="text-xs text-gray-700 mb-1">
              <span className="font-medium">Precio:</span> S/ {(service.basePrice ?? 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Categoría:</span> {getCategoryName(service.categorieServiceId)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList; 