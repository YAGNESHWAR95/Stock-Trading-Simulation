import { useRouteError, Link } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error("Caught by ErrorBoundary:", error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-800 mb-2">Sorry, an unexpected error has occurred.</p>
        
        {/* Display the actual error message */}
        <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded break-words">
          {error?.statusText || error?.message || "Page not found or unknown error."}
        </p>
        
        <Link 
          to="/" 
          className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}