
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import LoginScreen from '@/components/LoginScreen';
import RegisterScreen from '@/components/RegisterScreen';
import HomeScreen from '@/components/HomeScreen';

type Screen = 'welcome' | 'login' | 'register' | 'home';

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
        return <HomeScreen />;
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
