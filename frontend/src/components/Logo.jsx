export default function Logo({ size = 'md', showText = true, variant = 'light' }) {
  const sizes = {
    sm: { icon: 'w-9 h-9', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;
  const textClass = variant === 'dark' ? 'text-slate-800' : 'text-white';
  const accentClass = variant === 'dark' ? 'text-violet-600' : 'text-violet-300';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.icon} rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25`}
      >
        <svg className="w-1/2 h-1/2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight ${textClass}`}>
          Task<span className={accentClass}>Flow</span>
        </span>
      )}
    </div>
  );
}
