'use client';

import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function Profile({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative ml-auto h-full w-full max-w-md bg-cyan-600 shadow-2xl transform transition-transform">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col justify-center-safe h-full px-6 py-8">
          Perfil de UO
        </div>
      </div>
    </div>
  );
}
