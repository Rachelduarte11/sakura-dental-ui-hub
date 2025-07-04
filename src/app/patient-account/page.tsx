'use client'

import PatientAccount from '../../features/patients/components/PatientAccount';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function PatientAccountPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="patient-account" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Cuentas de Pacientes"
    >
      <PatientAccount />
    </AppLayout>
  );
} 
