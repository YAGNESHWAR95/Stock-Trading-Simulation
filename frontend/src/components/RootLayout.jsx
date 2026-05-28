import { Outlet } from "react-router-dom";
import Header from "./Header"; // Assuming you have a standard navigation header
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow container mx-auto px-4 py-8 pb-28 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}