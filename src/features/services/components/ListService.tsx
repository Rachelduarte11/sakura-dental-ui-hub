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

export interface ServiceListItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
}

interface ServiceListProps {
  services: ServiceListItem[];
  onEdit?: (service: ServiceListItem) => void;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {services.map(service => (
        <Card key={service.id} className="shadow-sm border-sakura-gray-medium/30 hover:shadow-md transition-shadow relative">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-xs text-gray-800 truncate">{service.nombre}</span>
              <Badge 
                variant="secondary" 
                className={service.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              >
                {service.activo ? 'Activo' : 'Inactivo'}
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
                      <DropdownMenuItem onClick={() => onToggleStatus(service.id)}>
                        {service.activo ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(service.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1 line-clamp-2">{service.descripcion}</p>
            <div className="text-xs text-gray-700 mb-1">
              <span className="font-medium">Precio:</span> S/ {service.precio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Categoría:</span> {service.categoria}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList; 