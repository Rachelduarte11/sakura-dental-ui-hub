import { useState, useCallback } from 'react';
import { apiClient } from '../utils/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiActions<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<{ data: T }>,
  initialData: T | null = null
): UseApiState<T> & UseApiActions<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        setState(prev => ({ 
          ...prev, 
          data: response.data, 
          loading: false 
        }));
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          loading: false 
        }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

// Hook específico para operaciones CRUD
export function useCrudApi<T = any>(
  baseApi: {
    getAll: (params?: Record<string, any>) => Promise<{ data: T[] }>;
    getById: (id: number) => Promise<{ data: T }>;
    create: (data: any) => Promise<{ data: T }>;
    update: (id: number, data: any) => Promise<{ data: T }>;
    delete: (id: number) => Promise<{ data: any }>;
  }
) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseApi.getAll(params);
      setItems(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseApi]);

  const fetchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseApi.getById(id);
      setSelectedItem(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseApi]);

  const create = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseApi.create(data);
      setItems(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseApi]);

  const update = useCallback(async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseApi.update(id, data);
      setItems(prev => prev.map(item => 
        (item as any).id === id ? response.data : item
      ));
      if (selectedItem && (selectedItem as any).id === id) {
        setSelectedItem(response.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseApi, selectedItem]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await baseApi.delete(id);
      setItems(prev => prev.filter(item => (item as any).id !== id));
      if (selectedItem && (selectedItem as any).id === id) {
        setSelectedItem(null);
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [baseApi, selectedItem]);

  const reset = useCallback(() => {
    setItems([]);
    setSelectedItem(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    items,
    selectedItem,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    reset,
    setSelectedItem,
  };
} 