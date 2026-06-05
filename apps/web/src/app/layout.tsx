import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vehicle Sharing',
  description: 'Find and ride vehicles near you',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <div className="flex min-h-screen justify-center bg-muted/30">
            <div className="relative flex w-full max-w-mobile flex-col bg-background shadow-xl">
              {children}
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
