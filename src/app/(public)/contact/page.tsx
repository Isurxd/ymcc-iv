'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function ContactPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50 pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-4xl pt-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-accent border-4 border-foreground shadow-[8px_8px_0_0_var(--color-foreground)] p-8 md:p-12 mb-12"
        >
          <div className="border-b-4 border-foreground pb-6 mb-8 text-foreground">
            <h1 className="text-5xl md:text-7xl font-heading italic uppercase tracking-wider drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
              {lang === 'ID' ? 'KONTAK & FAQ' : 'CONTACT & FAQ'}
            </h1>
            <p className="text-2xl font-bold uppercase mt-4">
              {lang === 'ID' ? 'KAMI SIAP MENJAWAB PERTANYAAN ANDA' : 'WE ARE HERE TO ANSWER YOUR QUESTIONS'}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="space-y-6 text-lg md:text-xl font-bold leading-relaxed text-foreground"
          >
            <p>
              {lang === 'ID' 
                ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.'
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.'}
            </p>
            <div className="bg-white border-2 border-foreground p-6 shadow-brutal-sm">
              <h3 className="text-2xl font-heading mb-2 uppercase">
                {lang === 'ID' ? 'T: Quid est lorem ipsum?' : 'Q: Quid est lorem ipsum?'}
              </h3>
              <p className="font-medium text-zinc-700">
                {lang === 'ID' ? 'J' : 'A'}: Aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
              </p>
            </div>
            <div className="bg-white border-2 border-foreground p-6 shadow-brutal-sm">
              <h3 className="text-2xl font-heading mb-2 uppercase">
                {lang === 'ID' ? 'T: Sed ut perspiciatis unde?' : 'Q: Sed ut perspiciatis unde?'}
              </h3>
              <p className="font-medium text-zinc-700">
                {lang === 'ID' ? 'J' : 'A'}: Omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
