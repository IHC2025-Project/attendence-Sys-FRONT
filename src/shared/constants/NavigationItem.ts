import {
    Home,
    CalendarCheck2,
    CalendarMinus,
    User,
    Scroll,
  } from 'lucide-react';
  
export const NavigationItems = [
  { id: 'Inicio', label: 'Inicio', icon: Home, href: '/dashboard' },
  { id: 'Asistencias', label: 'Asistencias', icon: CalendarCheck2, href: '/dashboard/asistencias' },
  { id: 'Ausentes', label: 'Ausentes', icon: CalendarMinus, href: '/dashboard/ausentes' },
  { id: 'Usuarios', label: 'Usuarios', icon: User, href: '/dashboard/usuarios' },
  { id: 'Reporte', label: 'Reporte', icon: Scroll, href: '/dashboard/reporte' },
];