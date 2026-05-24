'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Truck, Package, Clock, CheckCircle2 } from 'lucide-react';

import { useSearchParams } from 'next/navigation';
import AppSwal from '@/lib/swal';

export default function ParticipantOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      AppSwal.fire({
        title: 'PEMBAYARAN BERHASIL!',
        text: 'Pesanan Anda sedang diproses oleh tim fundraising kami.',
        icon: 'success',
        confirmButtonColor: '#0ea5e9'
      });
    } else if (status === 'failed') {
      AppSwal.fire({
        title: 'PEMBAYARAN GAGAL',
        text: 'Terdapat kendala pada transaksi Anda. Silakan coba lagi nanti.',
        icon: 'error'
      });
    }

    const fetchOrders = async () => {
      try {
        // We'll use a new API endpoint to fetch orders linked to the logged-in user's email
        const res = await fetch('/api/participant/orders');
        if (res.ok) setOrders(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'PAID': return <Package className="w-5 h-5 text-blue-500" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-zinc-400" />;
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">MEMUAT RIWAYAT PESANAN...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-blue-500 bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <h1 className="text-4xl font-black uppercase tracking-wide text-[#001F3F]">
          RIWAYAT BELANJA.
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest max-w-2xl text-sm">
          Pantau status pengiriman Merchandise YMCC VII Anda di sini.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-white border-4 border-foreground shadow-brutal p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
          <h2 className="font-black text-xl uppercase">ANDA BELUM MEMILIKI PESANAN</h2>
          <p className="font-bold text-zinc-500 mt-2">Yuk cek koleksi keren di Merch Shop!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white border-4 border-foreground shadow-brutal rounded-none overflow-hidden">
              <CardHeader className="bg-zinc-50 border-b-4 border-foreground p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <CardTitle className="text-lg font-black uppercase">{order.status.replace('_', ' ')}</CardTitle>
                    <p className="text-[10px] font-bold text-zinc-400">ORDER ID: {order.id.slice(0, 12)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Total Pesanan</p>
                  <p className="text-2xl font-black text-accent">Rp {order.totalAmount.toLocaleString()}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="font-bold text-zinc-400 text-[10px] uppercase">Rincian Produk</p>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <span className="font-bold text-sm uppercase">{item.quantity}x {item.variant.product.name} ({item.variant.size})</span>
                        <span className="font-bold text-zinc-600 text-sm">Rp {(item.priceAtBuy * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 bg-zinc-50 p-4 border-2 border-dashed border-zinc-200">
                    <p className="font-bold text-zinc-400 text-[10px] uppercase">Informasi Pengiriman</p>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-zinc-400 mt-1" />
                      <div>
                        <p className="font-bold text-sm uppercase">{order.shippingCourier}</p>
                        <p className="text-xs text-zinc-600 font-bold mt-1 uppercase">{order.shippingAddress}</p>
                        {order.trackingNumber && (
                          <div className="mt-3 p-2 bg-blue-100 border-2 border-blue-400 inline-block">
                            <p className="text-[10px] font-black text-blue-700 uppercase">NOMOR RESI:</p>
                            <p className="font-black text-blue-800 uppercase">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
