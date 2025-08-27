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
  registrationData?: any;
  customerEmail: string;
  customerName: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Razorpay order creation requested...');
    console.log('🔷 Request URL:', request.url);
    console.log('🔷 Request method:', request.method);

    const body: CreateOrderRequest = await request.json();
    console.log('🔷 Request body received:', JSON.stringify(body, null, 2));

    const { amount, currency, registrationId, registrationData, customerEmail, customerName } = body;
    
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
    
    // Initialize Razorpay with environment credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('❌ Missing Razorpay credentials in environment variables');
      return NextResponse.json(
        { error: 'Razorpay credentials not configured' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    console.log('🔷 Razorpay instance created with credentials:', {
      keyId: keyId.substring(0, 12) + '...',
      environment: keyId.includes('test') ? 'TEST' : 'LIVE'
    });
    console.log('📊 Order details:', {
      amount,
      currency,
      registrationId,
      customerEmail,
      customerName: customerName || 'Not provided'
    });
    
    // Validate currency support for Razorpay
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR'];
    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      console.error(`❌ Unsupported currency for Razorpay: ${currency}`);
      return NextResponse.json(
        { error: `Currency ${currency} is not supported. Supported currencies: ${supportedCurrencies.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);
    
    // Create order options
    // Generate a short receipt (max 40 chars) - use last 8 chars of regId + timestamp
    const shortRegId = registrationId.slice(-8);
    const shortTimestamp = Date.now().toString().slice(-6);
    const receipt = `rcpt_${shortRegId}_${shortTimestamp}`;

    const orderOptions = {
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: receipt,
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
    console.log('🔷 Calling Razorpay API with options:', orderOptions);
    const order = await razorpay.orders.create(orderOptions);
    console.log('🔷 Raw Razorpay API response:', order);
    
    console.log('✅ Razorpay order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt
    });

    // Update registration with Razorpay order ID if it's a temporary ID (similar to PayPal)
    let finalRegistrationId = registrationId;
    if (registrationId.startsWith('TEMP-')) {
      try {
        console.log('🔄 Updating registration with Razorpay order ID...');
        const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/registration/update-razorpay-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tempRegistrationId: registrationId,
            razorpayOrderId: order.id,
            paymentStatus: 'pending'
          }),
        });

        if (updateResponse.ok) {
          console.log('✅ Registration updated with Razorpay order ID');
          finalRegistrationId = order.id;
        } else {
          console.error('⚠️ Failed to update registration with Razorpay order ID, but continuing...');
        }
      } catch (updateError) {
        console.error('⚠️ Error updating registration with Razorpay order ID:', updateError);
        // Continue with original registration ID
      }
    }

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
      razorpayKeyId: keyId,
      registrationId: finalRegistrationId, // Return the updated registration ID
      customerDetails: {
        email: customerEmail,
        name: customerName || 'Conference Participant'
      }
    });
    
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);

    // Log the full error object for debugging
    if (error && typeof error === 'object') {
      console.error('❌ Error properties:', Object.keys(error));
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
    }

    // Handle specific Razorpay errors
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);

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
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: typeof error,
        errorConstructor: error?.constructor?.name
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
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Missing',
      environment: process.env.RAZORPAY_KEY_ID?.includes('test') ? 'TEST' : 'LIVE'
    }
  });
}
