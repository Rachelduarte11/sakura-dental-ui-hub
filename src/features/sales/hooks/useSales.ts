import { useEffect, useCallback } from 'react';
import { useSalesStore } from '../store/salesStore';
import type { 
  Sale, 
  SaleWithDetails, 
  SalesFilters, 
  CreateSaleRequest, 
  UpdateSaleRequest 
} from '../api/types';

export const useSales = () => {
  const {
    sales,
    salesSummary,
    selectedSale,
    isLoading,
    error,
    filters,
    fetchSales,
    fetchSaleById,
    fetchSalesSummary,
    fetchSalesByPatient,
    fetchSalesByQuotation,
    createSale,
    updateSale,
    deleteSale,
    completeSale,
    cancelSale,
    refundSale,
    generateInvoice,
    setSelectedSale,
    setFilters,
    clearError,
  } = useSalesStore();

  // Cargar ventas al montar el componente
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Hook para manejar búsqueda
  const handleSearch = useCallback((search: string) => {
    setFilters({ search });
  }, [setFilters]);

  // Hook para manejar filtros de estado
  const handleStatusFilter = useCallback((status: string | null) => {
    setFilters({ status });
  }, [setFilters]);

  // Hook para manejar filtros de estado de pago
  const handlePaymentStatusFilter = useCallback((paymentStatus: string | null) => {
    setFilters({ paymentStatus });
  }, [setFilters]);

  // Hook para manejar filtros de paciente
  const handlePatientFilter = useCallback((patientId: number | null) => {
    setFilters({ patientId });
  }, [setFilters]);

  // Hook para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({ search: '', status: null, paymentStatus: null, patientId: null });
  }, [setFilters]);

  // Hook para obtener venta por ID
  const getSaleById = useCallback(async (id: number) => {
    await fetchSaleById(id);
  }, [fetchSaleById]);

  // Hook para obtener resumen de ventas
  const getSalesSummary = useCallback(async (params?: { dateFrom?: string; dateTo?: string }) => {
    await fetchSalesSummary(params);
  }, [fetchSalesSummary]);

  // Hook para obtener ventas por paciente
  const getSalesByPatient = useCallback(async (patientId: number) => {
    await fetchSalesByPatient(patientId);
  }, [fetchSalesByPatient]);

  // Hook para obtener ventas por cotización
  const getSalesByQuotation = useCallback(async (quotationId: number) => {
    await fetchSalesByQuotation(quotationId);
  }, [fetchSalesByQuotation]);

  // Hook para crear venta
  const handleCreateSale = useCallback(async (sale: CreateSaleRequest) => {
    await createSale(sale);
  }, [createSale]);

  // Hook para actualizar venta
  const handleUpdateSale = useCallback(async (id: number, sale: UpdateSaleRequest) => {
    await updateSale(id, sale);
  }, [updateSale]);

  // Hook para eliminar venta
  const handleDeleteSale = useCallback(async (id: number) => {
    await deleteSale(id);
  }, [deleteSale]);

  // Hook para completar venta
  const handleCompleteSale = useCallback(async (id: number) => {
    await completeSale(id);
  }, [completeSale]);

  // Hook para cancelar venta
  const handleCancelSale = useCallback(async (id: number, reason?: string) => {
    await cancelSale(id, reason);
  }, [cancelSale]);

  // Hook para reembolsar venta
  const handleRefundSale = useCallback(async (id: number, reason?: string) => {
    await refundSale(id, reason);
  }, [refundSale]);

  // Hook para generar factura
  const handleGenerateInvoice = useCallback(async (id: number) => {
    return await generateInvoice(id);
  }, [generateInvoice]);

  // Hook para seleccionar venta
  const selectSale = useCallback((sale: SaleWithDetails | null) => {
    setSelectedSale(sale);
  }, [setSelectedSale]);

  // Hook para limpiar error
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    sales,
    salesSummary,
    selectedSale,
    isLoading,
    error,
    filters,
    
    // Actions
    fetchSales,
    handleSearch,
    handleStatusFilter,
    handlePaymentStatusFilter,
    handlePatientFilter,
    clearFilters,
    getSaleById,
    getSalesSummary,
    getSalesByPatient,
    getSalesByQuotation,
    handleCreateSale,
    handleUpdateSale,
    handleDeleteSale,
    handleCompleteSale,
    handleCancelSale,
    handleRefundSale,
    handleGenerateInvoice,
    selectSale,
    handleClearError,
  };
};

// Hook específico para una venta individual
export const useSale = (saleId?: number) => {
  const { selectedSale, isLoading, error, fetchSaleById } = useSalesStore();

  useEffect(() => {
    if (saleId) {
      fetchSaleById(saleId);
    }
  }, [saleId, fetchSaleById]);

  return {
    sale: selectedSale,
    isLoading,
    error,
  };
};

// Hook para filtros de ventas
export const useSalesFilters = () => {
  const { filters, setFilters } = useSalesStore();

  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', status: null, paymentStatus: null, patientId: null });
  }, [setFilters]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};

// Hook para acciones de estado de ventas
export const useSalesActions = () => {
  const { completeSale, cancelSale, refundSale, generateInvoice } = useSalesStore();

  const handleComplete = useCallback(async (id: number) => {
    await completeSale(id);
  }, [completeSale]);

  const handleCancel = useCallback(async (id: number, reason?: string) => {
    await cancelSale(id, reason);
  }, [cancelSale]);

  const handleRefund = useCallback(async (id: number, reason?: string) => {
    await refundSale(id, reason);
  }, [refundSale]);

  const handleGenerateInvoice = useCallback(async (id: number) => {
    return await generateInvoice(id);
  }, [generateInvoice]);

  return {
    handleComplete,
    handleCancel,
    handleRefund,
    handleGenerateInvoice,
  };
};

// Hook para resumen de ventas
export const useSalesSummary = () => {
  const { salesSummary, isLoading, error, fetchSalesSummary } = useSalesStore();

  const getSummary = useCallback(async (params?: { dateFrom?: string; dateTo?: string }) => {
    await fetchSalesSummary(params);
  }, [fetchSalesSummary]);

  return {
    summary: salesSummary,
    isLoading,
    error,
    getSummary,
  };
}; 