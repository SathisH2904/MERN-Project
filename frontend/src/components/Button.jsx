export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:from-violet-500 hover:to-indigo-500',
    secondary:
      'bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-sm',
    ghost:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
    outline:
      'bg-transparent text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        w-full py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.98]
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
