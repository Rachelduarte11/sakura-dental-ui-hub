"use client";

import React from 'react';
import PatientProfile from '@/features/patients/components/PatientProfile';
import AppLayout from '@/shared/components/AppLayout';
import { useRouter } from 'next/navigation';

interface PatientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PatientPage({ params }: PatientPageProps) {
  const router = useRouter();
  const [patientId, setPatientId] = React.useState<number | null>(null);

  React.useEffect(() => {
    params.then(resolvedParams => {
      setPatientId(parseInt(resolvedParams.id));
    });
  }, [params]);

  if (patientId === null) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout 
      currentScreen="patients" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Perfil del Paciente"
    >
      <PatientProfile 
        patientId={patientId} 
        onBack={() => router.push('/patients')} 
      />
    </AppLayout>
  );
} 