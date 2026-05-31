import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function RootLayout() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[hsl(var(--color-primary))] text-[hsl(var(--text-main))] transition-colors duration-300 overflow-x-hidden">
      
      {/* Dynamic Glowing Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--bg-orb-1)] blur-[120px] pointer-events-none animate-float-1 z-0 transition-colors duration-300" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--bg-orb-2)] blur-[150px] pointer-events-none animate-float-2 z-0 transition-colors duration-300" />

      {/* High-Tech Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300" 
        style={{
          backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.12) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          opacity: 'var(--grid-opacity)'
        }}
      />

      <Header />
      
      <main className="relative grow container mx-auto px-4 py-8 pb-28 md:pb-12 z-10">
        <Outlet />
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}