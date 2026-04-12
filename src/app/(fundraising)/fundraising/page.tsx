import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Receipt, DollarSign } from 'lucide-react';

export const revalidate = 0; // Dynamic page

export default async function FundraisingDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { variant: { include: { product: true } } }
      }
    }
  });

  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'SHIPPED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'PENDING_PAYMENT');

  return (
    <div className="space-y-8">
      <header className="border-b-4 border-foreground pb-6">
        <h1 className="text-5xl font-black uppercase tracking-wide text-[#001F3F]">
          FUNDRAISING HQ.
        </h1>
        <p className="text-lg text-zinc-600 font-bold border-l-4 border-accent pl-4 mt-2 uppercase tracking-wide">
          OFFICIAL MERCHANDISE & LOGISTICS COMMAND CENTER
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard title="Total Revenue (Verified)" value={`Rp ${(totalRevenue / 1000).toLocaleString('id-ID')}k`} icon={<DollarSign className="w-8 h-8 text-primary" />} />
        <MetricCard title="Total Orders" value={orders.length.toString()} icon={<Receipt className="w-8 h-8 text-blue-500" />} />
        <MetricCard title="Pending Payments" value={pendingOrders.length.toString()} icon={<Package className="w-8 h-8 text-amber-500" />} />
      </div>

      <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none">
        <CardHeader className="bg-primary border-b-4 border-foreground text-white p-6">
          <CardTitle className="text-3xl font-black uppercase">ORDER MANAGEMENT</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-bold uppercase text-sm border-collapse min-w-[800px]">
            <thead className="bg-zinc-100 border-b-4 border-foreground text-zinc-600">
              <tr>
                <th className="p-4 border-r-2 border-foreground">ORDER ID / TIME</th>
                <th className="p-4 border-r-2 border-foreground">CUSTOMER</th>
                <th className="p-4 border-r-2 border-foreground">ITEMS</th>
                <th className="p-4 border-r-2 border-foreground">TOTAL</th>
                <th className="p-4 border-r-2 border-foreground">STATUS / ACTION</th>
                <th className="p-4">RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400 italic">BELUM ADA TRANSAKSI</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b-2 border-zinc-200 hover:bg-amber-50 transition-colors">
                    <td className="p-4 border-r-2 border-foreground">
                      <div className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                      <div className="truncate w-32 font-mono">{order.id.split('-')[0]}***</div>
                    </td>
                    <td className="p-4 border-r-2 border-foreground">
                      <div className="text-foreground">{order.customerName}</div>
                      <div className="text-xs text-zinc-500">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 border-r-2 border-foreground">
                      {order.items.map(i => (
                        <div key={i.id} className="text-xs">
                          {i.quantity}x {i.variant.product.name} ({i.variant.size})
                        </div>
                      ))}
                    </td>
                    <td className="p-4 border-r-2 border-foreground text-accent">
                      Rp {(order.totalAmount / 1000)}k
                    </td>
                    <td className="p-4 border-r-2 border-foreground">
                      <form action={`/api/fundraising/orders/${order.id}`} method="POST" className="flex items-center gap-2">
                         <select name="status" defaultValue={order.status} className="bg-white border-2 border-foreground font-bold p-2 text-xs uppercase cursor-pointer">
                            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                            <option value="PAID">PAID</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                         </select>
                         <button type="submit" className="bg-foreground text-white px-3 py-2 text-xs font-bold hover:bg-accent hover:border-accent border-2 border-foreground transition-all uppercase">
                           Update
                         </button>
                      </form>
                    </td>
                    <td className="p-4">
                      {order.receiptUrl ? (
                         <a href={order.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">VIEW PROOF</a>
                      ) : (
                         <span className="text-xs text-zinc-400">NO PROOF</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      {/* 
        Note: Inventory Management UI could be added here as another Card 
        listing variants and stock inputs mapped to an inventory API.
      */}
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-white border-4 border-foreground shadow-brutal-md rounded-none">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-1">{title}</p>
          <p className="text-4xl font-black text-foreground">{value}</p>
        </div>
        <div className="bg-zinc-100 p-4 border-2 border-foreground rounded-full">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
