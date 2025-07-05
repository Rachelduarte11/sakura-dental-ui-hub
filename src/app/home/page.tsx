'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeScreen from '../../shared/components/HomeScreen';
import AppLayout from '../../shared/components/AppLayout';
import { API_ENDPOINTS } from '../../config/api';

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.USERNAME, {
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          router.replace('/login');
          setChecking(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.username) setUsername(data.username);
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return <div style={{textAlign: 'center', marginTop: 40}}>Cargando...</div>;
  }

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
