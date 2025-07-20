# Conference Registration System - Complete Implementation Prompt

## Overview
Build a comprehensive conference registration system with dynamic pricing, sponsorship tiers, accommodation booking, and Sanity CMS backend management. The system should replicate the functionality of https://cognitionconferences.com/nephrology/registration/ with enhanced backend controls.

## Core Requirements

### 1. Frontend Registration Form
Create a multi-section registration form with the following components:

#### Personal Details Section
- Title dropdown: Mr, Ms, Mrs, Prof, Dr
- First Name (required)
- Last Name (required)
- Email (required, validation)
- Phone Number (required, international format)

#### Further Information Section
- Country dropdown (all 195+ countries)
- Abstract Category: Poster, Oral, Delegate, Other
- Full Postal Address (textarea)

#### Registration Type Selection (Dynamic Pricing)
Create three time-based pricing blocks that activate/deactivate based on dates:

**Early Bird Registration** (Before Feb 28th, 2025)
- Speaker Registration: Academia ($799), Business ($899)
- Delegate: Academia ($699), Business ($799)
- Student: $599
- Poster Presentation: $499
- Online: $200
- Accompanying Person: $250

**Next Round Registration** (March 1 - May 31st, 2025)
- Speaker Registration: Academia ($899), Business ($999)
- Delegate: Academia ($799), Business ($899)
- Student: $699
- Poster Presentation: $599
- Online: $300
- Accompanying Person: $300

**Spot Registration** (June 1st onwards, 2025)
- Speaker Registration: Academia ($999), Business ($1099)
- Delegate: Academia ($899), Business ($999)
- Student: $799
- Poster Presentation: $699
- Online: $500
- Accompanying Person: $350

#### Sponsorship Registration (Exclusive Selection)
When sponsorship is selected, disable other registration types:
- Platinum Sponsor: $7500
- Gold Sponsor: $6000
- Silver Sponsor: $5000
- Exhibitor: $3000

#### Accommodation Registration
- Single Occupancy: 2 nights ($500), 3 nights ($750), 5 nights ($900)
- Double Occupancy: 2 nights ($700), 3 nights ($850), 5 nights ($1000)
- Triple Occupancy: 2 nights ($800), 3 nights ($950), 5 nights ($1100)

#### Participant Quantity
- Dropdown: 1-10 participants
- Dynamic price calculation based on quantity

#### Payment Summary
Real-time calculation showing:
- Registration Price: ${{fees}}
- No. Of Participants: {{qty}}
- Total Registration Price: ${{fees * qty}}
- Accommodation Price: ${{afees}}
- **Total Price: ${{(fees * qty) + afees}}**

#### Payment Integration
- Razorpay test integration
- Payment method selection UI
- Secure payment processing
- Payment confirmation handling

### 2. Sanity CMS Backend Structure

#### Schema: Conference Settings
```javascript
{
  name: 'conferenceSettings',
  title: 'Conference Settings',
  type: 'document',
  fields: [
    {
      name: 'conferenceName',
      title: 'Conference Name',
      type: 'string'
    },
    {
      name: 'earlyBirdEndDate',
      title: 'Early Bird End Date',
      type: 'datetime'
    },
    {
      name: 'nextRoundEndDate',
      title: 'Next Round End Date',
      type: 'datetime'
    },
    {
      name: 'conferenceDate',
      title: 'Conference Date',
      type: 'datetime'
    }
  ]
}
```

#### Schema: Registration Pricing
```javascript
{
  name: 'registrationPricing',
  title: 'Registration Pricing',
  type: 'document',
  fields: [
    {
      name: 'pricingTier',
      title: 'Pricing Tier',
      type: 'string',
      options: {
        list: ['earlyBird', 'nextRound', 'spotRegistration']
      }
    },
    {
      name: 'registrationType',
      title: 'Registration Type',
      type: 'string'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string'
    },
    {
      name: 'price',
      title: 'Price (USD)',
      type: 'number'
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean'
    }
  ]
}
```

