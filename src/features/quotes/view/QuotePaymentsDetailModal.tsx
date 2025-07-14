import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface QuotePaymentsDetailModalProps {
  open: boolean;
  onClose: () => void;
  quotation: { quotation_id: number };
}

const QuotePaymentsDetailModal: React.FC<QuotePaymentsDetailModalProps> = ({ open, onClose, quotation }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && quotation?.quotation_id) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:8080/api/quotations/${quotation.quotation_id}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo obtener el detalle');
          return res.json();
        })
        .then(data => setDetails(data))
        .catch(() => setError('Error al cargar detalle de pagos'))
        .finally(() => setLoading(false));
    }
  }, [open, quotation?.quotation_id]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Pagos - Cotización #{quotation.quotation_id}</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">Cargando...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Pagos - Cotización #{quotation.quotation_id}</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-red-500">{error}</div>
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline">Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const payments = details?.payments || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle de Pagos - Cotización #{quotation.quotation_id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            <p><strong>Total:</strong> S/ {details?.total_amount?.toFixed(2) ?? '0.00'}</p>
            <p><strong>Pagado:</strong> S/ {details?.total_paid?.toFixed(2) ?? '0.00'}</p>
            <p><strong>Pendiente:</strong> S/ {details?.balance_remaining?.toFixed(2) ?? '0.00'}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Pagos realizados</h4>
            {payments.length === 0 ? (
              <p className="text-gray-500">No hay pagos registrados.</p>
            ) : (
              <ul className="space-y-2">
                {payments.map((p: any, idx: number) => (
                  <li key={idx} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-100 text-green-700">S/ {p.amount?.toFixed(2) ?? '0.00'}</Badge>
                      <span className="text-gray-700">{p.method}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(p.date).toLocaleDateString('es-PE')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline">Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotePaymentsDetailModal; 