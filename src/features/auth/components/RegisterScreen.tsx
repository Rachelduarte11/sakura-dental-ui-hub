
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import SakuraIcon from '@/shared/components/SakuraIcon';

interface RegisterScreenProps {
  onBack: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onRegister, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onRegister();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-gray-light via-white to-sakura-coral/10 flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-sakura-red hover:bg-sakura-red/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <SakuraIcon size={64} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Regístrate para empezar</h1>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Usuario"
                  className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Correo electrónico"
                  className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Contraseña"
                    className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-sakura-gray hover:text-sakura-red"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirma tu contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-sakura-gray hover:text-sakura-red"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sakura-red hover:text-sakura-red-dark text-sm"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-sakura-red hover:bg-sakura-red-dark text-white font-medium text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Ingresar
            </Button>
          </form>

          {/* Social Register */}
          <div className="space-y-4">
            <div className="text-center text-sakura-gray text-sm">
              O ingresa con
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border-sakura-gray-medium hover:bg-blue-50 hover:border-blue-300 hover:text-gray-800 rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              
              <Button
                variant="outline"
                className="h-12 border-sakura-gray-medium hover:bg-red-50 hover:border-red-300 hover:text-gray-800 rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-sakura-gray">¿Ya tienes una cuenta? </span>
            <Button
              variant="link"
              onClick={onLogin}
              className="text-sakura-red hover:text-sakura-red-dark font-semibold p-0 h-auto"
            >
              Ingresa ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
