import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function RootLayout() {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Dynamic Glowing Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-float-1 z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none animate-float-2 z-0" />

      {/* High-Tech Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
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