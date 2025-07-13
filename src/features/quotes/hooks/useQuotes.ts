import { useEffect, useCallback } from 'react';
import { useQuotesStore } from '../store/quotesStore';
import type { Quote, QuoteWithItems, QuoteFilters, CreateQuoteRequest, UpdateQuoteRequest } from '../api/types';

export const useQuotes = () => {
  const {
    quotes,
    selectedQuote,
    isLoading,
    error,
    filters,
    fetchQuotes,
    fetchQuoteById,
    fetchQuotesByPatient,
    createQuote,
    updateQuote,
    deleteQuote,
    approveQuote,
    rejectQuote,
    completeQuote,
    setSelectedQuote,
    setFilters,
    clearError,
  } = useQuotesStore();

  // Cargar cotizaciones al montar el componente
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Hook para manejar búsqueda
  const handleSearch = useCallback((search: string) => {
    setFilters({ search });
  }, [setFilters]);

  // Hook para manejar filtros de estado
  const handleStatusFilter = useCallback((status: string | null) => {
    setFilters({ status });
  }, [setFilters]);

  // Hook para manejar filtros de paciente
  const handlePatientFilter = useCallback((patientId: number | null) => {
    setFilters({ patientId });
  }, [setFilters]);

  // Hook para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({ search: '', status: null, patientId: null });
  }, [setFilters]);

  // Hook para obtener cotización por ID
  const getQuoteById = useCallback(async (id: number) => {
    await fetchQuoteById(id);
  }, [fetchQuoteById]);

  // Hook para obtener cotizaciones por paciente
  const getQuotesByPatient = useCallback(async (patientId: number) => {
    await fetchQuotesByPatient(patientId);
  }, [fetchQuotesByPatient]);

  // Hook para crear cotización
  const handleCreateQuote = useCallback(async (quote: CreateQuoteRequest) => {
    await createQuote(quote);
  }, [createQuote]);

  // Hook para actualizar cotización
  const handleUpdateQuote = useCallback(async (id: number, quote: UpdateQuoteRequest) => {
    await updateQuote(id, quote);
  }, [updateQuote]);

  // Hook para eliminar cotización
  const handleDeleteQuote = useCallback(async (id: number) => {
    await deleteQuote(id);
  }, [deleteQuote]);

  // Hook para aprobar cotización
  const handleApproveQuote = useCallback(async (id: number) => {
    await approveQuote(id);
  }, [approveQuote]);

  // Hook para rechazar cotización
  const handleRejectQuote = useCallback(async (id: number, reason?: string) => {
    await rejectQuote(id, reason);
  }, [rejectQuote]);

  // Hook para completar cotización
  const handleCompleteQuote = useCallback(async (id: number) => {
    await completeQuote(id);
  }, [completeQuote]);

  // Hook para seleccionar cotización
  const selectQuote = useCallback((quote: QuoteWithItems | null) => {
    setSelectedQuote(quote);
  }, [setSelectedQuote]);

  // Hook para limpiar error
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    quotes,
    selectedQuote,
    isLoading,
    error,
    filters,
    
    // Actions
    fetchQuotes,
    handleSearch,
    handleStatusFilter,
    handlePatientFilter,
    clearFilters,
    getQuoteById,
    getQuotesByPatient,
    handleCreateQuote,
    handleUpdateQuote,
    handleDeleteQuote,
    handleApproveQuote,
    handleRejectQuote,
    handleCompleteQuote,
    selectQuote,
    handleClearError,
  };
};

// Hook específico para una cotización individual
export const useQuote = (quoteId?: number) => {
  const { selectedQuote, isLoading, error, fetchQuoteById } = useQuotesStore();

  useEffect(() => {
    if (quoteId) {
      fetchQuoteById(quoteId);
    }
  }, [quoteId, fetchQuoteById]);

  return {
    quote: selectedQuote,
    isLoading,
    error,
  };
};

// Hook para filtros de cotizaciones
export const useQuoteFilters = () => {
  const { filters, setFilters } = useQuotesStore();

  const updateFilters = useCallback((newFilters: Partial<QuoteFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', status: null, patientId: null });
  }, [setFilters]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};

// Hook para acciones de estado de cotizaciones
export const useQuoteActions = () => {
  const { approveQuote, rejectQuote, completeQuote } = useQuotesStore();

  const handleApprove = useCallback(async (id: number) => {
    await approveQuote(id);
  }, [approveQuote]);

  const handleReject = useCallback(async (id: number, reason?: string) => {
    await rejectQuote(id, reason);
  }, [rejectQuote]);

  const handleComplete = useCallback(async (id: number) => {
    await completeQuote(id);
  }, [completeQuote]);

  return {
    handleApprove,
    handleReject,
    handleComplete,
  };
}; 