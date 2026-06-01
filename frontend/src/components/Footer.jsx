export default function Footer() {
  return (
    <footer className="w-full bg-[hsl(var(--color-primary))] text-[hsl(var(--text-muted))] text-center py-6 mt-auto border-t border-[var(--border-glass)] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <p className="text-xs font-semibold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} TradePro Exchange. Simulated Paper Platform.
        </p>
      </div>
    </footer>
  );
}