'use client'

import DoctorManagement from '../../features/doctors/components/DoctorManagement';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function DoctorsPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="doctors" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Doctores"
    >
      <DoctorManagement />
    </AppLayout>
  );
} 
