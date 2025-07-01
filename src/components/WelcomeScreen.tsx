
import React from 'react';
import { Button } from '@/components/ui/button';
import SakuraIcon from './SakuraIcon';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-gray-light via-white to-sakura-coral/10 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SakuraIcon size={80} className="animate-scale-in" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">SAKURA</h1>
            <h2 className="text-2xl font-semibold text-gray-700">DENTAL</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-sakura-red hover:bg-sakura-red-dark text-white font-medium text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
          >
            Ingresar
          </Button>
          
          <Button
            onClick={onRegister}
            variant="outline"
            className="w-full h-14 border-2 border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white font-medium text-lg rounded-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Crear Cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
