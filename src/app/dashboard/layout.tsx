import { NavbarSystem } from "@/shared/ui/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dasboard",
    description: "Registro de usuarios",
  };
  

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {  
    
    
    return (
      <div className="h-screen w-screen overflow-hidden grid grid-rows-16 grid-cols-32 bg-emerald-900">
        {/* Header fijo */}
        {/* <HeaderSystem menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} /> */}

        {/* Sidebar escritorio */}
        <aside
          role="complementary"
          aria-label="Menú de navegación"
          className="row-start-2 col-start-1 row-span-full col-span-4 hidden lg:block bg-emerald-900 text-white"
        >
          <NavbarSystem />
        </aside>     

        {/* Main content */}
        <main
          role="main"
          className="row-start-2 col-start-2 lg:row-start-2 lg:col-start-5 col-span-full row-span-full bg-white p-4 mr-3 lg:mr-4 my-4 overflow-y-auto max-h-full rounded-xl z-5"
        >
          {children}
        </main>
      </div>
    );
}