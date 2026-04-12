"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppSwal from "@/lib/swal";
import { Trash2, Plus } from "lucide-react";

interface ProductVariant {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  variants: ProductVariant[];
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New product form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hasSizes, setHasSizes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    try {
      setUpdatingId(variantId);
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock: newStock }),
      });
      
      if (!res.ok) throw new Error("Gagal update stok");
      
      setProducts(prev => 
        prev.map(p => ({
          ...p,
          variants: p.variants.map(v => 
            v.id === variantId ? { ...v, stock: newStock } : v
          )
        }))
      );
      AppSwal.fire({ icon: 'success', title: 'BERHASIL', text: 'Stok berhasil diperbarui!' });
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'ERROR', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) return;
    
    // Default sizes based on convention if applicable
    const sizes = hasSizes ? ["S", "M", "L", "XL", "XXL"] : [];

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, imageUrl, sizes }),
      });
      if (!res.ok) throw new Error("Gagal menambah produk");
      AppSwal.fire({ icon: 'success', title: 'BERHASIL', text: 'Produk ditambahkan!' });
      
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setHasSizes(false);
      setIsAdding(false);
      fetchInventory();
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'ERROR', text: err.message });
    }
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    const result = await AppSwal.fire({
      title: 'HAPUS PRODUK?',
      text: `Produk "${productName}" dan seluruh variasinya akan dihapus permanen. Lanjutkan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus produk");
      fetchInventory();
    } catch (err) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'Terjadi kesalahan sistem' });
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-[#E63E00]">Memuat Inventory...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F]">Manajemen Stok Merchandise</h1>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-[#E63E00] hover:bg-[#CCFF00] hover:text-[#001F3F] text-white hidden sm:flex">
          <Plus className="w-4 h-4 mr-2" /> Tambah Produk
        </Button>
      </div>
      
      {/* Tombol mobile */}
      <Button onClick={() => setIsAdding(!isAdding)} className="w-full mb-6 bg-[#E63E00] hover:bg-[#CCFF00] hover:text-[#001F3F] text-white sm:hidden">
        <Plus className="w-4 h-4 mr-2" /> Tambah Produk
      </Button>

      {isAdding && (
        <Card className="mb-8 border-2 border-foreground shadow-[4px_4px_0_0_#E63E00]">
          <CardHeader className="bg-foreground text-white">
            <CardTitle>Injeksi Produk Baru</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Nama Produk</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Contoh: Kemeja YMCC" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Harga (Rp)</label>
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="150000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">URL Gambar Sampul</label>
                  <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="md:pt-6 flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-foreground bg-gray-100 p-2 rounded-md w-full border border-gray-300">
                    <input type="checkbox" checked={hasSizes} onChange={e => setHasSizes(e.target.checked)} className="w-5 h-5 accent-[#E63E00]" />
                    Miliki Variansi Ukuran (S, M, L, XL, XXL)
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-1">Deskripsi Singkat</label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Deskripsikan barang jualan ini..." />
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <Button type="submit" className="flex-1 bg-[#CCFF00] text-[#001F3F] font-bold border-2 border-transparent hover:border-[#001F3F]">SIMPAN BARANG</Button>
                <Button type="button" onClick={() => setIsAdding(false)} className="bg-zinc-200 text-foreground">BATAL</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b p-4 md:p-6">
              <div className="flex items-center gap-4">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded shadow-sm" />
                )}
                <CardTitle className="text-lg md:text-xl text-[#001F3F]">{product.name}</CardTitle>
              </div>
              <Button onClick={() => handleDeleteProduct(product.id, product.name)} variant="destructive" size="sm" className="bg-red-500 hover:bg-red-700 h-9">
                <Trash2 className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Hapus</span>
              </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-sm text-gray-500 font-medium w-1/3">Variasi Ukuran</th>
                      <th className="pb-3 text-sm text-gray-500 font-medium w-1/3">Stok Tersedia</th>
                      <th className="pb-3 text-sm text-gray-500 font-medium w-1/3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v) => (
                      <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-medium text-[#E63E00]">{v.size}</td>
                        <td className="py-4">
                          <Input 
                            type="number" 
                            defaultValue={v.stock}
                            className="w-24 border-[#FF4500] focus-visible:ring-[#FF4500]"
                            id={`stock-${v.id}`}
                          />
                        </td>
                        <td className="py-4 text-right">
                          <Button 
                            className="bg-[#001F3F] hover:bg-blue-900 text-white transition-colors"
                            onClick={() => {
                              const input = document.getElementById(`stock-${v.id}`) as HTMLInputElement;
                              handleStockUpdate(v.id, parseInt(input.value || "0"));
                            }}
                            disabled={updatingId === v.id}
                          >
                            {updatingId === v.id ? "Menyimpan..." : "Update Stok"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
            Tidak ada produk merchandise. Silakan tambahkan via Database terlebih dahulu.
          </div>
        )}
      </div>
    </div>
  );
}
