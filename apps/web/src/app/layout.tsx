import { Figtree, Sora } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { Navbar } from '@/components/navbar';

const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const sans = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'JobBoard Pro',
  description: 'Portal de empleos para candidatos y empresas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e7f3ef,_#f7f4ef_45%,_#f3ebe3)] text-slate-900">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
