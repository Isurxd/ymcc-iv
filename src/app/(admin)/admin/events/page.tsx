'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Trash2, Edit } from 'lucide-react';
import AppSwal from '@/lib/swal';

export default function AdminEventsCMS() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      AppSwal.fire({ icon: 'error', title: 'PERHATIAN', text: 'Nama dan rentang waktu wajib diisi!' });
      return;
    }

    const payload = { 
      name, 
      description, 
      startDate: new Date(startDate).toISOString(), 
      endDate: new Date(endDate).toISOString() 
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/events/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Gagal menyimpan database.');
      
      resetForm();
      fetchEvents();
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'ERROR', text: err.message });
    }
  };

  const deleteEvent = async (id: string, eventName: string) => {
    const result = await AppSwal.fire({
      title: 'HAPUS EVENT?',
      text: `Yakin ingin memusnahkan modul ${eventName}? Tindakan ini akan menghapus semua partisipan yang terdaftar padanya.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;
    
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'Gagal menghapus event.' });
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsEditing(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm">
        <h1 className="text-5xl font-black tracking-wide text-foreground uppercase">
          MODUL MANAJEMEN EVENT.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-2">Pusat kendali master pengadaan kompetisi dan lini masa operasi YMCC VII.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORM KIRI */}
        <div className="md:col-span-1">
          <Card className="rounded-none border-4 border-foreground shadow-[6px_6px_0_0_#E63E00] sticky top-8">
            <CardHeader className="bg-foreground border-b-4 border-foreground text-white p-6">
              <CardTitle className="text-2xl font-black uppercase tracking-wide">
                {isEditing ? 'UPDATE MODUL EVENT' : 'TAMBAH EVENT BARU'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Nama Operasional (Event)</label>
                  <Input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="Contoh: Mining Case" 
                    className="rounded-none border-2 border-foreground h-12 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Format Awal (Start Date)</label>
                  <Input 
                    type="datetime-local" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    required 
                    className="rounded-none border-2 border-foreground h-12 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Format Akhir (End Date)</label>
                  <Input 
                    type="datetime-local" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    required 
                    className="rounded-none border-2 border-foreground h-12 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Deskripsi (Opsional)</label>
                  <textarea 
                    className="w-full border-2 border-foreground rounded-none p-3 outline-none focus:border-[#E63E00] min-h-[120px] font-medium"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Parameter kompetisi..."
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="flex-1 bg-[#E63E00] hover:bg-[#CCFF00] hover:text-[#001F3F] text-white border-2 border-transparent hover:border-[#001F3F] transition-all rounded-none h-14 font-black text-xl uppercase tracking-wider">
                    {isEditing ? "UPDATE ENTRI" : "INJEKSI DATA"}
                  </Button>
                  {isEditing && (
                    <Button type="button" onClick={resetForm} className="bg-zinc-200 text-foreground hover:bg-zinc-300 border-2 border-transparent transition-all rounded-none h-14 font-black text-xl uppercase tracking-wider">
                      BATAL
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* LIST KANAN */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div className="bg-white border-4 border-foreground p-8 text-center animate-pulse">
              <p className="font-black text-2xl uppercase tracking-wide text-[#E63E00]">MENGAKSES DATABASE SENTRAL...</p>
            </div>
          ) : events.map(ev => {
              const start = new Date(ev.startDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
              const end = new Date(ev.endDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
              
              return (
                <Card key={ev.id} className="rounded-none border-4 border-foreground bg-white shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal-lg transition-all overflow-hidden flex flex-col sm:flex-row">
                  <div className="bg-[#CCFF00] p-6 border-b-4 sm:border-b-0 sm:border-r-4 border-foreground flex items-center justify-center min-w-[120px]">
                     <Calendar className="w-12 h-12 text-[#001F3F]" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black font-black text-2xl uppercase tracking-wide text-[#001F3F] mb-1">{ev.name}</h3>
                      <div className="inline-block bg-[#001F3F] text-white text-xs font-bold px-2 py-1 mb-4 uppercase tracking-widest">{start} - {end}</div>
                      <p className="text-zinc-600 text-sm font-semibold max-w-xl">{ev.description || 'Tidak ada deskripsi rinci.'}</p>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 sm:mt-0 pt-4 border-t-2 border-dashed border-zinc-200 sm:border-none sm:pt-0">
                      <Button onClick={() => {
                          setIsEditing(ev.id);
                          setName(ev.name);
                          setDescription(ev.description || '');
                          
                          // Format to local datetime-local format string
                          const formatForInput = (dateString: string) => {
                            const d = new Date(dateString);
                            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                            return d.toISOString().slice(0, 16);
                          };

                          setStartDate(formatForInput(ev.startDate));
                          setEndDate(formatForInput(ev.endDate));
                          window.scrollTo(0,0);
                      }} className="bg-transparent text-foreground hover:bg-[#E63E00] hover:text-white border-2 border-foreground transition-colors rounded-none px-4 py-2 font-bold uppercase tracking-widest text-xs h-10">
                        <Edit className="w-4 h-4 mr-2" /> REVISI
                      </Button>
                      <Button onClick={() => deleteEvent(ev.id, ev.name)} className="bg-zinc-100 text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 transition-colors rounded-none px-4 py-2 font-bold uppercase tracking-widest text-xs h-10">
                        <Trash2 className="w-4 h-4 mr-2" /> HAPUS
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          }
          {!loading && events.length === 0 && (
            <div className="bg-zinc-100 border-4 border-dashed border-zinc-400 p-12 text-center rounded-none">
              <p className="font-black text-3xl text-zinc-400 uppercase tracking-wide">TIDAK ADA EVENT AKTIF.</p>
              <p className="font-bold text-zinc-500 mt-2">Daftar operasi kosong di database.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
