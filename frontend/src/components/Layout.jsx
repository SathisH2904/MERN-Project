import Logo from './Logo';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-slate-300 mt-2 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>

        <div className="auth-card rounded-2xl shadow-2xl shadow-black/25 p-6 sm:p-8">
          {children}
        </div>

      </div>
    </div>
  );
}
