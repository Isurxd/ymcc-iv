'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50 pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-4xl pt-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white border-4 border-foreground shadow-[8px_8px_0_0_var(--color-primary)] p-8 md:p-12"
        >
          <div className="border-b-4 border-accent pb-6 mb-8">
            <h1 className="text-5xl md:text-7xl font-heading text-foreground italic uppercase tracking-wider drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
              {lang === 'ID' ? 'TENTANG KAMI' : 'ABOUT US'}
            </h1>
            <p className="text-2xl font-bold uppercase mt-4 text-zinc-600">
              {lang === 'ID' ? 'Temukan Kisah dan Misi Kami' : 'DISCOVER OUR STORY AND MISSION'}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-zinc-800"
          >
            <p>
              {lang === 'ID' 
                ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' 
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
            <p className="border-l-4 border-primary pl-6 py-2 bg-zinc-100 italic font-bold">
              "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
            </p>
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
