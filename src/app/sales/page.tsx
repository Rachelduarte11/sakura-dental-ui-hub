'use client'

import SalesModule from '../../features/sales/view/SalesModule'
import AppLayout from '../../shared/components/AppLayout'
import { useRouter } from 'next/navigation'

export default function SalesPage() {
  const router = useRouter()

  return (
    <AppLayout 
      currentScreen="sales" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Punto de Venta (POS)"
    >
      <SalesModule />
    </AppLayout>
  );
} 
