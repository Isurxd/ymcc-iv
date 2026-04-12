"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppSwal from "@/lib/swal";

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

  if (loading) return <div className="p-8 text-center animate-pulse text-[#E63E00]">Memuat Inventory...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-[#001F3F]">Manajemen Stok Merchandise</h1>
      
      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 border-b">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
              )}
              <CardTitle className="text-xl text-[#001F3F]">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
