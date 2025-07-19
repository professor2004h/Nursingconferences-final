import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      sponsorshipData
    } = body;

    console.log('🔍 Test payment verification request:', {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      hasSignature: !!razorpaySignature
    });

    // Handle test payments
    if (razorpayOrderId?.startsWith('order_test_') ||
        razorpayOrderId?.startsWith('order_working_') ||
        razorpayOrderId?.startsWith('order_mock_') ||
        razorpayOrderId?.startsWith('order_fallback_')) {

      let paymentType = 'test';
      if (razorpayOrderId.startsWith('order_working_')) paymentType = 'working';
      if (razorpayOrderId.startsWith('order_mock_')) paymentType = 'mock';
      if (razorpayOrderId.startsWith('order_fallback_')) paymentType = 'fallback';
      
      console.log(`🧪 Processing ${paymentType} payment verification...`);
      
      // Generate invoice number for successful payment
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      return NextResponse.json({
        success: true,
        verified: true,
        [paymentType]: true,
        message: `${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} payment verified successfully`,
        paymentId: razorpayPaymentId || `pay_${paymentType}_${Date.now()}`,
        orderId: razorpayOrderId,
        invoiceNumber: invoiceNumber,
        timestamp: new Date().toISOString(),
        sponsorshipData: sponsorshipData
      });
    }

    // For real Razorpay payments (when implemented)
    return NextResponse.json(
      { error: 'Real Razorpay verification not implemented yet' },
      { status: 501 }
    );

  } catch (error) {
    console.error('❌ Error verifying test payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Test payment verification endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
