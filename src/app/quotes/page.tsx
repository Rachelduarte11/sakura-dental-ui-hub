'use client'

import QuoteList from '@/features/quotes/view/QuoteList';
import AppLayout from '@/shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function QuotesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/home');
  };

  const handleCreateNew = () => {
    router.push('/quotes/create');
  };

  return (
    <AppLayout 
      currentScreen="quotes" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Cotizaciones"
    >
      <QuoteList
        onBack={handleBack}
        onCreateNew={handleCreateNew}
      />
    </AppLayout>
  );
} 
