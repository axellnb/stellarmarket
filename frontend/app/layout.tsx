import './globals.css';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { AppProvider } from '@/lib/AppContext';
import Navbar from '@/components/Navbar';
import Shell from '@/components/Shell';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = { title: 'StellarWork · Talento freelance, pagos en XLM', description: 'Marketplace de servicios profesionales con pagos sobre Stellar' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}><body className="font-sans">
      <AppProvider><Navbar /><Shell>{children}</Shell></AppProvider>
    </body></html>
  );
}
