import type { Metadata } from 'next';
import { Anton, Open_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton'
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans'
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
    <html lang="id" className={`${anton.variable} ${openSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
