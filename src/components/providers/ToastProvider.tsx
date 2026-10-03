'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

let idCounter = 0;

// Provider notifikasi toast -- mengikuti pola Context+Provider yang sama
// seperti ThemeProvider.tsx. Dipasang sekali di root layout, lalu dipakai
// di komponen mana pun lewat hook useToast().
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Toast otomatis hilang sendiri setelah 4 detik.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-white shadow-lg animate-toast-in ${
              t.type === 'success' ? 'bg-primary' : 'bg-danger'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook pemakaian -- API-nya sengaja dibuat sederhana: toast.success(...) / toast.error(...)
export function useToast() {
  const { showToast } = useContext(ToastContext);
  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
  };
}