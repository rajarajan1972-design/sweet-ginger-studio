import { NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/emailService';
import { OrderRecord } from '@/types/design';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, order, newStatus } = body as {
      type: 'confirmation' | 'status_update';
      order: OrderRecord;
      newStatus?: OrderRecord['status'];
    };

    if (!order || !order.orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Invalid order record provided' },
        { status: 400 }
      );
    }

    const result = await sendOrderEmail({
      type: type || 'confirmation',
      order,
      newStatus,
    });

    return NextResponse.json({
      success: true,
      message: `Email successfully processed for ${order.customerEmail}`,
      result,
    });
  } catch (error: unknown) {
    console.error('[API /api/orders/email] Error handling email dispatch:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown email dispatch error' },
      { status: 500 }
    );
  }
}
