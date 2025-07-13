import PatientProfile from '@/features/patients/components/PatientProfile';
import AppLayout from '@/shared/components/AppLayout';

interface PatientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const resolvedParams = await params;
  const patientId = parseInt(resolvedParams.id);

  return (
    <AppLayout 
      currentScreen="patients" 
      onNavigate={(screen) => window.location.href = `/${screen}`}
      title="Perfil del Paciente"
    >
      <PatientProfile 
        patientId={patientId} 
        onBack={() => window.location.href = '/patients'} 
      />
    </AppLayout>
  );
} 