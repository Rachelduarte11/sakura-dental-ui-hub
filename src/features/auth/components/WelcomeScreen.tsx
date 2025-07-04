
import React from 'react';
import { Button } from '@/shared/components/ui/button';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pb-12">
      <div className="w-full max-w-sm space-y-8 animate-fade-in bg-white rounded-xl p-8">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Sakura Dental Logo" className="w-64 h-auto animate-scale-in" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-sakura-red hover:bg-sakura-red-dark text-white font-medium text-lg rounded-xl shadow-simple-shadow transition-all duration-200 hover:scale-[1.02]"
          >
            Ingresar
          </Button>
          
          <Button
            onClick={onRegister}
            variant="default"
            className="w-full h-14 bg-white text-sakura-red hover:bg-sakura-red hover:text-white font-medium shadow-simple-shadow text-lg rounded-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Crear Cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
