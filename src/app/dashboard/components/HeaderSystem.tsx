'use client';


import { Maximize, Menu, Minimize, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Profile } from './Profile';

interface HeaderSystemProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function HeaderSystem({ menuOpen, onToggleMenu }: HeaderSystemProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isModalOpen,setIsModalOpen]=useState(false);

  useEffect(() => {
    // Obtiene el elemento por ID una vez que el componente se monta
    const target = document.getElementById('bodyScreen');
    setElement(target);
  }, []);

  return (
    <header
      role="banner"
      className="row-start-1 col-start-1 col-span-full bg-cyan-700 text-white flex items-center lg:justify-between px-4 z-40 lg:gap-x-12"
    >
      
      {/* Solo visible en dispositivos */}
      <div className="lg:hidden flex items-center gap-3">
        <button className="lg:hidden cursor-pointer" onClick={onToggleMenu} aria-label="Toggle menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="block lg:hidden font-bold text-lg">Sistema SISGOE</h1>      
      </div>

      {/* Busqueda para el sistema */}
      <input
        type="search"
        placeholder="Buscar en el Sistema"
        className="hidden lg:block px-3 py-1 text-cyan-800 w-150 rounded-full bg-white text-center outline-none focus:ring-1 focus:ring-cyan-700 "
      />

      {/* Perfil de usuario */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2">
        <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-cmHv9oL7EvcY4UgnJ3sT5DV2TNyJclc-2A&s" 
            alt="Foto de perfil de Alex Lancho" 
            className="w-9 h-9 rounded-full border border-gray-300 object-scale-down" 
        />
        <button onClick={()=>setIsModalOpen(true)} className="text-sm font-medium text-white cursor-pointer">Alex Lancho Ramos</button>
        {isModalOpen&&<Profile onClose={() => setIsModalOpen(false)} />}
        
      </div>
    </header>
  );
}
