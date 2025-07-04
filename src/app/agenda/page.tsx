'use client'

import AgendaManagement from '../../features/agenda/components/AgendaManagement';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function AgendaPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="agenda" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Agenda"
    >
      <AgendaManagement onBack={() => router.push('/home')} />
    </AppLayout>
  );
} 