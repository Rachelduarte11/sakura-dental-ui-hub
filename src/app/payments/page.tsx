'use client'

import PaymentManagement from '../../features/payments/components/PaymentManagement'
import AppLayout from '../../shared/components/AppLayout'
import { useRouter } from 'next/navigation'

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="payments" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Pagos"
    >
      <PaymentManagement />
    </AppLayout>
  );
} 
