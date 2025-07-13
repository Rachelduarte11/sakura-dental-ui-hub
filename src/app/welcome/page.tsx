'use client'

import WelcomeScreen from '../../features/auth/components/WelcomeScreen';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/username', {
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
    <WelcomeScreen
      onLogin={() => router.push('/login')}
      onRegister={() => router.push('/register')}
    />
  );
} 
