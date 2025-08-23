# Configuration Guide

This guide covers all configuration options for the Conference Registration Package.

## Environment Variables

### Application Settings

```env
# Basic application configuration
NEXT_PUBLIC_APP_NAME="Your Conference Name"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_CONTACT_EMAIL="contact@your-domain.com"
```

**NEXT_PUBLIC_APP_NAME**
- The name of your conference
- Displayed in page titles and PayPal transactions
- Example: "Global Tech Conference 2025"

**NEXT_PUBLIC_APP_URL**
- Your website's full URL
- Used for PayPal return/cancel URLs
- Must be accessible from the internet for webhooks

**NEXT_PUBLIC_CONTACT_EMAIL**
- Support email address
- Displayed on error pages and help sections

### PayPal Configuration

```env
# PayPal settings for payment processing
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_CLIENT_SECRET="your_client_secret"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="live"
PAYPAL_WEBHOOK_ID="your_webhook_id"
```

**NEXT_PUBLIC_PAYPAL_CLIENT_ID**
- Public client ID from PayPal Developer Dashboard
- Safe to expose to client-side code
- Different for sandbox vs live

**PAYPAL_CLIENT_SECRET**
- Secret key from PayPal Developer Dashboard
- Keep secure, never expose to client-side
- Used for server-side API calls

**NEXT_PUBLIC_PAYPAL_ENVIRONMENT**
- `"sandbox"` for testing
- `"live"` for production
- Determines which PayPal API endpoints to use

**PAYPAL_WEBHOOK_ID**
- Webhook ID from PayPal Developer Dashboard
- Used for webhook signature verification
- Optional but recommended for security

### Database Configuration

```env
# Database connection
DATABASE_URL="postgresql://user:pass@host:port/db"
```

**Supported Formats:**
- PostgreSQL: `postgresql://user:pass@host:port/database`
- MySQL: `mysql://user:pass@host:port/database`
- MongoDB: `mongodb://user:pass@host:port/database`
- SQLite: `file:./database.db`

### Email Configuration

```env
# SMTP settings for sending emails
SMTP_HOST="smtp.provider.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@your-domain.com"
```

**Common SMTP Providers:**

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your_sendgrid_api_key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your_mailgun_username"
SMTP_PASSWORD="your_mailgun_password"
```

**Gmail:**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your_app_password"
```

### Security Settings

```env
# Security keys for encryption and sessions
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret"
```

**JWT_SECRET**
- Used for signing JSON Web Tokens
- Minimum 32 characters
- Use a cryptographically secure random string

**SESSION_SECRET**
- Used for session encryption
- Minimum 32 characters
- Different from JWT_SECRET

**Generate Secure Secrets:**
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Conference Settings

```env
# Conference details
NEXT_PUBLIC_CONFERENCE_NAME="Your Conference 2025"
NEXT_PUBLIC_CONFERENCE_DATE="2025-06-15"
NEXT_PUBLIC_CONFERENCE_LOCATION="Your City, Country"
NEXT_PUBLIC_EARLY_BIRD_DEADLINE="2025-04-15"
NEXT_PUBLIC_REGULAR_DEADLINE="2025-05-30"
```

**Date Formats:**
- Use ISO 8601 format: `YYYY-MM-DD`
- Dates are compared against current date for pricing

### Pricing Configuration

```env
# Pricing in USD (no currency symbols)
NEXT_PUBLIC_EARLY_BIRD_PRICE="299"
NEXT_PUBLIC_REGULAR_PRICE="399"
NEXT_PUBLIC_STUDENT_DISCOUNT="50"
```

**Pricing Logic:**
- Early bird price applies before early bird deadline
- Regular price applies after early bird deadline
- Student discount is subtracted from regular price
- Speaker registration is always free (hardcoded)

### Optional Integrations

```env
# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"

# Google Maps for venue location
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"

# Development settings
NODE_ENV="production"
DEBUG_MODE="false"
```

## Configuration Files

### Tailwind Configuration

