'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { useSales } from '../hooks/useSales';
import type { SaleWithDetails } from '../api/types';

interface SalesListProps {
  onSaleSelect?: (sale: SaleWithDetails) => void;
  onAddSale?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'completed':
      return 'Completada';
    case 'cancelled':
      return 'Cancelada';
    case 'refunded':
      return 'Reembolsada';
    default:
      return status;
  }
};

const getPaymentStatusColor = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'partial':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusText = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'pending':
      return 'Pendiente';
    case 'partial':
      return 'Parcial';
    case 'completed':
      return 'Completado';
    default:
      return paymentStatus;
  }
};

export const SalesList: React.FC<SalesListProps> = ({ 
  onSaleSelect, 
  onAddSale 
}) => {
  const {
    sales,
    isLoading,
    error,
    handleSearch,
    handleStatusFilter,
    handlePaymentStatusFilter,
    clearFilters,
    handleDeleteSale,
    handleCompleteSale,
    handleCancelSale,
    handleRefundSale,
    handleGenerateInvoice,
  } = useSales();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleStatusChange = (status: string | null) => {
    handleStatusFilter(status);
  };

  const handlePaymentStatusChange = (paymentStatus: string | null) => {
    handlePaymentStatusFilter(paymentStatus);
  };

  const handleDelete = async (saleId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      await handleDeleteSale(saleId);
    }
  };

  const handleComplete = async (saleId: number) => {
    if (confirm('¿Estás seguro de que quieres completar esta venta?')) {
      await handleCompleteSale(saleId);
    }
  };

  const handleCancel = async (saleId: number) => {
    const reason = prompt('Motivo de la cancelación:');
    if (reason !== null) {
      await handleCancelSale(saleId, reason);
    }
  };

  const handleRefund = async (saleId: number) => {
    const reason = prompt('Motivo del reembolso:');
    if (reason !== null) {
      await handleRefundSale(saleId, reason);
    }
  };

  const handleInvoice = async (saleId: number) => {
    const pdfUrl = await handleGenerateInvoice(saleId);
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('Error al generar la factura');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando ventas...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>
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
          <CardTitle>Ventas ({sales.length})</CardTitle>
          {onAddSale && (
            <Button onClick={onAddSale} size="sm">
              Nueva Venta
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-4 space-y-2">
          <Input
            placeholder="Buscar ventas..."
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
              onClick={() => handleStatusChange('completed')}
            >
              Completadas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('cancelled')}
            >
              Canceladas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaymentStatusChange('pending')}
            >
              Pago Pendiente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaymentStatusChange('completed')}
            >
              Pago Completo
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

        {/* Lista de ventas */}
        <div className="space-y-2">
          {sales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron ventas
            </div>
          ) : (
            sales.map((sale) => (
              <div
                key={sale.sale_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Venta #{sale.sale_id}
                    </h3>
                    <Badge className={getStatusColor(sale.status)}>
                      {getStatusText(sale.status)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(sale.payment_status)}>
                      {getPaymentStatusText(sale.payment_status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Paciente ID: {sale.patient_id}</div>
                    <div>Cotización ID: {sale.quotation_id}</div>
                    <div>Total: S/. {sale.total_amount.toFixed(2)}</div>
                    <div>Descuento: S/. {sale.discount_amount.toFixed(2)}</div>
                    <div>Final: S/. {sale.final_amount.toFixed(2)}</div>
                    <div>Fecha: {new Date(sale.sale_date).toLocaleDateString()}</div>
                    {sale.notes && <div>Notas: {sale.notes}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onSaleSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSaleSelect(sale as SaleWithDetails)}
                    >
                      Ver
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInvoice(sale.sale_id)}
                  >
                    Factura
                  </Button>
                  {sale.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComplete(sale.sale_id)}
                        className="text-green-600"
                      >
                        Completar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(sale.sale_id)}
                        className="text-red-600"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  {sale.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefund(sale.sale_id)}
                      className="text-orange-600"
                    >
                      Reembolsar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(sale.sale_id)}
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