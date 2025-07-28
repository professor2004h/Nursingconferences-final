// PayPal SDK Types
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (selector: string | HTMLElement) => Promise<void>;
      };
    };
  }
}

interface PayPalButtonsConfig {
  createOrder: (data: any, actions: PayPalActions) => Promise<string>;
  onApprove: (data: PayPalApprovalData, actions: PayPalActions) => Promise<void>;
  onCancel?: (data: any) => void;
  onError?: (err: any) => void;
  style?: {
    layout?: 'vertical' | 'horizontal';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    shape?: 'rect' | 'pill';
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment';
    height?: number;
  };
}

interface PayPalActions {
  order: {
    create: (orderData: PayPalOrderData) => Promise<string>;
    capture: () => Promise<PayPalCaptureResult>;
  };
}

interface PayPalOrderData {
  purchase_units: Array<{
    amount: {
      value: string;
    };
    description?: string;
    custom_id?: string;
    invoice_id?: string;
  }>;
}

interface PayPalApprovalData {
  orderID: string;
  payerID: string;
}

interface PayPalCaptureResult {
  id: string;
  status: string;
  payer: {
    payer_id: string;
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
  }>;
}

export {};
