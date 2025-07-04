'use client'

import HomeScreen from '../../shared/components/HomeScreen';
import AppLayout from '../../shared/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="home" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Dashboard"
    >
      <HomeScreen 
        onNavigateToPatients={() => router.push('/patients')}
        onNavigateToServices={() => router.push('/services')}
      />
    </AppLayout>
  );
} 
