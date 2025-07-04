'use client'

import PatientManagement from '../../features/patients/components/PatientManagement';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function PatientsPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="patients" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Pacientes"
    >
      <PatientManagement onBack={() => router.push('/home')} />
    </AppLayout>
  );
} 
