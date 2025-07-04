'use client'

import LoginScreen from '../../features/auth/components/LoginScreen';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginScreen
      onBack={() => router.push('/welcome')}
      onLogin={() => router.push('/home')}
      onRegister={() => router.push('/register')}
    />
  );
} 
