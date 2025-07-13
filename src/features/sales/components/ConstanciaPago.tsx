import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  medicalHistory: string;
  dni: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ConstanciaPagoProps {
  selectedPatient: Patient | null;
  cart: CartItem[];
  paymentMethod: 'cash' | 'card' | 'transfer';
  documentType: 'boleta' | 'factura';
  ruc?: string;
  onBack: () => void;
  onEmitComprobante: () => void;
}

const ConstanciaPago: React.FC<ConstanciaPagoProps> = ({
  selectedPatient,
  cart,
  paymentMethod,
  documentType,
  ruc,
  onBack,
  onEmitComprobante
}) => {
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentTime = new Date().toLocaleTimeString('es-ES');
  const operationNumber = `CP-${Date.now().toString().slice(-6)}`;

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const downloadConstancia = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Constancia de Pago</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .title { font-size: 24px; font-weight: bold; color: #000; margin-bottom: 20px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; }
              .detail-item { margin-bottom: 10px; }
              .detail-label { font-weight: bold; }
              .payment-item { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px solid #eee; }
              .total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; padding-top: 10px; }
              .signature { margin-top: 30px; border-top: 1px solid #333; padding-top: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">CONSTANCIA DE PAGO</div>
              <div class="info-grid">
                <div>
                  <div class="detail-item"><span class="detail-label">Empresa:</span> Clínica Dental Sakura</div>
                  <div class="detail-item"><span class="detail-label">RUC:</span> 20123456789</div>
                  <div class="detail-item"><span class="detail-label">Dirección:</span> Av. Principal 123, Lima</div>
                </div>
                <div>
                  <div class="detail-item"><span class="detail-label">Teléfono:</span> (01) 123-4567</div>
                  <div class="detail-item"><span class="detail-label">Correo electrónico:</span> info@sakura-dental.com</div>
                  <div class="detail-item"><span class="detail-label">Fecha de emisión:</span> ${currentDate}</div>
                  <div class="detail-item"><span class="detail-label">N° de operación interna:</span> ${operationNumber}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Datos del cliente</div>
              <div class="detail-item"><span class="detail-label">Nombre completo / Razón social:</span> ${selectedPatient?.name}</div>
              <div class="detail-item"><span class="detail-label">Documento de identidad:</span> DNI - ${selectedPatient?.dni}</div>
              <div class="detail-item"><span class="detail-label">Dirección:</span> Dirección del cliente (por definir)</div>
            </div>

            <div class="section">
              <div class="section-title">Detalle del pago</div>
              ${cart.map(item => `
                <div class="payment-item">
                  <span>#${item.quantity} (${item.name})</span>
                  <span>S/ ${item.price * item.quantity}</span>
                </div>
              `).join('')}
              <div class="payment-item total">
                <span>Total</span>
                <span>S/ ${getTotalAmount()}</span>
              </div>
              <div class="detail-item"><span class="detail-label">Método de pago:</span> ${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}</div>
              <div class="detail-item"><span class="detail-label">Observaciones:</span> Sin observaciones</div>
            </div>

            <div class="signature">
              <div class="detail-item"><strong>Firma o sello de la empresa (opcional)</strong></div>
              <div style="border-bottom: 2px solid #333; width: 200px; margin: 20px 0;"></div>
              <div class="detail-item">Fecha y hora: ${currentDate} - ${currentTime}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const sendWhatsApp = () => {
    const message = `*CONSTANCIA DE PAGO*\n\n` +
      `*Clínica Dental Sakura*\n` +
      `RUC: 20123456789\n` +
      `Dirección: Av. Principal 123, Lima\n` +
      `Teléfono: (01) 123-4567\n` +
      `Email: info@sakura-dental.com\n` +
      `Fecha: ${currentDate}\n` +
      `N° Operación: ${operationNumber}\n\n` +
      `*DATOS DEL CLIENTE*\n` +
      `Nombre: ${selectedPatient?.name}\n` +
      `DNI: ${selectedPatient?.dni}\n\n` +
      `*DETALLE DEL PAGO*\n` +
      `${cart.map(item => `• #${item.quantity} (${item.name}): S/ ${item.price * item.quantity}`).join('\n')}\n\n` +
      `*TOTAL: S/ ${getTotalAmount()}*\n` +
      `Método de pago: ${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}\n\n` +
      `Fecha y hora: ${currentDate} - ${currentTime}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Constancia de Pago</h2>
        <p className="text-gray-600">Revise los datos antes de emitir el comprobante</p>
      </div>

      <Card className="border-2 border-gray-200">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-black mb-2">CONSTANCIA DE PAGO</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p><strong>Empresa:</strong> Clínica Dental Sakura</p>
                <p><strong>RUC:</strong> 20123456789</p>
                <p><strong>Dirección:</strong> Av. Principal 123, Lima</p>
              </div>
              <div className="text-left">
                <p><strong>Teléfono:</strong> (01) 123-4567</p>
                <p><strong>Correo electrónico:</strong> info@sakura-dental.com</p>
                <p><strong>Fecha de emisión:</strong> {currentDate}</p>
                <p><strong>N° de operación interna:</strong> {operationNumber}</p>
              </div>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Datos del cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Nombre completo / Razón social:</strong></p>
                <p className="text-gray-700">{selectedPatient?.name}</p>
              </div>
              <div>
                <p><strong>Documento de identidad:</strong></p>
                <p className="text-gray-700">DNI - {selectedPatient?.dni}</p>
              </div>
              <div className="md:col-span-2">
                <p><strong>Dirección:</strong></p>
                <p className="text-gray-700">Dirección del cliente (por definir)</p>
              </div>
            </div>
          </div>

          {/* Detalle del pago */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Detalle del pago
            </h3>
            
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium">#{item.quantity} ({item.name})</span>
                  <span className="text-gray-700">
                    S/ {item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold text-lg">
                <span>Total</span>
                <span>S/ {getTotalAmount()}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Método de pago:</strong></p>
                <p className="text-gray-700 capitalize">
                  {paymentMethod === 'cash' ? 'Efectivo' : 
                   paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                </p>
              </div>
              <div>
                <p><strong>Observaciones:</strong></p>
                <p className="text-gray-700">Sin observaciones</p>
              </div>
            </div>
          </div>

          {/* Firma */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Firma o sello de la empresa (opcional)</strong>
            </p>
            <div className="border-b-2 border-gray-400 w-48 mb-4"></div>
            <p className="text-sm text-gray-600">
              Fecha y hora: {currentDate} - {currentTime}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 justify-center flex-wrap">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8"
        >
          Volver
        </Button>
        <Button
          onClick={downloadConstancia}
          variant="outline"
          className="px-8"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </Button>
        <Button
          onClick={sendWhatsApp}
          variant="outline"
          className="px-8 bg-green-500 text-white hover:bg-green-600"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Enviar WhatsApp
        </Button>
        <Button
          onClick={onEmitComprobante}
          className="bg-sakura-red hover:bg-sakura-red-dark px-8"
        >
          Emitir Comprobante
        </Button>
      </div>
    </div>
  );
};

export default ConstanciaPago; 