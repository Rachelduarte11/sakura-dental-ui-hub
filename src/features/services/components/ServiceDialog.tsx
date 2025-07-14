import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import FormService, { ServiceFormData } from './FormService';
import { Service } from '../api/types';

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingService: Service | null;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
}

export const ServiceDialog: React.FC<Props> = ({ isDialogOpen, setIsDialogOpen, editingService, onSubmit, onCancel }) => (
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    
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
          precio: editingService.price,
          categoria: editingService.categorie_service_id?.toString() || '',
          activo: editingService.status
        } : {
          nombre: '',
          descripcion: '',
          precio: 0,
          categoria: '',
          activo: true
        }}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitButtonText={editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
      />
    </DialogContent>
  </Dialog>
); 