import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Ensures it's always up-to-date with DB

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="mb-16 border-b-8 border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-[#E63E00] text-white px-4 py-1 text-sm font-bold uppercase tracking-widest mb-4 shadow-[4px_4px_0_0_#001F3F] border-2 border-foreground">
              YMCC VII COMPETITIONS
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#001F3F] uppercase tracking-wide leading-none">
              EVENTS &<br />COMPETITIONS
            </h1>
          </div>
          <p className="max-w-md text-zinc-600 font-bold uppercase tracking-wide text-lg border-l-4 border-[#CCFF00] pl-4">
            Ikuti berbagai kompetisi bergengsi dan tingkatkan kapasitas dirimu di kancah nasional!
          </p>
        </header>

        {events.length === 0 ? (
          <div className="bg-white border-8 border-foreground shadow-[16px_16px_0_0_#CCFF00] p-16 text-center hover:-translate-y-2 transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-black text-[#001F3F] uppercase mb-4">KAMING SUN!</h2>
            <p className="text-xl font-bold text-zinc-500 uppercase">Belum ada daftar event yang dirilis. Pantau terus halaman ini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {events.map((event) => {
              const startDate = new Date(event.startDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              });
              const endDate = new Date(event.endDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              });
              const startTime = new Date(event.startDate).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={event.id} className="group bg-white border-8 border-foreground shadow-[12px_12px_0_0_#001F3F] hover:shadow-[16px_16px_0_0_#E63E00] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                  
                  {/* Event Visual Header */}
                  <div className="h-40 bg-[#CCFF00] border-b-8 border-foreground flex items-center justify-center overflow-hidden relative p-6">
                     <span className="text-6xl md:text-7xl font-black text-transparent [-webkit-text-stroke:2px_#001F3F] opacity-30 absolute -right-4 -bottom-4 rotate-12 group-hover:scale-110 transition-transform">
                       YMCC
                     </span>
                     <h3 className="text-3xl md:text-4xl font-black text-[#001F3F] uppercase text-center relative z-10 w-full px-4">
                       {event.name}
                     </h3>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-zinc-600 font-bold mb-8 line-clamp-3 leading-relaxed">
                      {event.description || 'Detail kompetisi akan diumumkan lebih lanjut. Persiapkan tim terbaikmu!'}
                    </p>

                    <div className="space-y-4 mb-10 mt-auto">
                      <div className="flex items-center gap-4 bg-zinc-50 p-3 border-2 border-zinc-200">
                        <div className="bg-[#001F3F] text-white p-2 border-2 border-foreground">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TANGGAL PELAKSANAAN</span>
                          <span className="font-black text-foreground uppercase">{startDate} - {endDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-zinc-50 p-3 border-2 border-zinc-200">
                        <div className="bg-[#CCFF00] text-[#001F3F] p-2 border-2 border-foreground">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">WAKTU (WIB)</span>
                          <span className="font-black text-foreground uppercase">{startTime} - Selesai</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/register`} 
                      className="w-full block text-center bg-[#E63E00] text-white border-4 border-foreground py-4 font-black uppercase text-xl hover:bg-[#001F3F] hover:text-[#CCFF00] transition-colors"
                    >
                      <div className="flex items-center justify-center gap-3">
                        DAFTAR SEKARANG
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </div>
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
