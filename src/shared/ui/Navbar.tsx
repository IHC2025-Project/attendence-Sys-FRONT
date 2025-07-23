'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { NavigationItems } from '../constants/NavigationItem';

export function NavbarSystem() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/temp/logout', { method: 'GET', credentials: 'include' });
    router.push('/');
    window.location.reload(); 
  };

  return (
    <nav className="bg-emerald-900 h-full w-auto flex flex-col items-center justify-between px-4">
      
      {/* Menus de deplegue */}
      <div className='flex flex-col justify-baseline gap-y-2'>
        {/* Logo de la Oficina */}
        <div className='py-9 border-b-1 mb-3'>
          <Image src="/Iconos/logoRfid.png" width={150} height={150} alt="Logo del sistema" />
        </div>        

        {
          NavigationItems.map((item)=>{
            const Icon=item.icon;
            const isActive=pathname===item.href;
            return (
              <Link key={item.id} href={item.href} className={`w-full flex items-start justify-start gap-x-2 px-3 py-2 group transform transition-all ${isActive?'bg-white/80 text-emerald-900 rounded-r-md scale-100 duration-150':'text-white hover:scale-110 cursor-pointer duration-150'} relative`}>
                <Icon className={`${isActive ? 'text-emerald-900' : 'text-white group-hover:text-white'}`}/>
                <span className='font-medium z-20'>{item.label}</span>
                {isActive&&
                  (
                    <span className={`absolute inset-y-0 -left-1 border-l-4 border-l-green-500  transition-all duration-300 ease-in-out ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}/>
                  )
                }
                
              </Link>
            );

          })
        }   
      </div>

      {/* Cerrar Sessión */}
      <button onClick={handleLogout} className='flex items-center justify-start gap-x-2 cursor-pointer hover:scale-110 duration-150 text-white font-medium pb-8'>
        <span><LogOut/></span> 
        Cerrar Sesión       
      </button>              
    </nav>
  );
}
