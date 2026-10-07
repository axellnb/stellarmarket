import './globals.css';
import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { AppProvider } from '@/lib/AppContext';
import Navbar from '@/components/Navbar';
import Shell from '@/components/Shell';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'StellarWork · Marketplace Freelance sobre Stellar',
  description: 'Conecta talento profesional y proyectos pagados directamente en XLM sobre la red Stellar'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${mono.variable}`}>
      <body className="font-sans bg-[#1B1B39] text-[#E9EBFF] antialiased selection:bg-[#3965FA] selection:text-white">
        <AppProvider>
          <Navbar />
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
