'use client';

import { useLanguage } from '@/lib/LanguageContext';

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-12 mt-20 text-sm">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">YMCC VII</h4>
          <p className="text-zinc-400 leading-relaxed">
            Young Mining Competition Championship VII. <br />
            {lang === 'ID' 
              ? 'Kompetisi tambang mahasiswa terbesar dengan sistem digital terintegrasi.' 
              : 'The largest student mining competition with an integrated digital system.'}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">{lang === 'ID' ? 'Portal Navigasi' : 'Navigation Portal'}</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="/" className="hover:text-orange-400">{lang === 'ID' ? 'Beranda Publik' : 'Public Homepage'}</a></li>
            <li><a href="/dashboard" className="hover:text-orange-400">{lang === 'ID' ? 'Portal Peserta' : 'Participant Portal'}</a></li>
            <li><a href="/login" className="hover:text-orange-400">{lang === 'ID' ? 'Login Administrator' : 'Administrator Login'}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">{lang === 'ID' ? 'Informasi' : 'Information'}</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="/about" className="hover:text-orange-400">{lang === 'ID' ? 'Tentang Kami' : 'About Us'}</a></li>
            <li><a href="/events" className="hover:text-orange-400">{lang === 'ID' ? 'Panduan Kompetisi' : 'Competition Guide'}</a></li>
            <li><a href="/contact" className="hover:text-orange-400">{lang === 'ID' ? 'FAQ & Kontak' : 'FAQ & Contact'}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <p className="text-zinc-500">
            {lang === 'ID' 
              ? '© 2026 YMCC VII. Hak cipta dilindungi undang-undang.' 
              : '© 2026 YMCC VII. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
