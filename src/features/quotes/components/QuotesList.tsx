'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { useQuotes } from '../hooks/useQuotes';
import type { QuoteWithItems } from '../api/types';

interface QuotesListProps {
  onQuoteSelect?: (quote: QuoteWithItems) => void;
  onAddQuote?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'approved':
      return 'Aprobada';
    case 'rejected':
      return 'Rechazada';
    case 'completed':
      return 'Completada';
    default:
      return status;
  }
};

export const QuotesList: React.FC<QuotesListProps> = ({ 
  onQuoteSelect, 
  onAddQuote 
}) => {
  const {
    quotes,
    isLoading,
    error,
    handleSearch,
    handleStatusFilter,
    clearFilters,
    handleDeleteQuote,
    handleApproveQuote,
    handleRejectQuote,
    handleCompleteQuote,
  } = useQuotes();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleStatusChange = (status: string | null) => {
    handleStatusFilter(status);
  };

  const handleDelete = async (quoteId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
      await handleDeleteQuote(quoteId);
    }
  };

  const handleApprove = async (quoteId: number) => {
    if (confirm('¿Estás seguro de que quieres aprobar esta cotización?')) {
      await handleApproveQuote(quoteId);
    }
  };

  const handleReject = async (quoteId: number) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason !== null) {
      await handleRejectQuote(quoteId, reason);
    }
  };

  const handleComplete = async (quoteId: number) => {
    if (confirm('¿Estás seguro de que quieres marcar esta cotización como completada?')) {
      await handleCompleteQuote(quoteId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando cotizaciones...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-8">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Cotizaciones ({quotes.length})</CardTitle>
          {onAddQuote && (
            <Button onClick={onAddQuote} size="sm">
              Nueva Cotización
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-4 space-y-2">
          <Input
            placeholder="Buscar cotizaciones..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(null)}
            >
              Todas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('pending')}
            >
              Pendientes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('approved')}
            >
              Aprobadas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('rejected')}
            >
              Rechazadas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('completed')}
            >
              Completadas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Lista de cotizaciones */}
        <div className="space-y-2">
          {quotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron cotizaciones
            </div>
          ) : (
            quotes.map((quote) => (
              <div
                key={quote.quotation_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Cotización #{quote.quotation_id}
                    </h3>
                    <Badge className={getStatusColor(quote.status)}>
                      {getStatusText(quote.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Paciente ID: {quote.patient_id}</div>
                    <div>Total: S/. {quote.total_amount.toFixed(2)}</div>
                    <div>Fecha: {new Date(quote.created_at).toLocaleDateString()}</div>
                    {quote.notes && <div>Notas: {quote.notes}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onQuoteSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuoteSelect(quote as QuoteWithItems)}
                    >
                      Ver
                    </Button>
                  )}
                  {quote.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(quote.quotation_id)}
                        className="text-green-600"
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(quote.quotation_id)}
                        className="text-red-600"
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                  {quote.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleComplete(quote.quotation_id)}
                      className="text-blue-600"
                    >
                      Completar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(quote.quotation_id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 