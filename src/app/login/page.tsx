'use client'
import { useRouter } from 'next/navigation';
import LoginScreen from '../../features/auth/components/LoginScreen';

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginScreen
      onBack={() => router.push('/welcome')}
      redirectTo="/sales"
      onRegister={() => router.push('/register')}
    />
  );
} 

