'use client';
import React, { useState } from 'react';
import { User, Lock, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useRouter } from 'next/navigation';
import UserRegistration from '@/shared/ui/UserRegistration';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loginUser, loading, error } = useLogin();

  const handleSubmit = async () => {
    const result = await loginUser(email, password);
    if (result) {
      localStorage.setItem('user_id', result.user_id);
      router.push('/dashboard'); // 👈 forma recomendada
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-center gap-12">
        
        {/* Logo y título */}
        <div className="flex flex-col items-center space-y-6">
          <Image src="/Iconos/logoRfid.png" width={200} height={200} alt="Logo del sistema" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema</h1>
            <h2 className="text-4xl font-bold text-gray-800">de asistencia</h2>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="space-y-6">
            
            {/* Campo de correo */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Correo
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Correo electrónico"
                />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Botón de ingresar */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-colors font-medium text-lg"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* Error */}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {/* Checkbox recordarme */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <div className="ml-2 block text-sm text-gray-700">
                Recuérdame
              </div>
            </div>

            {/* Enlaces */}
            <div className="space-y-2 text-sm">
              <div>
                <button className="text-gray-600 hover:text-teal-600 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div>
                <span className="text-gray-600">¿Aún no tienes cuenta? </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-teal-600 hover:text-teal-700 transition-colors font-medium cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl w-[95vw] max-w-5xl max-h-[95vh] overflow-y-auto relative">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                    >
                      <X/>
                    </button>
                    <UserRegistration onClose={() => setIsModalOpen(false)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
