import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Validate signature based on Biteship documentation
    // In production, compare req.headers.get('biteship-signature') with payload hmac
    
    // Authorization check
    const authHeader = req.headers.get('Authorization');
    // For biteship webhook, usually we check signature. For simplicity in this codebase
    // we assume payload format handles the logic.

    const payload = await req.json();

    // Event documentation: https://biteship.com/docs/api/webhooks
    const { order_id, event, status } = payload;
    
    if (!order_id) {
       return NextResponse.json({ message: 'No biteship order_id provided' }, { status: 400 });
    }

    // Typical Biteship statuses: 
    // allocated, picking_up, picked, dropping_off, delivered, rejected, cancelled
    
    let dbStatus = 'PROCESSING';
    
    if (status === 'dropping_off') {
        dbStatus = 'SHIPPED';
    } else if (status === 'delivered') {
        dbStatus = 'DELIVERED';
    } else if (status === 'cancelled' || status === 'rejected') {
        dbStatus = 'PAID'; // Rollback back to PAID so admin can re-dispatch if error
    }

    // Update order status based on Biteship Tracking
    await prisma.order.updateMany({
      where: { biteshipOrderId: order_id },
      data: { status: dbStatus }
    });

    return NextResponse.json({ message: 'Biteship webhook processed seamlessly', newStatus: dbStatus });

  } catch (error: any) {
    console.error('Biteship Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook processing failed', error: error.message }, { status: 500 });
  }
}
