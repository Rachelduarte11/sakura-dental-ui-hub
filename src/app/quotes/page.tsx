'use client'

import QuoteManagement from '../../features/quotes/components/QuoteManagement'
import AppLayout from '../../shared/components/AppLayout'
import { useRouter } from 'next/navigation'

export default function QuotesPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="quotes" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Cotizaciones"
    >
      <QuoteManagement />
    </AppLayout>
  );
} 