Edit `tailwind.config.js` to customize the design:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Customize brand colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... other shades
        },
      },
      fontFamily: {
        // Customize fonts
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Next.js Configuration

Edit `next.config.js` for advanced settings:

```javascript
const nextConfig = {
  // Add your domain to images config
  images: {
    domains: ['your-domain.com'],
  },
  
  // Custom redirects
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/registration',
        permanent: true,
      },
    ];
  },
};
```

### PayPal Configuration

Edit `src/lib/config/paypal.ts` for PayPal-specific settings:

```typescript
export const paypalButtonStyle = {
  layout: 'vertical',
  color: 'blue',      // blue, gold, silver, white, black
  shape: 'rect',      // rect, pill
  label: 'paypal',    // paypal, checkout, buynow, pay
  height: 45,         // 25-55
  tagline: false,
};
```

## Form Configuration

### Registration Fields

Edit `src/lib/types/registration.ts` to modify form fields:

```typescript
export interface RegistrationFormData {
  // Add or remove fields as needed
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // ... other fields
  
  // Add custom fields
  customField?: string;
}
```

### Validation Rules

Edit `src/lib/utils/validation.ts` to customize validation:

```typescript
export const registrationSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 characters'),
  email: z.string().email('Valid email required'),
  // Customize validation rules
});
```

### Form Steps

Edit `src/lib/utils/constants.ts` to modify registration steps:

```typescript
export const REGISTRATION_STEPS = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Basic personal details',
  },
  // Add or modify steps
];
```

## Styling Configuration

### Global Styles

Edit `src/styles/globals.css` for global styling:

```css
:root {
  /* Customize CSS variables */
  --primary-color: #2563eb;
  --secondary-color: #64748b;
}

body {
  /* Customize body styles */
  font-family: 'Inter', sans-serif;
}
```

### Component Styles

Edit `src/styles/components.css` for component-specific styles:

```css
.registration-form {
  /* Customize form appearance */
  max-width: 800px;
  margin: 0 auto;
}

.paypal-container {
  /* Customize PayPal button container */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Advanced Configuration

### Custom Pricing Logic

Edit `src/lib/services/registrationService.ts` for complex pricing:

```typescript
private calculateRegistrationAmount(registrationType: string, userData: any): number {
  // Implement custom pricing logic
  let basePrice = env.PRICING.REGULAR;
  
  // Example: Group discounts
  if (userData.groupSize > 5) {
    basePrice *= 0.9; // 10% group discount
  }
  
  // Example: Member discounts
  if (userData.isMember) {
    basePrice *= 0.85; // 15% member discount
  }
  
  return basePrice;
}
```

### Custom Email Templates

Edit `src/lib/services/emailService.ts` for email customization:

```typescript
const emailTemplates = {
  confirmation: {
    subject: 'Registration Confirmation - {{conferenceName}}',
    html: `
      <h1>Welcome to {{conferenceName}}!</h1>
      <p>Dear {{name}},</p>
      <p>Your registration is confirmed.</p>
      <!-- Custom template content -->
    `,
  },
};
```

### Database Schema Customization

Add custom fields to your database schema:

```sql
-- Add custom columns to registrations table
ALTER TABLE registrations 
ADD COLUMN company_size VARCHAR(50),
ADD COLUMN industry VARCHAR(100),
ADD COLUMN referral_source VARCHAR(100);
```

## Environment-Specific Configuration

### Development

```env
NODE_ENV="development"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="sandbox"
DEBUG_MODE="true"
```

### Staging

```env
NODE_ENV="production"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="sandbox"
DEBUG_MODE="false"
```

### Production

```env
NODE_ENV="production"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="live"
DEBUG_MODE="false"
```

## Configuration Validation

The system automatically validates configuration on startup. Check the health endpoint for configuration status:

```bash
curl https://your-domain.com/api/health
```

Response includes configuration validation:

```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "paypal": "connected",
    "email": "connected"
  },
  "development": {
    "envValidation": {
      "isValid": true,
      "missingVars": []
    },
    "paypalValidation": {
      "isValid": true,
      "errors": []
    }
  }
}
```

## Troubleshooting Configuration

### Common Issues

1. **PayPal not working**: Check client ID and environment match
2. **Database errors**: Verify connection string format
3. **Email not sending**: Test SMTP credentials
4. **Styling issues**: Check Tailwind CSS build process

### Debug Mode

Enable debug mode for detailed logging:

```env
DEBUG_MODE="true"
```

This provides additional console output for troubleshooting.

---

**Your configuration is now complete!** 🎉
