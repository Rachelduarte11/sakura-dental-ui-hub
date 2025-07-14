'use client'

import ServiceManagement from '../../features/services/view/ServiceManagement';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="services" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Servicios"
    >
      <ServiceManagement onBack={() => router.push('/home')} />
    </AppLayout>
  );
} 
