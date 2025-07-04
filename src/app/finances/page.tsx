'use client'

import FinanceManagement from '../../features/finances/components/FinanceManagement'
import AppLayout from '../../shared/components/AppLayout'
import { useRouter } from 'next/navigation'

export default function FinancesPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="finances" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión Financiera"
    >
      <FinanceManagement />
    </AppLayout>
  );
} 
