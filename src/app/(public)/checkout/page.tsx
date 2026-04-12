'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/merch/cart-context';
import { ShoppingCart, CloudUpload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-zinc-200 animate-pulse flex items-center justify-center font-bold text-zinc-500 uppercase">MEMUAT PETA SATELIT...</div>
});

const defaultCenter = { lat: -7.7610, lng: 110.4098 }; // Default UPN Veteran Yogyakarta

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    courier: 'jne',
  });

  // Auto-fill nama dan email jika user sedang login
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFormData(prev => ({
              ...prev,
              name: data.user.name || '',
              email: data.user.email || ''
            }));
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };
    fetchUserData();
  }, []);

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Nominatim search
  const handleSearchOSM = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (q.length > 3) {
      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`, {
            headers: {
              'Accept-Language': 'id'
            }
          });
          if (!res.ok) throw new Error("Fetch OSM failed");
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("OSM Search Error", err);
        }
      }, 800); // 800ms debounce
    } else {
      setSearchResults([]);
    }
  };

  const selectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setSearchQuery('');
    setSearchResults([]);
    handleLocationSelect({ lat, lng });
  };

  const handleLocationSelect = async (pos: { lat: number; lng: number }) => {
    setMapCenter(pos);
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`, {
        headers: {
          'Accept-Language': 'id'
        }
      });
      if (!res.ok) throw new Error("Geo OSM failed");
      const data = await res.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error("Geocoding OSM failed", err);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-zinc-50">
        <ShoppingCart className="w-24 h-24 text-zinc-300 mb-6" />
        <h2 className="text-3xl font-heading text-foreground italic uppercase">KERANJANG BELANJA KOSONG</h2>
        <Link href="/merch" className="mt-6 uppercase px-8 py-3 bg-foreground text-white border-4 border-transparent hover:border-accent hover:bg-zinc-800 transition-all font-bold tracking-widest">
          KEMBALI KE MERCH SHOP
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-zinc-50">
        <div className="bg-white border-4 border-foreground shadow-brutal-lg p-12 text-center max-w-2xl w-full">
          <div className="w-24 h-24 bg-accent border-4 border-foreground rounded-full flex items-center justify-center mx-auto mb-8 shadow-brutal-sm">
            <span className="text-4xl text-foreground font-bold">✓</span>
          </div>
          <h2 className="text-4xl font-heading text-foreground italic uppercase tracking-wide mb-4">PESANAN DITERIMA.</h2>
          <p className="font-bold text-zinc-600 mb-8 uppercase leading-relaxed border-l-4 border-accent pl-4 text-left inline-block">
            BUKTI PEMBAYARAN SEDANG DIVERIFIKASI.<br/>
            STATUS PESANAN AKAN DIKIRIM KE EMAIL ANDA DALAM 1X24 JAM.
          </p>
          <Link href="/" className="block w-full text-center uppercase px-8 py-4 bg-foreground text-white border-4 border-foreground hover:bg-white hover:text-foreground hover:shadow-brutal-md transition-all font-bold tracking-widest text-lg">
            KEMBALI KE BERANDA SEKARANG
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);

    try {
      const res = await fetch('/api/fundraising/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          shippingCourier: formData.courier,
          items: items.map(i => ({
            variantId: i.variantId,
            quantity: i.quantity,
            priceAtBuy: i.price
          }))
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'TRANSAKSI GAGAL');
      }

      const data = await res.json();
      
      clearCart();
      setSuccess(true);
      
      // Redirect to Xendit Payment Page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
      
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-16 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/merch" className="inline-flex items-center text-sm font-bold uppercase hover:text-orange-500 transition-colors mb-8 border-b-2 border-transparent hover:border-orange-500 pb-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI KE ETALASE
        </Link>

        <h1 className="text-5xl font-heading text-foreground italic uppercase tracking-wide drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F] mb-10">
          CHECKOUT PESANAN.
        </h1>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Order Summary Form */}
          <form onSubmit={handleSubmit} className="space-y-8 order-2 lg:order-1">
             {error && (
              <div className="bg-red-500 border-4 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] p-6 mb-8 flex justify-between items-center text-white">
                <div>
                  <h4 className="font-heading text-3xl uppercase italic">ERROR.</h4>
                  <p className="font-bold">{error}</p>
                </div>
              </div>
            )}

            <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none p-8">
              <h3 className="font-heading text-3xl uppercase italic mb-6 border-b-4 border-foreground pb-4 inline-block">DATA PENGIRIMAN</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-bold uppercase tracking-wider text-sm">Nama Lengkap Penerima</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} required className="bg-zinc-100 border-4 border-foreground h-14 rounded-none font-bold uppercase" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-bold uppercase tracking-wider text-sm">Alamat Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-zinc-100 border-4 border-foreground h-14 rounded-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-bold uppercase tracking-wider text-sm">No WhatsApp Aktif</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="bg-zinc-100 border-4 border-foreground h-14 rounded-none font-bold" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="address" className="text-foreground font-bold uppercase tracking-wider text-sm flex items-center justify-between">
                    <span>Alamat Pengiriman Lengkap (Sertakan Kode Pos)</span>
                    <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 border border-[#001F3F]">OPENSTREETMAP ENABLED</span>
                  </Label>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Input 
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchOSM}
                        placeholder="Cari lokasi desa, jalan, atau kota untuk mencari posisi di OS Map..."
                        className="w-full bg-zinc-100 border-4 border-foreground h-14 rounded-none font-bold focus-visible:outline-none focus:border-accent hover:border-accent hover:bg-zinc-50 transition-colors uppercase px-4"
                        onKeyDown={(e) => { if(e.key === 'Enter') e.preventDefault(); }}
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-4 border-foreground shadow-brutal-lg max-h-60 overflow-y-auto">
                          {searchResults.map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => selectSearchResult(item)}
                              className="p-3 border-b-2 border-zinc-200 cursor-pointer hover:bg-accent hover:text-foreground hover:font-bold transition-colors text-sm text-zinc-600"
                            >
                              {item.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-4 border-foreground p-1 bg-zinc-100 shadow-[6px_6px_0_0_#001F3F] relative z-10 w-full">
                       <MapPicker position={mapCenter} onPositionChange={handleLocationSelect} />
                    </div>

                    <textarea 
                      id="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                      placeholder="Detail Alamat Pengiriman Patokan (Bisa Edit Manual)"
                      className="w-full bg-amber-50 border-4 border-foreground rounded-none font-bold h-24 p-4 resize-none focus-visible:outline-none focus:border-accent hover:border-accent hover:bg-amber-100 transition-colors uppercase"
                    />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase">Sistem peta satelit ditenagai secara sukarela oleh OSM. Pastikan alamat sesuai untuk pengiriman.</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none p-8">
              <h3 className="font-heading text-3xl uppercase italic mb-6 border-b-4 border-foreground pb-4 inline-block flex items-center gap-3">
                KURIR & PEMBAYARAN
              </h3>
              
              <div className="space-y-2 mb-8">
                <Label htmlFor="courier" className="text-foreground font-bold uppercase tracking-wider text-sm">Pilihan Kurir Pengiriman</Label>
                <select 
                  id="courier" 
                  value={formData.courier} 
                  onChange={handleChange} 
                  className="w-full bg-zinc-100 border-4 border-foreground h-14 rounded-none font-bold uppercase px-4 cursor-pointer focus-visible:outline-none focus:border-accent hover:border-accent transition-colors"
                >
                  <option value="jne">JNE - REGULER COURIER</option>
                  <option value="sicepat">SICEPAT - REGULER</option>
                  <option value="jnt">J&T EXPRESS</option>
                  <option value="gosend">GO-SEND (KHUSUS JOGJA)</option>
                </select>
              </div>

              <div className="bg-amber-100 border-4 border-foreground p-6 mb-6">
                <p className="font-bold text-foreground mt-1 uppercase">SISTEM PEMBAYARAN OTOMATIS (XENDIT)</p>
                <p className="font-bold text-sm text-foreground mt-2">Anda akan dialihkan ke halaman pembayaran aman setelah klik tombol di bawah. Tersedia opsi Virtual Account, E-Wallet, dan QRIS.</p>
              </div>
            </Card>

            <Button type="submit" disabled={loading} className="w-full h-20 text-2xl font-heading uppercase italic tracking-widest bg-accent hover:bg-orange-500 text-foreground border-4 border-foreground shadow-[8px_8px_0_0_var(--color-primary)] hover:translate-x-1 hover:-translate-y-1 transition-all rounded-none">
              {loading ? 'MEMPROSES KREDENSIAL TRASAKSI...' : 'PROSES PENYELESAIAN ORDER ->'}
            </Button>
          </form>

          {/* Cart Summary */}
          <div className="bg-white border-4 border-foreground shadow-brutal-lg p-8 order-1 lg:order-2 sticky top-24">
            <h3 className="font-heading text-3xl uppercase italic mb-6 border-b-4 border-foreground pb-4">RINGKASAN ORDER</h3>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-100 border-2 border-foreground shrink-0 overflow-hidden">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold uppercase leading-tight line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-bold text-zinc-500 uppercase mt-1">UKURAN: {item.size} | QTY: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-accent shrink-0">
                    Rp {((item.price * item.quantity) / 1000)}k
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-4 border-dashed border-zinc-200 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-zinc-500 uppercase">SUBTOTAL ({totalItems} ITEM)</span>
                <span className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-zinc-500 uppercase">ONGKOS KIRIM</span>
                <span className="font-bold text-accent uppercase">MENYUSUL (C.O.D)</span>
              </div>
              
              <div className="border-t-4 border-foreground pt-6 flex justify-between items-center bg-zinc-50 p-4">
                <span className="font-heading text-2xl uppercase italic">TOTAL:</span>
                <span className="font-heading text-4xl text-accent drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
