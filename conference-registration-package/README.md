# Conference Registration Package

A complete, standalone conference registration system with PayPal payment integration. This package provides everything you need to set up a professional conference registration website with secure payment processing.

## 🚀 Features

- **Complete Registration System**: Multi-step registration form with validation
- **PayPal Integration**: Official PayPal SDK with production-ready configuration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety and excellent developer experience
- **Modular Architecture**: Easy to customize and extend
- **Production Ready**: Includes error handling, security, and performance optimizations

## 📋 Requirements

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- PayPal Business Account (for payment processing)
- Database (PostgreSQL, MySQL, or MongoDB)
- SMTP Email Service (for confirmation emails)

## 🛠️ Quick Setup

### 1. Installation

```bash
# Clone or extract the package
cd conference-registration-package

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

### 3. Required Configuration

Update `.env.local` with your actual values:

```env
# Application Settings
NEXT_PUBLIC_APP_NAME="Your Conference Name"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_CONTACT_EMAIL="contact@your-domain.com"

# PayPal Configuration (PRODUCTION)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="live"
PAYPAL_WEBHOOK_ID="your_paypal_webhook_id"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/conference_db"

# Email Service
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM="noreply@your-domain.com"

# Security
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret"

# Conference Details
NEXT_PUBLIC_CONFERENCE_NAME="Your Conference 2025"
NEXT_PUBLIC_CONFERENCE_DATE="2025-06-15"
NEXT_PUBLIC_CONFERENCE_LOCATION="Your City, Country"
NEXT_PUBLIC_EARLY_BIRD_DEADLINE="2025-04-15"
NEXT_PUBLIC_REGULAR_DEADLINE="2025-05-30"

# Pricing (in USD)
NEXT_PUBLIC_EARLY_BIRD_PRICE="299"
NEXT_PUBLIC_REGULAR_PRICE="399"
NEXT_PUBLIC_STUDENT_DISCOUNT="50"
```

### 4. Database Setup

Implement your database connection in:
- `src/lib/config/database.ts`
- `src/pages/api/registration/create.ts`
- `src/pages/api/registration/update.ts`
- `src/lib/services/registrationService.ts`

### 5. Email Service Setup

Configure your email service in:
- `src/lib/services/emailService.ts`
- Update SMTP settings in environment variables

### 6. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000/registration
```

### 7. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 PayPal Configuration

### 1. Create PayPal Application

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/developer/applications/)
2. Create a new application
3. Select "Live" environment for production
4. Copy Client ID and Client Secret

### 2. Configure Webhooks

1. In PayPal Developer Dashboard, go to your application
2. Add webhook endpoint: `https://your-domain.com/api/paypal/webhook`
3. Select these events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.PENDING`
   - `CHECKOUT.ORDER.APPROVED`
4. Copy Webhook ID

### 3. Test PayPal Integration

```bash
# Check PayPal configuration
curl http://localhost:3000/api/paypal/config

# Test health endpoint
curl http://localhost:3000/api/health
```

## 📁 Project Structure

```
conference-registration-package/
├── src/
│   ├── components/          # React components
│   │   ├── registration/    # Registration form components
│   │   ├── paypal/         # PayPal integration components
│   │   ├── ui/             # Reusable UI components
│   │   └── layout/         # Layout components
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   └── registration/   # Registration pages
│   ├── lib/                # Utilities and services
│   │   ├── config/         # Configuration files
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── styles/             # CSS and styling
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🎨 Customization

### Styling

- Edit `tailwind.config.js` for theme customization
- Modify `src/styles/globals.css` for global styles
- Update `src/styles/components.css` for component styles

### Form Fields

- Modify `src/lib/types/registration.ts` for data structure
- Update `src/components/registration/RegistrationForm.tsx` for form fields
- Adjust `src/lib/utils/validation.ts` for validation rules

### Pricing

- Update environment variables for pricing
- Modify `src/lib/config/environment.ts` for pricing logic
- Customize `src/lib/services/registrationService.ts` for complex pricing

### Email Templates

- Implement email templates in `src/lib/services/emailService.ts`
- Configure SMTP settings in environment variables

## 🔒 Security

- All sensitive data uses environment variables
- PayPal webhook signature verification included
- Input validation and sanitization
- CSRF protection with Next.js
- Secure headers configuration

## 📊 Monitoring

### Health Check

```bash
curl https://your-domain.com/api/health
```

### API Endpoints

- `GET /api/health` - System health check
- `POST /api/registration/create` - Create registration
- `PATCH /api/registration/update` - Update registration
- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment
- `POST /api/paypal/webhook` - PayPal webhook handler

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

- **Netlify**: Configure build command and environment variables
- **Railway**: Connect repository and set environment variables
- **DigitalOcean**: Use App Platform with environment variables
- **AWS**: Deploy with Amplify or EC2 with environment configuration

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation in the `docs/` folder
2. Review the configuration examples
3. Test with the health check endpoint
4. Contact: [your-support-email@domain.com]

## 🔄 Updates

To update the package:

1. Backup your `.env.local` file
2. Replace package files (keeping your customizations)
3. Run `npm install` for new dependencies
4. Update environment variables if needed
5. Test thoroughly before deploying

---

**Ready to launch your conference registration system!** 🎉
