import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Secret token for Xendit callback verification (Set this in your Xendit Dashboard -> Callbacks)
const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;

export async function POST(req: Request) {
  try {
    // 1. Verify Xendit Token
    const xenditToken = req.headers.get('x-callback-token');
    
    if (XENDIT_WEBHOOK_TOKEN && xenditToken !== XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // Event structure based on Invoice Callback
    // https://developers.xendit.co/api-reference/#invoice-callback
    const { external_id, status, status_transitions } = payload;

    if (!external_id) {
      return NextResponse.json({ message: 'No external_id provided' }, { status: 400 });
    }

    // 2. We only care if it's PAID or SETTLED (berhasil bayar)
    if (status === 'PAID' || status === 'SETTLED') {
      
      // Update the order in the database
      const order = await prisma.order.update({
        where: { id: external_id },
        data: { 
          status: 'PAID',
          updatedAt: new Date(status_transitions?.paid_at || new Date())
        },
        include: { items: true } // Need items context for shipping
      });

      // 3. Create Biteship Order (Logistics) automatically if needed
      // Note: Full Biteship API requires origin address, exact postal codes, etc.
      if (process.env.BITESHIP_API_KEY && order.shippingCourier) {
        try {
          const biteshipResponse = await fetch('https://api.biteship.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': process.env.BITESHIP_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              shipper_contact_name: "Admin YMCC VII",
              shipper_contact_phone: "081234567890", // Ganti dengan nomor asli
              shipper_organization: "YMCC VII",
              origin_contact_name: "Admin YMCC Logistics",
              origin_contact_phone: "081234567890",
              origin_address: "Alamat asal pengiriman (Ganti sesuai panitia)", 
              destination_contact_name: order.customerName,
              destination_contact_phone: order.customerPhone,
              destination_contact_email: order.customerEmail,
              destination_address: order.shippingAddress,
              // Note: For Biteship to work robustly, frontend should ideally send postal_code and area_id
              destination_postal_code: 12345, // Dummy default
              courier_company: order.shippingCourier, 
              courier_type: "reg", // Tipe layanan pengiriman (reguler, dll)
              delivery_type: "now",
              items: order.items.map((item) => ({
                name: `Barang Variant ${item.variantId}`,
                value: item.priceAtBuy,
                quantity: item.quantity,
                weight: 200 // Berat estimasi (gram)
              }))
            })
          });

          if (biteshipResponse.ok) {
            const biteshipData = await biteshipResponse.json();
            
            // Update the order with tracking and biteship ID
            await prisma.order.update({
              where: { id: order.id },
              data: {
                biteshipOrderId: biteshipData.id,
                trackingNumber: biteshipData.courier.tracking_id || biteshipData.courier.waybill_id,
                status: 'PROCESSING' // Order siap diproses untuk kurir
              }
            });
            console.log("Berhasil membuat order pengiriman di Biteship:", biteshipData.id);
          } else {
             console.error("Gagal membuat order Biteship:", await biteshipResponse.text());
          }
        } catch (biteshipError) {
          console.error("Error connecting to Biteship:", biteshipError);
        }
      }

      return NextResponse.json({ message: 'Success marking order as PAID and creating shipment' });
    }

    // Jika expired dll
    if (status === 'EXPIRED') {
       await prisma.order.update({
        where: { id: external_id },
        data: { status: 'CANCELLED' }
      });
      return NextResponse.json({ message: 'Order marked as EXPIRED/CANCELLED' });
    }

    // Return 200 for other unhandled events so Xendit doesn't retry
    return NextResponse.json({ message: 'Event ignored' });

  } catch (error: any) {
    console.error('Xendit Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook processing failed', error: error.message }, { status: 500 });
  }
}
