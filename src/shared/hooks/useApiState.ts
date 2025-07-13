import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

interface UseApiStateOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useApiState<T>(
  initialData: T | null = null,
  options: UseApiStateOptions = {}
): ApiState<T> & {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = !data || (Array.isArray(data) && data.length === 0);

  // Mostrar toast de error
  useEffect(() => {
    if (error && options.showErrorToast) {
      toast.error(error);
    }
  }, [error, options.showErrorToast]);

  // Mostrar toast de éxito
  useEffect(() => {
    if (data && options.showSuccessToast && options.successMessage) {
      toast.success(options.successMessage);
    }
  }, [data, options.showSuccessToast, options.successMessage]);

  const reset = () => {
    setData(null);
    setIsLoading(false);
    setError(null);
  };

  return {
    data,
    isLoading,
    error,
    isEmpty,
    setData,
    setLoading: setIsLoading,
    setError,
    reset,
  };
}

// Hook específico para listas
export function useListState<T>(
  options: UseApiStateOptions = {}
) {
  return useApiState<T[]>(null, options);
}

// Hook para manejar operaciones CRUD
export function useCrudState<T>(
  options: UseApiStateOptions = {}
) {
  const state = useApiState<T[]>(null, options);

  const handleCreate = async (createFn: () => Promise<T>) => {
    try {
      state.setLoading(true);
      state.setError(null);
      const newItem = await createFn();
      state.setData([...(state.data || []), newItem]);
      return newItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear';
      state.setError(errorMessage);
      throw error;
    } finally {
      state.setLoading(false);
    }
  };

  const handleUpdate = async (id: number, updateFn: () => Promise<T>) => {
    try {
      state.setLoading(true);
      state.setError(null);
      const updatedItem = await updateFn();
      state.setData(
        (state.data || []).map(item => 
          (item as any).id === id ? updatedItem : item
        )
      );
      return updatedItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar';
      state.setError(errorMessage);
      throw error;
    } finally {
      state.setLoading(false);
    }
  };

  const handleDelete = async (id: number, deleteFn: () => Promise<void>) => {
    try {
      state.setLoading(true);
      state.setError(null);
      await deleteFn();
      state.setData(
        (state.data || []).filter(item => (item as any).id !== id)
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar';
      state.setError(errorMessage);
      throw error;
    } finally {
      state.setLoading(false);
    }
  };

  return {
    ...state,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
} 