"use client";

import React, { useEffect, useState } from 'react';
import { paymentsApi } from '../api/paymentsApi';
import { Payment, PaymentWithDetails } from '../api/types';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

const getToday = () => new Date().toISOString().split('T')[0];
const getWeekAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
};

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'day' | 'week' | 'range'>('day');
  const [dateFrom, setDateFrom] = useState(getToday());
  const [dateTo, setDateTo] = useState(getToday());

  useEffect(() => {
    let from = dateFrom;
    let to = dateTo;
    if (filterType === 'day') {
      from = to = getToday();
    } else if (filterType === 'week') {
      from = getWeekAgo();
      to = getToday();
    }
    setLoading(true);
    setError(null);
    paymentsApi.getAll({ search: '', status: null, paymentMethodId: null, dateFrom: from, dateTo: to })
      .then(res => setPayments(res.data || []))
      .catch(() => setError('Error al cargar pagos'))
      .finally(() => setLoading(false));
  }, [filterType, dateFrom, dateTo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Pagos</h1>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Filtro</label>
          <select
            className="border rounded px-2 py-1"
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
          >
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="range">Por rango</option>
          </select>
        </div>
        {(filterType === 'range') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Desde</label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hasta</label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </>
        )}
        <Button onClick={() => {
          // Forzar recarga
          setDateFrom(dateFrom);
        }}>Filtrar</Button>
      </div>
      {loading ? (
        <div className="py-8 text-center text-gray-500">Cargando pagos...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Paciente</th>
                <th className="p-2 text-left">Cotización</th>
                <th className="p-2 text-left">Monto</th>
                <th className="p-2 text-left">Método</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.payment_id || idx} className="border-b">
                  <td className="p-2">{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td className="p-2">{p.patient ? `${p.patient.first_name} ${p.patient.last_name}` : 'N/A'}</td>
                  <td className="p-2">{p.quotation ? `#${p.quotation.quotation_id}` : p.quotation_id}</td>
                  <td className="p-2">S/ {p.amount?.toFixed(2) ?? '0.00'}</td>
                  <td className="p-2">{p.payment_method?.name || p.payment_method_id}</td>
                  <td className="p-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 