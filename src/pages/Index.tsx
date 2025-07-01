
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import LoginScreen from '@/components/LoginScreen';
import RegisterScreen from '@/components/RegisterScreen';
import HomeScreen from '@/components/HomeScreen';
import PatientManagement from '@/components/PatientManagement';
import ServiceManagement from '@/components/ServiceManagement';
import SalesModule from '@/components/SalesModule';
import InventoryManagement from '@/components/InventoryManagement';
import FinanceManagement from '@/components/FinanceManagement';
import DoctorManagement from '@/components/DoctorManagement';
import AppLayout from '@/components/AppLayout';

type Screen = 'welcome' | 'login' | 'register' | 'home' | 'patients' | 'services' | 'sales' | 'inventory' | 'finances' | 'doctors';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const handleNavigation = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => handleNavigation('login')}
            onRegister={() => handleNavigation('register')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onBack={() => handleNavigation('welcome')}
            onLogin={() => handleNavigation('home')}
            onRegister={() => handleNavigation('register')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onBack={() => handleNavigation('welcome')}
            onRegister={() => handleNavigation('home')}
            onLogin={() => handleNavigation('login')}
          />
        );
      case 'home':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <HomeScreen 
              onNavigateToPatients={() => handleNavigation('patients')}
              onNavigateToServices={() => handleNavigation('services')}
            />
          </AppLayout>
        );
      case 'patients':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <PatientManagement 
              onBack={() => handleNavigation('home')}
            />
          </AppLayout>
        );
      case 'services':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <ServiceManagement 
              onBack={() => handleNavigation('home')}
            />
          </AppLayout>
        );
      case 'sales':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <SalesModule />
          </AppLayout>
        );
      case 'inventory':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <InventoryManagement />
          </AppLayout>
        );
      case 'finances':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <FinanceManagement />
          </AppLayout>
        );
      case 'doctors':
        return (
          <AppLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <DoctorManagement />
          </AppLayout>
        );
      default:
        return (
          <WelcomeScreen
            onLogin={() => handleNavigation('login')}
            onRegister={() => handleNavigation('register')}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default Index;
