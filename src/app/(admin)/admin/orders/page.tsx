'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Truck, CheckCircle, Package, Search } from 'lucide-react';
import AppSwal from '@/lib/swal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) setOrders(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, currentStatus: string) => {
    const { value: status } = await AppSwal.fire({
      title: 'UPDATE STATUS PESANAN',
      input: 'select',
      inputOptions: {
        'PENDING_PAYMENT': 'PENDING PAYMENT',
        'PAID': 'PAID / PACKING',
        'SHIPPED': 'SHIPPED',
        'COMPLETED': 'COMPLETED',
        'CANCELLED': 'CANCELLED'
      },
      inputValue: currentStatus,
      showCancelButton: true
    });

    if (status) {
      let trackingNumber = '';
      if (status === 'SHIPPED') {
        const { value: trk } = await AppSwal.fire({
          title: 'INPUT NOMOR RESI',
          input: 'text',
          inputPlaceholder: 'Masukkan nomor resi ekspedisi...',
          showCancelButton: true
        });
        if (trk === undefined) return; // User cancelled
        trackingNumber = trk;
      }

      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status, trackingNumber })
        });
        if (res.ok) fetchOrders();
      } catch (e) { AppSwal.fire('Error', 'Gagal update status', 'error'); }
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PENDING_PAYMENT': return 'bg-amber-100 text-amber-700 border-amber-400';
      case 'PAID': return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-400';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-400';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b-4 border-foreground pb-6 bg-white p-8 shadow-brutal-sm flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black uppercase text-foreground">MANAJEMEN ORDER.</h1>
          <p className="font-bold text-zinc-500 uppercase mt-2">Pantau dan kelola pengiriman Merchandise YMCC</p>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center font-bold text-2xl uppercase">MEMUAT DATA ORDER...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white border-4 border-foreground shadow-brutal uppercase font-black text-xl">BELUM ADA PESANAN MASUK 🧊</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white border-4 border-foreground shadow-brutal rounded-none overflow-hidden">
              <div className={`p-2 border-b-4 border-foreground flex justify-between items-center px-6 ${getStatusColor(order.status)}`}>
                <span className="font-black text-xs tracking-widest uppercase">STATUS: {order.status}</span>
                <span className="font-black text-xs tracking-widest uppercase">REF: {order.id.slice(0, 8)}</span>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Section 1: Customer */}
                <div className="space-y-2">
                  <p className="font-bold text-zinc-400 text-[10px] uppercase tracking-tighter">PELANGGAN</p>
                  <h3 className="font-black text-xl uppercase">{order.customerName}</h3>
                  <p className="text-sm font-bold text-zinc-600">{order.customerPhone}</p>
                  <p className="text-xs font-bold text-zinc-500 uppercase border-l-2 border-zinc-200 pl-2 mt-2">{order.shippingAddress}</p>
                </div>

                {/* Section 2: Items */}
                <div className="space-y-4">
                  <p className="font-bold text-zinc-400 text-[10px] uppercase tracking-tighter">BELANJAAN</p>
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 border-b-2 border-zinc-100 pb-2">
                      <div className="w-10 h-10 bg-zinc-100 border-2 border-foreground rounded-none flex items-center justify-center font-black text-xs">{item.quantity}x</div>
                      <div className="flex-1">
                        <p className="font-bold text-xs uppercase line-clamp-1">{item.variant.product.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold">SIZE: {item.variant.size}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="font-bold text-zinc-400 text-xs">TOTAL BAYAR:</span>
                    <span className="font-black text-xl text-accent">Rp {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Section 3: Action */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="font-bold text-zinc-400 text-[10px] uppercase tracking-tighter">LOGISTIK</p>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-zinc-400" />
                      <span className="font-black text-xs uppercase">{order.shippingCourier}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Truck className="w-5 h-5" />
                        <span className="font-black text-xs uppercase">RESI: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => updateStatus(order.id, order.status)}
                    className="mt-6 h-12 bg-foreground text-white border-4 border-foreground shadow-brutal-sm hover:translate-x-1 hover:-translate-y-1 transition-all rounded-none font-black text-xs"
                  >
                    UPDATE STATUS ORDER
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
