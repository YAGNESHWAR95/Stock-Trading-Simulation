export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} TradePro Platform. Simulation purposes only.
        </p>
      </div>
    </footer>
  );
}