#### Schema: Sponsorship Benefits
```javascript
{
  name: 'sponsorshipBenefits',
  title: 'Sponsorship Benefits',
  type: 'document',
  fields: [
    {
      name: 'sponsorshipType',
      title: 'Sponsorship Type',
      type: 'string',
      options: {
        list: ['platinum', 'gold', 'silver', 'exhibitor']
      }
    },
    {
      name: 'price',
      title: 'Price (USD)',
      type: 'number'
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'includedRegistrations',
      title: 'Included Registrations',
      type: 'number'
    }
  ]
}
```

#### Schema: Registration Records
```javascript
{
  name: 'registrationRecord',
  title: 'Registration Records',
  type: 'document',
  fields: [
    {
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string'
    },
    {
      name: 'personalDetails',
      title: 'Personal Details',
      type: 'object',
      fields: [
        {name: 'title', type: 'string'},
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'country', type: 'string'},
        {name: 'abstractCategory', type: 'string'},
        {name: 'address', type: 'text'}
      ]
    },
    {
      name: 'registrationDetails',
      title: 'Registration Details',
      type: 'object',
      fields: [
        {name: 'registrationType', type: 'string'},
        {name: 'pricingTier', type: 'string'},
        {name: 'numberOfParticipants', type: 'number'},
        {name: 'accommodationType', type: 'string'},
        {name: 'accommodationNights', type: 'number'}
      ]
    },
    {
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        {name: 'registrationPrice', type: 'number'},
        {name: 'accommodationPrice', type: 'number'},
        {name: 'totalPrice', type: 'number'},
        {name: 'paymentStatus', type: 'string'},
        {name: 'paymentId', type: 'string'},
        {name: 'paymentDate', type: 'datetime'}
      ]
    },
    {
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime'
    }
  ]
}
```

### 3. Technical Implementation Requirements

#### Frontend (Next.js/React)
- Responsive design matching the reference site
- Real-time form validation
- Dynamic pricing calculation
- Date-based pricing tier activation
- Sponsorship selection logic (exclusive selection)
- Razorpay payment integration
- Form state management
- Error handling and user feedback

#### Backend Integration
- Sanity client configuration
- API routes for form submission
- Payment webhook handling
- Data validation and sanitization
- Email confirmation system

#### Key Functionalities to Implement

1. **Dynamic Pricing Logic**
   - Check current date against pricing tier dates
   - Automatically activate/deactivate pricing blocks
   - Real-time price calculation based on selections

2. **Sponsorship Selection Logic**
   - When sponsorship is selected, disable other registration types
   - Show sponsorship benefits from Sanity
   - Calculate total based on sponsorship tier

3. **Payment Processing**
   - Razorpay test mode integration
   - Payment success/failure handling
   - Automatic registration record creation
   - Email confirmation sending

4. **Admin Dashboard Features**
   - Registration records table view in Sanity
   - Export functionality for registration data
   - Payment status tracking
   - Pricing management interface
   - Date configuration controls

### 4. Sanity Studio Configuration

Create custom views for:
- Registration dashboard with filters
- Payment status overview
- Pricing management interface
- Conference settings panel

### 5. Additional Features

- Email templates for confirmation
- PDF receipt generation
- Registration analytics
- Bulk registration handling
- Refund management system

## Implementation Notes

1. Use environment variables for Razorpay keys
2. Implement proper error boundaries
3. Add loading states for all async operations
4. Ensure mobile responsiveness
5. Add form auto-save functionality
6. Implement proper SEO meta tags
7. Add Google Analytics tracking
8. Ensure GDPR compliance for data handling

## File Structure
```
/pages
  /api
    /registration
    /payment
/components
  /RegistrationForm
  /PaymentSection
  /PricingTiers
/lib
  /sanity
  /razorpay
/schemas
  /conference
  /registration
  /sponsorship
```

This system should be production-ready with proper error handling, validation, and security measures in place.

## Detailed Implementation Steps

### Step 1: Environment Setup
```bash
npx create-next-app@latest conference-registration
cd conference-registration
npm install @sanity/client @sanity/image-url razorpay react-hook-form @hookform/resolvers yup
npm install -D @sanity/cli
```

