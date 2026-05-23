import { Outlet } from "react-router-dom";
import Header from "./Header"; // Assuming you have a standard navigation header
import Footer from "./Footer"; 

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}