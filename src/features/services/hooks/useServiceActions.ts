import { useServiceStore } from '../store/serviceStore';
import { toast } from 'sonner';

export const useServiceActions = () => {
  const {
    createService,
    updateService,
    deleteService,
    fetchServices,
    fetchCategories,
    setFilters,
    clearError,
    ...rest
  } = useServiceStore();

  const handleCreate = async (data) => {
    try {
      await createService(data);
      toast.success('Servicio creado exitosamente');
    } catch {
      toast.error('Error al crear el servicio');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateService(id, data);
      toast.success('Servicio actualizado exitosamente');
    } catch {
      toast.error('Error al actualizar el servicio');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      toast.success('Servicio eliminado exitosamente');
    } catch {
      toast.error('Error al eliminar el servicio');
    }
  };

  return {
    ...rest,
    fetchServices,
    fetchCategories,
    setFilters,
    clearError,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}; 