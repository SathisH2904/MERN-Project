export default function Alert({ message, type = 'error', theme = 'dark' }) {
  if (!message) return null;

  const styles = {
    dark: {
      error: 'bg-red-500/10 text-red-200 border-red-400/30',
      success: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30',
    },
    light: {
      error: 'bg-red-50 text-red-700 border-red-200',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  };
  const palette = styles[theme] || styles.dark;

  return (
    <div
      className={`flex items-start gap-2 text-sm border rounded-xl px-4 py-3 animate-fade-in ${palette[type]}`}
      role="alert"
    >
      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {type === 'error' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      <span>{message}</span>
    </div>
  );
}
