'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import AppSwal from '@/lib/swal';

export default function AdminMerchPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState<any>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    variants: []
  });

  const fetchMerch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/merch');
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      variants: [...(product.variants || [])]
    });
  };

  const handleAddNew = () => {
    setEditingId('new');
    setEditForm({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      variants: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 10 }
      ]
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload-merch', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setEditForm((prev: any) => ({ ...prev, imageUrl: data.url }));
        AppSwal.fire('BERHASIL', 'Gambar berhasil diunggah!', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      AppSwal.fire('GAGAL', err.message || 'Gagal mengunggah gambar', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVariantStockChange = (index: number, newStock: string) => {
    const nextVariants = [...editForm.variants];
    nextVariants[index].stock = parseInt(newStock) || 0;
    setEditForm({ ...editForm, variants: nextVariants });
  };

  const saveProduct = async () => {
    try {
      const res = await fetch('/api/admin/merch', {
        method: 'POST',
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        AppSwal.fire('BERHASIL', 'Data produk diperbarui!', 'success');
        setEditingId(null);
        fetchMerch();
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      AppSwal.fire('GAGAL', 'Gagal menyimpan produk.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="border-b-4 border-foreground pb-6 bg-white p-8 shadow-brutal-sm flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black uppercase text-foreground">KATALOG MERCH.</h1>
          <p className="font-bold text-zinc-500 uppercase mt-2">Kelola stok, harga, dan gambar merchandise resmi</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-accent text-foreground border-4 border-foreground shadow-brutal-sm font-black uppercase rounded-none h-14 px-8 hover:-translate-y-1 transition-all"
        >
          <Plus className="mr-2" /> TAMBAH PRODUK BARU
        </Button>
      </header>

      {loading ? (
        <div className="p-20 text-center font-black text-2xl animate-pulse">MENGAMBIL DATA KATALOG...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="rounded-none border-4 border-foreground shadow-brutal overflow-hidden bg-white">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-64 bg-zinc-100 border-r-0 md:border-r-4 border-foreground relative overflow-hidden shrink-0">
                   {product.id === editingId ? (
                      <div className="w-full h-full p-4 flex flex-col justify-center items-center text-center bg-zinc-50 border-2 border-dashed border-foreground">
                         <ImageIcon className="w-8 h-8 mb-2" />
                         <label className="bg-foreground text-white px-2 py-1 text-[10px] cursor-pointer hover:bg-accent hover:text-foreground">
                           {isUploading ? 'UPLOADING...' : 'PILIH FILE'}
                           <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                         </label>
                         <p className="text-[10px] mt-2 font-bold opacity-50 truncate w-full">{editForm.imageUrl || 'No image selected'}</p>
                      </div>
                   ) : (
                      product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 font-black uppercase text-xs">
                           <ImageIcon className="w-12 h-12 mb-2" />
                           NO IMAGE
                        </div>
                      )
                   )}
                   <div className="absolute top-2 right-2 bg-foreground text-white px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0_0_#CCFF00]">
                      ID: {product.id.slice(0,5)}
                   </div>
                </div>
                
                <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {editingId === product.id ? (
                     <div className="space-y-4 col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-400">NAMA PRODUK</label>
                              <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border-2 border-foreground rounded-none font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-400">HARGA (Rp)</label>
                              <Input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="border-2 border-foreground rounded-none font-bold" />
                           </div>
                        </div>
                        
                        <div className="bg-zinc-100 p-4 border-2 border-foreground">
                           <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">UPDATE STOK VARIAN</label>
                           <div className="grid grid-cols-4 gap-4">
                              {editForm.variants.map((v: any, idx: number) => (
                                 <div key={idx} className="space-y-1 text-center">
                                    <label className="text-xs font-bold">{v.size}</label>
                                    <Input 
                                      type="number" 
                                      value={v.stock} 
                                      onChange={e => handleVariantStockChange(idx, e.target.value)} 
                                      className="border-2 border-foreground rounded-none text-center font-black h-10" 
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-zinc-400">URL GAMBAR (Opsional, gunakan upload di kiri lebih mudah)</label>
                           <Input value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} className="border-2 border-foreground rounded-none font-bold text-blue-600" placeholder="https://..." />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-zinc-400">DESKRIPSI</label>
                           <Input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border-2 border-foreground rounded-none font-bold" />
                        </div>
                        <div className="flex gap-4 pt-4">
                           <Button onClick={saveProduct} className="bg-green-500 text-white border-2 border-foreground rounded-none font-bold shadow-[4px_4px_0_0_#000]"><Save className="mr-2 h-4 w-4" /> SIMPAN PERUBAHAN</Button>
                           <Button onClick={() => setEditingId(null)} variant="outline" className="border-2 border-foreground rounded-none font-bold"><X className="mr-2 h-4 w-4" /> BATAL</Button>
                        </div>
                     </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black uppercase text-foreground">{product.name}</h3>
                         <p className="text-xl font-black text-accent tracking-tighter">Rp {product.price.toLocaleString()}</p>
                         <p className="text-sm font-bold text-zinc-500 leading-relaxed uppercase">{product.description}</p>
                         
                         <div className="pt-6 flex gap-3">
                            <Button onClick={() => handleEdit(product)} className="bg-[#CCFF00] text-foreground border-2 border-foreground shadow-[4px_4px_0_0_#000] rounded-none font-black text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                               <Edit2 className="w-4 h-4 mr-2" /> EDIT DATA & GAMBAR
                            </Button>
                         </div>
                      </div>
                      
                      <div className="bg-zinc-50 border-4 border-dashed border-zinc-200 p-6">
                         <h4 className="font-black text-xs uppercase text-zinc-400 mb-4 tracking-widest">STOCK VARIANTS</h4>
                         <div className="grid grid-cols-2 gap-4 text-center text-xs font-black">
                            {product.variants.map((v: any) => (
                               <div key={v.id} className="bg-white border-2 border-foreground p-2 shadow-brutal-sm">
                                  <span className="text-zinc-400 mr-2">{v.size}:</span>
                                  <span>{v.stock} PCS</span>
                               </div>
                            ))}
                         </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Product Template Overlay */}
      {editingId === 'new' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <Card className="w-full max-w-2xl bg-white border-8 border-foreground rounded-none shadow-[20px_20px_0_0_#CCFF00] overflow-hidden">
              <CardHeader className="bg-foreground text-white p-6 border-b-4 border-foreground">
                 <CardTitle className="font-black uppercase tracking-tight text-3xl">TAMBAH PRODUK KATALOG</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">NAMA BARANG</label>
                      <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border-4 border-foreground h-12 rounded-none font-black text-lg" placeholder="OFFICIAL T-SHIRT YMCC VII" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-400">HARGA (RP)</label>
                          <Input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="border-4 border-foreground h-12 rounded-none font-black text-lg" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-400">URL GAMBAR</label>
                          <Input value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} className="border-4 border-foreground h-12 rounded-none font-bold" placeholder="https://..." />
                       </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400">DESKRIPSI SINGKAT</label>
                      <Input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border-4 border-foreground h-12 rounded-none font-bold" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <Button onClick={saveProduct} className="flex-1 bg-accent text-foreground border-4 border-foreground shadow-[6px_6px_0_0_#000] rounded-none font-black text-xl h-14 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all italic">
                       LAUNCH PRODUCT 🚀
                    </Button>
                    <Button onClick={() => setEditingId(null)} className="bg-white text-zinc-400 border-4 border-zinc-200 rounded-none font-black text-xl h-14">
                       CANCEL
                    </Button>
                  </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
