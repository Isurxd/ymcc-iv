import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

export const revalidate = 0; // Ensures it's always up-to-date with DB

export default async function EventsPage() {
  let events: any[] = [];
  try {
     events = await prisma.event.findMany({
      orderBy: {
        startDate: 'asc'
      }
    });
  } catch(e) {
    console.error("DB Error", e);
  }

  return (
    <div className="min-h-screen bg-white bg-grid-dots pt-40 pb-32 relative overflow-hidden text-[#001F3F]">
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-[-10rem] w-[50rem] h-[50rem] bg-[#CCFF00]/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 left-[-10rem] w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-[#001F3F]/5 border border-[#001F3F]/10 px-5 py-2 rounded-full mb-10">
               <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse shadow-[0_0_12px_#CCFF00]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001F3F]/60">
                 National Competition Tier
               </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-[#001F3F]">
              Main <br/> <span className="text-[#CCFF00] drop-shadow-2xl">Events.</span>
            </h1>
            
            <p className="mt-10 text-xl font-medium text-zinc-400 max-w-lg leading-relaxed uppercase italic">
              DISCOVER THE PRESTIGIOUS COMPETITIONS CHALLENGING THE BEST MINING ENGINEERS ACROSS THE NATION.
            </p>
          </div>
        </header>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/50 backdrop-blur-xl rounded-[5rem] border border-[#001F3F]/5 shadow-premium">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-10">
              <Zap className="w-10 h-10 text-[#CCFF00]" />
            </div>
            <h2 className="text-4xl font-black text-[#001F3F] uppercase tracking-tighter">System Locked</h2>
            <p className="font-bold text-zinc-400 uppercase mt-4 tracking-widest italic opacity-60">Competition schedules are being synchronized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {events.map((event) => {
              const startDate = new Date(event.startDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              });
              
              return (
                <div key={event.id} className="group flex flex-col bg-white p-6 rounded-[5rem] shadow-soft hover:shadow-premium transition-all duration-1000 border border-[#001F3F]/5 h-full relative overflow-hidden">
                  {/* Decorative Background for Card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 rounded-full blur-3xl -z-10 group-hover:bg-[#CCFF00]/30 transition-colors" />
                  
                  <div className="h-48 md:h-56 bg-zinc-50 rounded-[4rem] flex flex-col items-center justify-center mb-10 relative overflow-hidden px-8 border border-zinc-100">
                     <span className="text-7xl font-black text-[#001F3F] opacity-5 absolute -right-4 -bottom-6 tracking-tighter uppercase italic select-none">YMCC7</span>
                     <h3 className="text-4xl md:text-5xl font-black text-[#001F3F] uppercase tracking-[-0.05em] leading-none text-center group-hover:text-[#E63E00] transition-colors duration-500">
                      {event.name}
                     </h3>
                  </div>

                  <div className="px-6 flex-grow">
                    <p className="text-zinc-600 font-bold text-lg mb-10 line-clamp-3 leading-relaxed uppercase italic opacity-70">
                      {event.description || 'Competition parameters are being finalized. Prepare your best strategic mining team.'}
                    </p>

                    <div className="space-y-6 mb-12">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-[#001F3F]/5 rounded-2xl flex items-center justify-center text-[#001F3F]">
                             <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                             <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">Execution Date</span>
                             <span className="block font-black text-lg text-[#001F3F] uppercase tracking-tighter">{startDate}</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-[#CCFF00]/20 rounded-2xl flex items-center justify-center text-[#001F3F]">
                             <Clock className="w-5 h-5" />
                          </div>
                          <div>
                             <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">Status Center</span>
                             <span className="block font-black text-lg text-[#001F3F] uppercase tracking-tighter">Registration Open</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="px-2 pb-2">
                    <Link 
                      href="/register" 
                      className="w-full h-20 bg-[#001F3F] text-white rounded-[3rem] font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#CCFF00] hover:text-[#001F3F] transition-all duration-500 group/btn shadow-xl shadow-[#001F3F]/10 hover:shadow-[#CCFF00]/30"
                    >
                      Initialize Enrollment <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
