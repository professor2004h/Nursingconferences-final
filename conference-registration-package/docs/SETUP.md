# Setup Guide

This guide will walk you through setting up the Conference Registration Package step by step.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- A PayPal Business Account
- A database (PostgreSQL, MySQL, or MongoDB)
- An SMTP email service
- A domain name (for production)

## Step 1: Initial Setup

### 1.1 Extract and Install

```bash
# Navigate to the package directory
cd conference-registration-package

# Install dependencies
npm install
```

### 1.2 Environment Configuration

```bash
# Copy the environment template
cp .env.example .env.local
```

## Step 2: PayPal Configuration

### 2.1 Create PayPal Application

1. **Login to PayPal Developer Dashboard**
   - Go to https://developer.paypal.com/developer/applications/
   - Login with your PayPal Business Account

2. **Create New Application**
   - Click "Create App"
   - Choose "Default Application"
   - Select "Live" for production (or "Sandbox" for testing)
   - Note down the Client ID and Client Secret

3. **Configure Application Settings**
   - Set return URL: `https://your-domain.com/registration/success`
   - Set cancel URL: `https://your-domain.com/registration/cancel`
   - Enable required features (Payments, Webhooks)

### 2.2 Setup Webhooks

1. **Create Webhook**
   - In your PayPal app, go to "Webhooks"
   - Click "Add Webhook"
   - Webhook URL: `https://your-domain.com/api/paypal/webhook`

2. **Select Events**
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.PENDING`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `CHECKOUT.ORDER.APPROVED`
   - `CHECKOUT.ORDER.COMPLETED`

3. **Save Webhook ID**
   - Copy the Webhook ID for your environment configuration

## Step 3: Database Setup

### 3.1 Choose Your Database

**PostgreSQL (Recommended)**
```sql
-- Create database
CREATE DATABASE conference_registration;

-- Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(10),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  job_title VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  registration_type VARCHAR(50) NOT NULL,
  attendance_type VARCHAR(50) NOT NULL,
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  emergency_contact JSONB,
  marketing_consent BOOLEAN DEFAULT false,
  newsletter_subscription BOOLEAN DEFAULT false,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(100),
  payment_method VARCHAR(50),
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  payment_date TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
```

**MongoDB**
```javascript
// Create collection with schema validation
db.createCollection("registrations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "registrationNumber", "firstName", "lastName", "email", "phone", "country", "organization", "jobTitle", "address", "city", "state", "zipCode", "registrationType", "attendanceType", "totalAmount", "currency"],
      properties: {
        id: { bsonType: "string" },
        registrationNumber: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        // ... add other fields
      }
    }
  }
});

// Create indexes
db.registrations.createIndex({ "email": 1 });
db.registrations.createIndex({ "status": 1 });
db.registrations.createIndex({ "paymentStatus": 1 });
```

### 3.2 Database Connection

Update the database connection in:
- `src/lib/config/database.ts`
- `src/lib/services/registrationService.ts`
- API routes in `src/pages/api/registration/`

## Step 4: Email Service Setup

### 4.1 Choose Email Provider

**Recommended Providers:**
- **SendGrid**: Easy setup, reliable delivery
- **Mailgun**: Developer-friendly, good pricing
- **Amazon SES**: Cost-effective, AWS integration
- **SMTP**: Use any SMTP provider

### 4.2 Configure Email Service

**SendGrid Example:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your_sendgrid_api_key"
SMTP_FROM="noreply@your-domain.com"
```

**Gmail SMTP Example:**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your_app_password"
SMTP_FROM="your-email@gmail.com"
```

### 4.3 Implement Email Service

Update `src/lib/services/emailService.ts` with your email provider's API or SMTP configuration.

## Step 5: Environment Variables

### 5.1 Complete .env.local

```env
# =============================================================================
# PRODUCTION CONFIGURATION
# =============================================================================

# Application Settings
NEXT_PUBLIC_APP_NAME="Your Conference Name 2025"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_CONTACT_EMAIL="contact@your-domain.com"

# PayPal Configuration (PRODUCTION)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AYour_PayPal_Client_ID_Here"
PAYPAL_CLIENT_SECRET="EYour_PayPal_Client_Secret_Here"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="live"
PAYPAL_WEBHOOK_ID="WH-Your_Webhook_ID_Here"

# Database Configuration
DATABASE_URL="postgresql://username:password@your-db-host:5432/conference_db"

# Email Configuration
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-email@your-domain.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM="noreply@your-domain.com"

# Security Settings
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
SESSION_SECRET="your-session-secret-minimum-32-characters"

# Conference Settings
NEXT_PUBLIC_CONFERENCE_NAME="Your Conference 2025"
NEXT_PUBLIC_CONFERENCE_DATE="2025-06-15"
NEXT_PUBLIC_CONFERENCE_LOCATION="Your City, Country"
NEXT_PUBLIC_EARLY_BIRD_DEADLINE="2025-04-15"
NEXT_PUBLIC_REGULAR_DEADLINE="2025-05-30"

# Pricing (in USD)
NEXT_PUBLIC_EARLY_BIRD_PRICE="299"
NEXT_PUBLIC_REGULAR_PRICE="399"
NEXT_PUBLIC_STUDENT_DISCOUNT="50"

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"

# Optional: Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 5.2 Security Notes

- **Never commit .env.local to version control**
- **Use strong, unique secrets for JWT and session**
- **Use environment-specific PayPal credentials**
- **Rotate secrets regularly**

## Step 6: Testing

### 6.1 Development Testing

```bash
# Start development server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Test PayPal configuration
curl http://localhost:3000/api/paypal/config
```

### 6.2 PayPal Testing

1. **Use Sandbox First**
   - Set `NEXT_PUBLIC_PAYPAL_ENVIRONMENT="sandbox"`
   - Use sandbox credentials for testing
   - Test complete registration flow

2. **Production Testing**
   - Switch to live credentials
   - Test with small amounts first
   - Verify webhook delivery

### 6.3 Email Testing

```bash
# Test email configuration
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host',
  port: 587,
  auth: { user: 'your-user', pass: 'your-pass' }
});
transporter.verify().then(console.log).catch(console.error);
"
```

## Step 7: Deployment

### 7.1 Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

### 7.2 Deploy to Platform

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist folder to Netlify
```

**Railway:**
```bash
# Connect GitHub repository
# Set environment variables in dashboard
```

### 7.3 Post-Deployment

1. **Verify all endpoints work**
2. **Test complete registration flow**
3. **Verify PayPal webhook delivery**
4. **Test email delivery**
5. **Monitor error logs**

## Step 8: Monitoring

### 8.1 Health Checks

Set up monitoring for:
- `GET /api/health` - Overall system health
- Database connectivity
- PayPal API connectivity
- Email service connectivity

### 8.2 Error Monitoring

Consider integrating:
- Sentry for error tracking
- LogRocket for user session recording
- Google Analytics for usage tracking

## Troubleshooting

### Common Issues

1. **PayPal Errors**
   - Verify client ID and secret
   - Check environment (sandbox vs live)
   - Ensure webhook URL is accessible

2. **Database Errors**
   - Verify connection string
   - Check database permissions
   - Ensure tables exist

3. **Email Errors**
   - Test SMTP credentials
   - Check firewall settings
   - Verify sender domain

### Getting Help

1. Check the health endpoint: `/api/health`
2. Review browser console for client errors
3. Check server logs for API errors
4. Verify environment variables are set correctly

---

**Your conference registration system is now ready!** 🎉
