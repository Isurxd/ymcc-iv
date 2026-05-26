import type { Metadata } from 'next';
import { Anton, Poppins } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

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
  title: 'YMCC VII | The Green Compass',
  description: 'Official YMCC VII Rebuild Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${anton.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
