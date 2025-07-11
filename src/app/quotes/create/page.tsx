'use client'

import QuoteCreate from '@/features/quotes/view/QuoteCreate';
import AppLayout from '@/shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function QuoteCreatePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/quotes');
  };

  return (
    <AppLayout 
      currentScreen="quotes-create" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Nueva Cotización"
    >
      <QuoteCreate onBack={handleBack} />
    </AppLayout>
  );
} 