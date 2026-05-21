import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]);

  const toast = useCallback(
    (message, options = {}) => {
      const { type = 'info', duration = 4000 } = options;
      return addToast(message, type, duration);
    },
    [addToast]
  );

  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration ?? 4000),
    [addToast]
  );

  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration ?? 5000),
    [addToast]
  );

  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration ?? 4000),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, info, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
