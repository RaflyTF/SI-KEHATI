import type { Metadata } from 'next';
import './globals.css';
import { AuthSessionProvider } from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'SI-KEHATI — Sistem Informasi Keanekaragaman Hayati',
  description:
    'Sistem informasi monitoring dan publikasi keanekaragaman hayati PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AuthSessionProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
