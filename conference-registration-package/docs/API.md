# API Documentation

This document describes all API endpoints available in the Conference Registration Package.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most endpoints are public for registration purposes. Future versions may include authentication for admin endpoints.

## Endpoints

### Health Check

Check system health and configuration status.

**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "paypal": "connected",
    "email": "connected"
  },
  "uptime": 3600
}
```

**Status Codes:**
- `200` - System healthy
- `503` - System unhealthy

---

### Registration Management

#### Create Registration

Create a new conference registration.

**POST** `/api/registration/create`

**Request Body:**
```json
{
  "title": "Dr.",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "country": "US",
  "organization": "Tech Corp",
  "jobTitle": "Software Engineer",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "registrationType": "early-bird",
  "attendanceType": "in-person",
  "dietaryRequirements": "Vegetarian",
  "accessibilityNeeds": "None",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "Spouse"
  },
  "marketingConsent": true,
  "newsletterSubscription": true,
  "specialRequests": "Ground floor room"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "registrationNumber": "REG-123456-ABCD",
    "status": "pending",
    "paymentStatus": "pending",
    "totalAmount": 299.00,
    "currency": "USD",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Registration created successfully",
  "emailSent": true
}
```

**Status Codes:**
- `201` - Registration created successfully
- `400` - Validation error
- `500` - Server error

#### Update Registration

Update an existing registration.

**PATCH** `/api/registration/update?registrationId={id}`

**Request Body:**
```json
{
  "updates": {
    "paymentStatus": "completed",
    "paymentId": "PAYPAL_TRANSACTION_ID",
    "paymentMethod": "paypal",
    "paymentDate": "2024-01-15T10:35:00.000Z",
    "status": "confirmed",
    "confirmedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "registrationNumber": "REG-123456-ABCD",
    "status": "confirmed",
    "paymentStatus": "completed",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "message": "Registration updated successfully"
}
```

#### Get Registration

Retrieve registration details.

**GET** `/api/registration/update?registrationId={id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "registrationNumber": "REG-123456-ABCD",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "confirmed",
    "paymentStatus": "completed",
    "totalAmount": 299.00,
    "currency": "USD",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Registration found
- `404` - Registration not found
- `500` - Server error

---

### PayPal Integration

#### Create PayPal Order

Create a PayPal payment order.

**POST** `/api/paypal/create-order`

**Request Body:**
```json
{
  "amount": 299.00,
  "currency": "USD",
  "registrationId": "uuid-here",
  "registrationData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "PAYPAL_ORDER_ID",
  "status": "CREATED",
  "approvalUrl": "https://www.paypal.com/checkoutnow?token=ORDER_ID",
  "message": "PayPal order created successfully"
}
```

**Status Codes:**
- `200` - Order created successfully
- `400` - Invalid request data
- `500` - PayPal API error

#### Capture PayPal Order

Capture a PayPal payment after approval.

**POST** `/api/paypal/capture-order`

**Request Body:**
```json
{
  "orderId": "PAYPAL_ORDER_ID",
  "registrationId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "PAYPAL_PAYMENT_ID",
  "transactionId": "PAYPAL_TRANSACTION_ID",
  "amount": 299.00,
  "currency": "USD",
  "status": "COMPLETED",
  "captureTime": "2024-01-15T10:35:00.000Z",
  "message": "Payment captured successfully"
}
```

**Status Codes:**
- `200` - Payment captured successfully
- `400` - Invalid order or capture failed
- `500` - PayPal API error

#### PayPal Configuration

Get PayPal client configuration.

**GET** `/api/paypal/config`

**Response:**
```json
{
  "success": true,
  "config": {
    "clientId": "PAYPAL_CLIENT_ID",
    "environment": "live",
    "currency": "USD",
    "locale": "en_US"
  },
  "status": {
    "isConfigured": true,
    "isProductionReady": true,
    "environment": "live",
    "errors": [],
    "warnings": []
  }
}
```

#### PayPal Webhook

Handle PayPal webhook events.

**POST** `/api/paypal/webhook`

**Request Body:** (PayPal webhook payload)
```json
{
  "id": "WH-EVENT-ID",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "event_version": "1.0",
  "create_time": "2024-01-15T10:35:00.000Z",
  "resource_type": "capture",
  "resource": {
    "id": "CAPTURE_ID",
    "status": "COMPLETED",
    "amount": {
      "currency_code": "USD",
      "value": "299.00"
    },
    "custom_id": "registration-uuid"
  }
}
```

**Response:**
```json
{
  "success": true,
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "message": "Webhook processed successfully"
}
```

**Status Codes:**
- `200` - Webhook processed successfully
- `401` - Invalid webhook signature
- `500` - Processing error

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common Error Types

- `VALIDATION_ERROR` - Request data validation failed
- `NOT_FOUND` - Resource not found
- `PAYPAL_ERROR` - PayPal API error
- `DATABASE_ERROR` - Database operation failed
- `EMAIL_ERROR` - Email sending failed
- `INTERNAL_ERROR` - Unexpected server error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Webhook Security

### PayPal Webhook Verification

PayPal webhooks are verified using signature validation:

1. Extract headers: `paypal-transmission-id`, `paypal-cert-id`, `paypal-auth-algo`, `paypal-transmission-sig`, `paypal-transmission-time`
2. Verify signature using PayPal's verification API
3. Process webhook only if verification succeeds

### Webhook Events

The system handles these PayPal webhook events:

- `PAYMENT.CAPTURE.COMPLETED` - Payment successfully captured
- `PAYMENT.CAPTURE.DENIED` - Payment capture denied
- `PAYMENT.CAPTURE.PENDING` - Payment capture pending
- `PAYMENT.CAPTURE.REFUNDED` - Payment refunded
- `CHECKOUT.ORDER.APPROVED` - Order approved by payer
- `CHECKOUT.ORDER.COMPLETED` - Order completed

## Data Models

### Registration Data

```typescript
interface RegistrationData {
  id: string;
  registrationNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  jobTitle: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  registrationType: 'early-bird' | 'regular' | 'student' | 'speaker';
  attendanceType: 'in-person' | 'virtual' | 'hybrid';
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  marketingConsent: boolean;
  newsletterSubscription: boolean;
  specialRequests?: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentId?: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}
```

### Payment Data

```typescript
interface PaymentData {
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
```

## Testing

### Test Endpoints

Use these endpoints to test your integration:

```bash
# Health check
curl https://your-domain.com/api/health

# PayPal configuration
curl https://your-domain.com/api/paypal/config

# Create test registration
curl -X POST https://your-domain.com/api/registration/create \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com",...}'
```

### Webhook Testing

Test PayPal webhooks using PayPal's webhook simulator in the Developer Dashboard.

---

**API documentation complete!** 📚
