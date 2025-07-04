'use client'

import RegisterScreen from '../../features/auth/components/RegisterScreen';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterScreen
      onBack={() => router.push('/welcome')}
      onLogin={() => router.push('/login')}
    />
  );
} 
