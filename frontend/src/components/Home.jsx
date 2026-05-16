import { Link } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Master the Markets with <span className="text-green-500">TradePro</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Experience real-time virtual trading. Get $10,000 in demo cash when you sign up and test your strategies risk-free.
      </p>
      
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Link to="/market" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition">
            Enter Market
          </Link>
        ) : (
          <>
            <Link to="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition">
              Start Trading Now
            </Link>
            <Link to="/login" className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition">
              Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}