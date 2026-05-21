import Logo from './Logo';

export default function LoadingScreen({ dark = false }) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-4 ${
        dark ? 'mesh-bg' : 'dashboard-bg'
      }`}
    >
      <Logo size="lg" showText={dark} variant={dark ? 'light' : 'dark'} />
      <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        Loading...
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft" />
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:150ms]" />
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:300ms]" />
      </div>
    </div>
  );
}
