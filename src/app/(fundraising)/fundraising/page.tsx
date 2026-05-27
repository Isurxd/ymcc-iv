'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Receipt, 
  DollarSign, 
  ArrowRight, 
  Activity, 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  LayoutGrid, 
  Zap, 
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import AppSwal from '@/lib/swal';

export default function FundraisingDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/fundraising/orders'); // Assuming an API exists or I'll need to create one if it doesn't
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // Fallback simulated data if API not ready
        setOrders([]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'SHIPPED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'PENDING_PAYMENT').length;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* 1. FUNDRAISING ELITE HEADER */}
      <header className="bg-white border-2 border-black p-8 md:p-12 rounded-[3.5rem] shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -translate-y-1/2 translate-x-1/4">
           <DollarSign size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]">
               <ShieldCheck size={14} />
               REVENUE NODE ACTIVE
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase italic leading-[0.9]">
              FUNDRAISING <br/>
              COMMAND HQ.
            </h1>
            <p className="mt-6 font-bold text-zinc-400 uppercase tracking-widest text-xs italic max-w-2xl leading-relaxed">
              Managing official YMCC variants and logistics synchronization.
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchOrders} className="w-14 h-14 bg-white border-2 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
             </button>
             <Link href="/admin/merch" className="bg-[#CCFF00] text-black border-2 border-black px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
                <Plus size={16} /> ADD VARIANT
             </Link>
          </div>
        </div>
      </header>

      {/* 2. REVENUE & LOGISTICS BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Revenue Block */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="bg-[#EBF7D3] border-2 border-black rounded-[3.5rem] p-10 md:p-14 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <Zap size={24} className="text-black" />
                    <h3 className="font-black text-2xl uppercase tracking-tighter italic">Live Revenue Metrics</h3>
                 </div>
                 <div className="bg-white border-2 border-black px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                    Real-time Sync
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white border-2 border-black rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000]">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block italic">TOTAL VERIFIED REVENUE:</span>
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                          <DollarSign size={28} />
                       </div>
                       <span className="text-6xl font-black italic tracking-tighter">Rp {(totalRevenue / 1000).toLocaleString('id-ID')}k</span>
                    </div>
                 </div>

                 <div className="bg-white border-2 border-black rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000]">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block italic">PENDING ORDERS:</span>
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-black text-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                          <ShoppingBag size={28} />
                       </div>
                       <span className="text-6xl font-black italic tracking-tighter">{pendingOrders}</span>
                    </div>
                 </div>
              </div>

              {/* Action Band */}
              <div className="mt-10 bg-white border-2 border-black rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_0px_#000]">
                 <div className="flex items-center gap-5 text-left">
                    <div className="w-12 h-12 bg-green-50 border-2 border-black rounded-2xl flex items-center justify-center">
                       <Truck size={24} className="text-green-600" />
                    </div>
                    <div>
                        <h5 className="font-black text-xs uppercase tracking-tight">Logistic Sync System</h5>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase italic tracking-widest">Connect your biteship node to automate fulfillment.</p>
                    </div>
                 </div>
                 <button className="bg-black text-[#CCFF00] border-2 border-black px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    CONNECT LOGISTICS
                 </button>
              </div>
           </div>

           {/* Order Management Table */}
           <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                 <div className="flex items-center gap-4">
                    <Receipt size={24} />
                    <h3 className="font-black text-2xl uppercase tracking-tighter italic">Order Feed</h3>
                 </div>
                 <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/3 text-zinc-300 w-4 h-4" />
                    <input type="text" placeholder="SEARCH ORDERS..." className="w-full bg-zinc-50 border-2 border-black rounded-2xl py-4 pl-12 pr-6 font-black text-[10px] uppercase focus:bg-white focus:outline-none" />
                 </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                {orders.map((order) => (
                   <OrderCard key={order.id} order={order} />
                ))}
                {orders.length === 0 && !loading && (
                   <div className="flex flex-col items-center justify-center py-24 text-zinc-300">
                      <Package size={64} className="mb-4" />
                      <p className="font-black text-sm uppercase tracking-widest">No transactions detected.</p>
                   </div>
                )}
              </div>
           </div>
        </div>

        {/* Sidebar / Hub */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           {/* Quick Actions Hub */}
           <div className="bg-white border-2 border-black rounded-[3.5rem] p-10 shadow-[8px_8px_0px_0px_#000] flex-grow">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="font-black text-xl uppercase tracking-tighter italic">Operations</h4>
                 <div className="p-2 border-2 border-black rounded-xl">
                    <LayoutGrid size={20} />
                 </div>
              </div>

              <div className="space-y-4">
                 <HubItem icon={<Activity />} title="Live Sales" count="ACTIVE" desc="Tracking checkout nodes." />
                 <HubItem icon={<CreditCard />} title="Persetujuan" count={pendingOrders} desc="Verify manual bank pings." />
                 <HubItem icon={<Package />} title="Stock Level" count={12} desc="Manage official merch pool." />
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-50">
                 <button className="w-full bg-[#CCFF00] text-black border-2 border-black py-5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Generate Report <ChevronRight size={14} />
                 </button>
              </div>
           </div>

           {/* System Status Node */}
           <div className="bg-black text-white border-2 border-black rounded-[3.5rem] p-12 shadow-[8px_8px_0px_0px_#CCFF00] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={140} className="text-[#CCFF00]" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                 <h4 className="text-3xl font-black uppercase tracking-tighter italic text-[#CCFF00] mb-6">Master Node.</h4>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Database Sync</span>
                       <span className="text-[10px] font-black text-green-500">OPTIMIZED</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Merchant API</span>
                       <span className="text-[10px] font-black text-green-500">CONNECTED</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Total Variants</span>
                       <span className="text-[10px] font-black text-white">42 UNITS</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

function OrderCard({ order }: any) {
  const updateStatus = () => {
     AppSwal.fire({
        title: 'UPDATE ORDER NODE',
        input: 'select',
        inputOptions: {
           PENDING_PAYMENT: 'PENDING_PAYMENT',
           PAID: 'PAID',
           PROCESSING: 'PROCESSING',
           SHIPPED: 'SHIPPED',
           COMPLETED: 'COMPLETED',
           CANCELLED: 'CANCELLED'
        },
        inputValue: order.status,
        confirmButtonText: 'MODIFY STATUS',
        confirmButtonColor: '#000000',
        customClass: {
           popup: 'rounded-[3rem] border-4 border-black'
        }
     });
  }

  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[3rem] group hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] transition-all">
       <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center group-hover:bg-[#CCFF00] transition-all">
                <Receipt size={24} />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h5 className="font-black text-lg uppercase tracking-tight italic">{order.customerName}</h5>
                   <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full font-black">#{order.id.slice(0,6)}</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">{order.items.length} items • Rp {order.totalAmount / 1000}k</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Current Status:</div>
                <span className="bg-white border border-black px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest">{order.status}</span>
             </div>
             <button 
                onClick={updateStatus}
                className="w-12 h-12 bg-white border-2 border-black rounded-2xl flex items-center justify-center hover:bg-[#CCFF00] transition-all shadow-[2px_2px_0px_0px_#000] active:scale-95"
             >
                <RefreshCw size={18} />
             </button>
             {order.receiptUrl && (
                <a href={order.receiptUrl} target="_blank" className="w-12 h-12 bg-black text-[#CCFF00] border-2 border-black rounded-2xl flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all shadow-[2px_2px_0px_0px_#000] active:scale-95">
                   <ExternalLink size={18} />
                </a>
             )}
          </div>
       </div>
    </div>
  );
}

function HubItem({ icon, title, count, desc }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[2.5rem] flex items-center gap-5 hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group">
       <div className="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center group-hover:bg-[#CCFF00] transition-all">
          {React.cloneElement(icon, { size: 24 })}
       </div>
       <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
             <h5 className="font-black text-xs uppercase tracking-tight">{title}</h5>
             <span className="bg-black text-[#CCFF00] text-[8px] px-1.5 py-0.5 rounded-md font-black">{count}</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight italic">{desc}</p>
       </div>
       <ChevronRight size={16} className="text-zinc-300 group-hover:text-black" />
    </div>
  );
}
