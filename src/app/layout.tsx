import type { Metadata } from 'next';
import { Anton, Poppins } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton'
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'YMCC VII | THE GREEN COMPASS',
  description: 'Official YMCC VII Rebuild Project - Navigating the Future of Mining.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${anton.variable} ${poppins.variable} overflow-x-hidden`}>
      <body className="antialiased min-h-screen flex flex-col font-poppins relative selection:bg-[#CCFF00] selection:text-[#001F3F] overflow-x-hidden">
        <LanguageProvider>
          {/* Public Navigation - Global Centralized Logic */}
          <Navbar />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
