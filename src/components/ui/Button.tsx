// import { ButtonHTMLAttributes } from 'react';
// import clsx from 'clsx';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
// }

// // Komponen UI dasar (atoms) -- dipakai berulang di seluruh sistem,
// // tanpa logika bisnis apa pun (sesuai Component Design pada SDD).
// export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
//   const base = clsx(
//     'px-4 py-2 rounded-lg text-sm font-medium',
//     'transition-all duration-150 ease-out',
//     'active:scale-[0.97]',
//     'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 dark:focus-visible:ring-offset-gray-900',
//     'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
//   );
//   const variants: Record<string, string> = {
//     primary: 'bg-primary text-white hover:bg-primary-dark',
//     secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
//     danger: 'bg-danger text-white hover:opacity-90',
//     ghost: 'bg-transparent text-primary hover:bg-primary-light/30',
//   };
//   return <button className={clsx(base, variants[variant], className)} {...props} />;
// }

// Kode Baru

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

// Komponen UI dasar (atoms) -- dipakai berulang di seluruh sistem,
// tanpa logika bisnis apa pun (sesuai Component Design pada SDD).
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = clsx(
    // py-2.5 di mobile (target sentuh lebih besar, ~40px), kembali ke py-2
    // di desktop (md ke atas) -- presisi mouse tidak butuh target sebesar jari.
    'px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium',
    'transition-all duration-150 ease-out',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 dark:focus-visible:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  );
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
    danger: 'bg-danger text-white hover:opacity-90',
    ghost: 'bg-transparent text-primary hover:bg-primary-light/30',
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}