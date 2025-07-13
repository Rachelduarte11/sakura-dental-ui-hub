'use client'

import PatientProfile from '@/features/patients/components/PatientProfile';
import AppLayout from '@/shared/components/AppLayout';
import { useRouter } from 'next/navigation';

interface PatientPageProps {
  params: {
    id: string;
  };
}

export default function PatientPage({ params }: PatientPageProps) {
  const router = useRouter();
  const patientId = parseInt(params.id);

  const handleBack = () => {
    router.push('/patients');
  };

  return (
    <AppLayout 
      currentScreen="patients" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Perfil del Paciente"
    >
      <PatientProfile 
        patientId={patientId} 
        onBack={handleBack} 
      />
    </AppLayout>
  );
} 