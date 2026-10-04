import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B6D11',
          light: '#C0DD97',
          dark: '#27500A',
        },
        secondary: '#993C1D',
        accent: '#0F6E56',
        warning: '#BA7517',
        danger: '#A32D2D',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
