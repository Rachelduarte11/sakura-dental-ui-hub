import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { QuoteItem } from './types';

interface QuoteFooterBarProps {
  quoteItems: QuoteItem[];
  discount: number;
  onSave: () => void;
  onExportPDF: () => void;
  onSendWhatsApp: () => void;
  onSendEmail: () => void;
  disabled?: boolean;
}

const QuoteFooterBar: React.FC<QuoteFooterBarProps> = ({
  quoteItems,
  onSave,
  onExportPDF,
  onSendWhatsApp,
  onSendEmail,
  disabled,
}) => {
  const subtotal = quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-lg px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1 flex flex-col gap-2 overflow-x-auto">
        <div className="font-medium text-base mb-1">Detalle de servicios:</div>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
          {quoteItems.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm border-b last:border-b-0 py-1">
              <span className="truncate max-w-[8rem] md:max-w-xs" title={item.name}>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>S/ {item.price.toFixed(2)}</span>
              <span className="font-semibold">S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="font-medium text-lg mt-2">
          Total: <span className="font-bold text-sakura-red">S/ {subtotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        <Button variant="outline" onClick={onExportPDF}>PDF</Button>
        <Button variant="outline" onClick={onSendWhatsApp}>WhatsApp</Button>
        <Button variant="outline" onClick={onSendEmail}>Email</Button>
        <Button className="bg-sakura-red text-white" onClick={onSave} disabled={disabled}>Guardar</Button>
      </div>
    </footer>
  );
};

export default QuoteFooterBar; 