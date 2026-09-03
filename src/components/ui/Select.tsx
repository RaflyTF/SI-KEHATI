import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, children, ...props },
  ref
) {
  return (
    <label className="block mb-4">
      {label && <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <select
        ref={ref}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100',
          'transition-colors duration-150',
          error ? 'border-danger' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-primary/40',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="block mt-1 text-xs text-danger">{error}</span>}
    </label>
  );
});