### Step 2: Sanity Configuration
```javascript
// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Conference Registration',
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

### Step 3: Form Validation Schema
```javascript
// lib/validationSchema.js
import * as yup from 'yup'

export const registrationSchema = yup.object({
  title: yup.string().required('Title is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required'),
  abstractCategory: yup.string().required('Abstract category is required'),
  address: yup.string().required('Address is required'),
  registrationType: yup.string().required('Registration type is required'),
  numberOfParticipants: yup.number().min(1).max(10).required(),
})
```

### Step 4: Razorpay Integration
```javascript
// lib/razorpay.js
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createOrder = async (amount, currency = 'USD') => {
  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  }

  return await razorpay.orders.create(options)
}
```

### Step 5: Dynamic Pricing Logic
```javascript
// lib/pricingLogic.js
export const getCurrentPricingTier = () => {
  const now = new Date()
  const earlyBirdEnd = new Date('2025-02-28')
  const nextRoundEnd = new Date('2025-05-31')

  if (now <= earlyBirdEnd) return 'earlyBird'
  if (now <= nextRoundEnd) return 'nextRound'
  return 'spotRegistration'
}

export const calculateTotalPrice = (registrationPrice, accommodationPrice, participants) => {
  return (registrationPrice * participants) + accommodationPrice
}
```

### Step 6: Registration Form Component Structure
```jsx
// components/RegistrationForm.jsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationSchema } from '../lib/validationSchema'

const RegistrationForm = () => {
  const [pricingTier, setPricingTier] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [isSponsorship, setIsSponsorship] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registrationSchema)
  })

  // Dynamic pricing calculation logic
  // Form sections: Personal Details, Further Information, Registration Type, Payment

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form implementation */}
    </form>
  )
}
```

### Step 7: Sanity Studio Custom Dashboard
```javascript
// sanity/desk/registrationDashboard.js
export const registrationDashboard = (S) =>
  S.listItem()
    .title('Registration Dashboard')
    .child(
      S.list()
        .title('Registration Management')
        .items([
          S.listItem()
            .title('All Registrations')
            .child(S.documentTypeList('registrationRecord')),
          S.listItem()
            .title('Pending Payments')
            .child(
              S.documentTypeList('registrationRecord')
                .filter('paymentDetails.paymentStatus == "pending"')
            ),
          S.listItem()
            .title('Completed Registrations')
            .child(
              S.documentTypeList('registrationRecord')
                .filter('paymentDetails.paymentStatus == "completed"')
            ),
        ])
    )
```

### Step 8: API Routes
```javascript
// pages/api/registration/submit.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Validate form data
    // Create Razorpay order
    // Save to Sanity
    // Send confirmation email

    res.status(200).json({ success: true, orderId: order.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### Step 9: Payment Webhook
```javascript
// pages/api/payment/webhook.js
import crypto from 'crypto'

export default async function handler(req, res) {
  const signature = req.headers['x-razorpay-signature']
  const body = JSON.stringify(req.body)

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (signature === expectedSignature) {
    // Update registration status in Sanity
    // Send confirmation email
    res.status(200).json({ status: 'ok' })
  } else {
    res.status(400).json({ error: 'Invalid signature' })
  }
}
```

### Step 10: Email Templates
Create email templates for:
- Registration confirmation
- Payment confirmation
- Registration details with QR code
- Admin notifications

## Testing Checklist
- [ ] Form validation works correctly
- [ ] Dynamic pricing updates based on selections
- [ ] Sponsorship selection disables other options
- [ ] Payment integration works in test mode
- [ ] Registration data saves to Sanity correctly
- [ ] Email confirmations are sent
- [ ] Admin dashboard displays data properly
- [ ] Mobile responsiveness
- [ ] Error handling for failed payments
- [ ] Date-based pricing tier activation

## Security Considerations
- Input sanitization and validation
- CSRF protection
- Rate limiting on API endpoints
- Secure webhook signature verification
- Environment variable protection
- SQL injection prevention (though using Sanity)
- XSS protection

## Performance Optimizations
- Image optimization for payment logos
- Form field lazy loading
- API response caching where appropriate
- Bundle size optimization
- Database query optimization
