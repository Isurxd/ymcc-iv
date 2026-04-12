'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw, Eye } from 'lucide-react';
import AppSwal from '@/lib/swal';


interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  registration: {
    event: { name: string };
    user: { name: string; email: string };
  };
}

export default function AdminDocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectNotes, setRejectNotes] = useState<{ [key: string]: string }>({});

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleVerify = async (id: string, action: 'APPROVE' | 'REJECT') => {
    const notes = rejectNotes[id];

    if (action === 'REJECT' && !notes) {
      AppSwal.fire({ icon: 'warning', title: 'PERHATIAN', text: 'Note penolakan wajib diisi untuk memberi tahu peserta kesalahan pada berkas.' });
      return;
    }

    const result = await AppSwal.fire({
      title: 'KONFIRMASI',
      text: `Are you sure you want to ${action} this document?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      });
      if (res.ok) {
        fetchDocuments(); // Refresh list
      } else {
        AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'Verification failed. See console for details.' });
        console.error(await res.json());
      }
    } catch (error) {
      console.error('API Error', error);
      AppSwal.fire({ icon: 'error', title: 'ERROR', text: 'Terjadi kesalahan sistem.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-wide text-foreground uppercase">
            VERIFIKASI BERKAS.
          </h1>
          <p className="text-zinc-600 font-bold uppercase mt-2">Daftar Antrean Berkas Pendaftar Belum Diverifikasi</p>
        </div>
        <Button onClick={fetchDocuments} disabled={loading} variant="outline" className="h-12 border-4 border-foreground rounded-none shadow-brutal font-bold">
          <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} /> REFRESH
        </Button>
      </header>

      {loading && documents.length === 0 ? (
         <div className="p-8 text-center font-bold text-lg uppercase bg-white border-4 border-foreground shadow-brutal">Memuat Antrean...</div>
      ) : documents.length === 0 ? (
        <div className="p-8 text-center font-bold text-lg uppercase bg-accent border-4 border-foreground shadow-[6px_6px_0_0_#001F3F]">
          TIDAK ADA ANTREAN BERKAS SAAT INI 🔥
        </div>
      ) : (
        <div className="space-y-6">
          {documents.map((item) => (
            <Card key={item.id} className="bg-white border-4 border-foreground shadow-[6px_6px_0_0_#CCFF00] rounded-none hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between border-b-4 border-foreground bg-zinc-50">
                <div>
                  <CardTitle className="text-3xl font-black uppercase text-foreground">
                    {item.registration.user.name}
                  </CardTitle>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="px-2 py-1 bg-primary text-white text-xs font-bold border-2 border-foreground">{item.registration.event.name}</span>
                    <span className="px-2 py-1 bg-white text-foreground text-xs font-bold border-2 border-foreground relative top-0.5">Email: {item.registration.user.email}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                   <span className="px-4 py-2 bg-blue-100 border-2 border-foreground font-bold text-sm uppercase shadow-brutal-sm text-blue-900 overflow-hidden text-ellipsis max-w-xs whitespace-nowrap">
                     {item.fileName || 'document.pdf'}
                   </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col pt-6 space-y-4">
                <div className="w-full flex justify-between items-center bg-zinc-100 p-4 border-4 border-foreground">
                   <div className="font-bold uppercase tracking-widest text-sm">Pratinjau Berkas Dokumen ZIP/PDF:</div>
                   <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                     <Button className="rounded-none border-4 border-foreground shadow-brutal text-white bg-foreground hover:bg-zinc-800 font-bold uppercase tracking-widest">
                       <Eye className="w-5 h-5 mr-2" /> LIHAT BERKAS
                     </Button>
                   </a>
                </div>

                <div className="w-full bg-white border-4 border-foreground p-4">
                   <label className="font-bold text-sm uppercase mb-2 block">Catatan Penolakan (Opsional jika SAH, Wajib jika TOLAK):</label>
                   <textarea 
                      placeholder="Misal: Berkas KTP blur, silakan resubmit..." 
                      className="w-full min-h-[100px] p-3 rounded-none border-4 border-foreground focus-visible:ring-0 shadow-inner outline-none font-bold"
                      value={rejectNotes[item.id] || ''}
                      onChange={(e) => setRejectNotes({...rejectNotes, [item.id]: e.target.value})}
                   />
                </div>

                <div className="flex w-full space-x-4">
                  <Button onClick={() => handleVerify(item.id, 'REJECT')} className="flex-1 rounded-none bg-white text-red-600 border-4 border-foreground hover:bg-red-600 hover:text-white shadow-brutal h-14 font-bold text-lg">
                    <X className="w-6 h-6 mr-2" /> TOLAK BERKAS
                  </Button>
                  <Button onClick={() => handleVerify(item.id, 'APPROVE')} className="flex-1 rounded-none bg-primary text-white border-4 border-foreground hover:bg-foreground hover:text-white shadow-brutal h-14 font-bold text-lg">
                    <Check className="w-6 h-6 mr-2" /> VALIDASI SAH
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
