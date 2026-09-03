import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <label className="block mb-4">
      {label && <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100',
          'transition-colors duration-150',
          error ? 'border-danger' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-primary/40',
          className
        )}
        {...props}
      />
      {error && <span className="block mt-1 text-xs text-danger">{error}</span>}
    </label>
  );
});
