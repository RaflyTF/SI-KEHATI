import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

// Komponen UI dasar (atoms) -- dipakai berulang di seluruh sistem,
// tanpa logika bisnis apa pun (sesuai Component Design pada SDD).
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
    danger: 'bg-danger text-white hover:opacity-90',
    ghost: 'bg-transparent text-primary hover:bg-primary-light/30',
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
