import { useState } from 'react';

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

export default function Input({
  id,
  label,
  type = 'text',
  icon,
  className = '',
  showPasswordToggle,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password' || showPasswordToggle;
  const inputType = isPassword ? (visible ? 'text' : 'password') : type;
  const hasToggle = isPassword;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className={`
            w-full py-3 rounded-xl text-slate-900 placeholder-slate-400
            bg-white border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400
            transition-all duration-200
            ${icon ? 'pl-11' : 'pl-4'}
            ${hasToggle ? 'pr-11' : 'pr-4'}
          `}
          {...props}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            <EyeIcon open={visible} />
          </button>
        )}
      </div>
    </div>
  );
}
