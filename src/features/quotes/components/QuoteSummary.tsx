import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { FileText } from 'lucide-react';
import { QuoteItem } from './types';

interface QuoteSummaryProps {
  items: QuoteItem[];
  discount: number;
  onDiscountChange: (discount: number) => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  items,
  discount,
  onDiscountChange
}) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="border-sakura-red/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resumen de Cotización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-medium">S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span>Descuento:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => onDiscountChange(Number(e.target.value))}
                  className="w-20 h-8 text-right"
                  min="0"
                  max={subtotal}
                />
                <span className="text-sm text-gray-600">S/</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span className="text-sakura-red">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteSummary; 