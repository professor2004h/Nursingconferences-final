import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * Razorpay Order Creation API
 * Creates a Razorpay order for payment processing
 */

interface CreateOrderRequest {
  amount: number;
  currency: string;
  registrationId: string;
  customerEmail: string;
  customerName: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Razorpay order creation requested...');
    
    const body: CreateOrderRequest = await request.json();
    const { amount, currency, registrationId, customerEmail, customerName } = body;
    
    // Validate required fields
    if (!amount || !currency || !registrationId || !customerEmail) {
      console.error('❌ Missing required fields for Razorpay order creation');
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, registrationId, customerEmail' },
        { status: 400 }
      );
    }
    
    // Validate amount
    if (amount <= 0) {
      console.error('❌ Invalid amount for Razorpay order:', amount);
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Initialize Razorpay with live credentials
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_R9VnwrQgZO91tz',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'onO6rsu0Bg20oIgjUygqJTEl',
    });
    
    console.log('🔷 Razorpay instance created with live credentials');
    console.log('📊 Order details:', {
      amount,
      currency,
      registrationId,
      customerEmail,
      customerName: customerName || 'Not provided'
    });
    
    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);
    
    // Create order options
    const orderOptions = {
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: `receipt_${registrationId}_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        registrationId,
        customerEmail,
        customerName: customerName || 'Conference Participant',
        purpose: 'International Nursing Conference 2025 Registration'
      }
    };
    
    console.log('🔷 Creating Razorpay order with options:', {
      ...orderOptions,
      amount: `${amountInSmallestUnit} (${amount} ${currency})`
    });
    
    // Create order with Razorpay
    const order = await razorpay.orders.create(orderOptions);
    
    console.log('✅ Razorpay order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt
    });
    
    // Return order details for frontend
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_R9VnwrQgZO91tz',
      registrationId,
      customerDetails: {
        email: customerEmail,
        name: customerName || 'Conference Participant'
      }
    });
    
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    
    // Handle specific Razorpay errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid key')) {
        return NextResponse.json(
          { error: 'Invalid Razorpay credentials' },
          { status: 401 }
        );
      } else if (error.message.includes('amount')) {
        return NextResponse.json(
          { error: 'Invalid amount specified' },
          { status: 400 }
        );
      } else if (error.message.includes('currency')) {
        return NextResponse.json(
          { error: 'Invalid currency specified' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create Razorpay order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Razorpay order creation endpoint',
    usage: 'POST with order data to create Razorpay order',
    example: {
      amount: 399,
      currency: 'USD',
      registrationId: 'REG-123456789',
      customerEmail: 'customer@example.com',
      customerName: 'Dr. John Doe'
    },
    credentials: {
      keyId: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Missing',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Missing'
    }
  });
}
