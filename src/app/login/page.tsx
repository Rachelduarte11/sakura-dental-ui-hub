'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginScreen from '../../features/auth/components/LoginScreen';
import { API_ENDPOINTS } from '../../config/api';

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.USERNAME, {
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 200) {
          router.replace('/home');
        } else {
          setChecking(false);
        }
      });
  }, [router]);

  if (checking) {
    return <div style={{textAlign: 'center', marginTop: 40}}>Cargando...</div>;
  }

  return (
    <LoginScreen
      onBack={() => router.push('/welcome')}
      onLogin={() => router.replace('/home')}
      onRegister={() => router.push('/register')}
    />
  );
} 
