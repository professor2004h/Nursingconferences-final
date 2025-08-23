// =============================================================================
// PAYMENT TYPES
// =============================================================================

export interface PaymentData {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider: PaymentProvider;
  transactionId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 
  | 'paypal'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'other';

export type PaymentProvider = 
  | 'paypal'
  | 'stripe'
  | 'square'
  | 'other';

// PayPal specific types
export interface PayPalOrderData {
  id: string;
  status: string;
  intent: string;
  purchase_units: PayPalPurchaseUnit[];
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalPurchaseUnit {
  reference_id: string;
  amount: {
    currency_code: string;
    value: string;
  };
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalCaptureData {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  final_capture: boolean;
  create_time: string;
  update_time: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version: string;
  resource: any;
  summary: string;
}

// Payment configuration
export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'live';
  webhookId?: string;
  currency: string;
  locale: string;
}

export interface PaymentConfig {
  paypal: PayPalConfig;
  defaultCurrency: string;
  supportedCurrencies: string[];
  minimumAmount: number;
  maximumAmount: number;
}

// Payment processing types
export interface CreatePaymentOrderRequest {
  registrationId: string;
  amount: number;
  currency: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  orderId?: string;
  approvalUrl?: string;
  error?: string;
  message?: string;
}

export interface CapturePaymentRequest {
  orderId: string;
  registrationId: string;
}

export interface CapturePaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  error?: string;
  message?: string;
}

// Payment validation
export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Refund types
export interface RefundRequest {
  paymentId: string;
  amount?: number; // If not provided, full refund
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  error?: string;
  message?: string;
}

// Payment analytics
export interface PaymentAnalytics {
  totalTransactions: number;
  totalAmount: number;
  currency: string;
  successRate: number;
  averageAmount: number;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
  statusBreakdown: Record<PaymentStatus, number>;
}
