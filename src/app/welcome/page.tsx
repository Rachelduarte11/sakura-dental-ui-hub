'use client'

import WelcomeScreen from '../../features/auth/components/WelcomeScreen';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onLogin={() => router.push('/login')}
      onRegister={() => router.push('/register')}
    />
  );
} 
