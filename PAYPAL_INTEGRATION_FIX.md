# PayPal Integration Troubleshooting Guide

## Issue Analysis
The error "PayPal configuration error. Please contact support." indicates missing or incorrectly configured PayPal environment variables.

## Root Causes Identified

### 1. Missing Environment Variables in Local Development
The `.env.local` file is missing PayPal configuration variables.

### 2. Environment Variable Access Issues
Client-side components cannot access server-side environment variables without the `NEXT_PUBLIC_` prefix.

### 3. Production Environment Configuration
Coolify environment variables may not be properly configured or accessible.

### 4. Missing Error Logging
Insufficient error logging makes debugging difficult.

## Solutions

### Step 1: Add PayPal Environment Variables to Local Development

Add these variables to `nextjs-frontend/.env.local`:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# For production, change to:
# PAYPAL_ENVIRONMENT=production
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Step 2: Verify Coolify Environment Variables

Ensure these variables are set in Coolify:
- `PAYPAL_CLIENT_ID` (Server-side)
- `PAYPAL_CLIENT_SECRET` (Server-side) 
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (Client-side)
- `PAYPAL_ENVIRONMENT` (sandbox or production)
- `NEXT_PUBLIC_BASE_URL` (Your production domain)

### Step 3: Enhanced Error Logging and Validation

### Step 4: Environment Variable Validation

### Step 5: PayPal SDK Loading Improvements

### Step 6: Testing Steps

#### Local Testing:
1. Add environment variables to `.env.local`
2. Restart Next.js development server
3. Test PayPal payment flow
4. Check browser console for errors

#### Production Testing:
1. Verify Coolify environment variables
2. Deploy application
3. Test payment flow
4. Check application logs

### Step 7: Debugging Commands

```bash
# Check environment variables in production
echo $PAYPAL_CLIENT_ID
echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID

# Test PayPal API connectivity
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

## Common Issues and Solutions

### Issue 1: "PayPal configuration error"
**Cause**: Missing `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
**Solution**: Add the variable with `NEXT_PUBLIC_` prefix

### Issue 2: PayPal SDK fails to load
**Cause**: Network issues or incorrect client ID
**Solution**: Check network connectivity and verify client ID

### Issue 3: Order creation fails
**Cause**: Missing server-side credentials
**Solution**: Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`

### Issue 4: Capture fails
**Cause**: Invalid order ID or expired token
**Solution**: Check order ID validity and token expiration

## Security Best Practices

1. **Never expose client secret**: Only use `PAYPAL_CLIENT_SECRET` on server-side
2. **Use environment-specific credentials**: Different credentials for sandbox/production
3. **Validate webhook signatures**: Implement webhook signature validation
4. **Log security events**: Monitor for suspicious payment activities

## Monitoring and Alerts

1. **Payment Success Rate**: Monitor successful vs failed payments
2. **Error Tracking**: Track PayPal API errors
3. **Performance Monitoring**: Monitor payment processing times
4. **Security Monitoring**: Alert on unusual payment patterns

## Implementation Steps

### Step 1: Update Environment Variables

#### For Local Development (.env.local):
```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### For Production (Coolify):
```env
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_client_secret
PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Step 2: Test the Integration

Run the test script:
```bash
cd nextjs-frontend
node test-paypal-integration.js
```

### Step 3: Validate Configuration

Visit the validation endpoint:
```
GET /api/paypal/validate-config
POST /api/paypal/validate-config (for API connectivity test)
```

### Step 4: Monitor and Debug

Check application logs for:
- PayPal configuration status
- API connectivity issues
- Order creation/capture errors

## Troubleshooting Commands

### Check Environment Variables:
```bash
# In your application environment
echo $PAYPAL_CLIENT_ID
echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID
echo $PAYPAL_ENVIRONMENT
```

### Test PayPal API Directly:
```bash
# Get access token
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### Test Configuration Endpoint:
```bash
curl http://localhost:3000/api/paypal/validate-config
```

## Files Modified

1. **nextjs-frontend/src/app/utils/paypalConfig.ts** - New configuration utility
2. **nextjs-frontend/src/app/api/paypal/create-order/route.ts** - Enhanced error handling
3. **nextjs-frontend/src/app/api/paypal/capture-order/route.ts** - Enhanced error handling
4. **nextjs-frontend/src/app/components/PayPalPayment.tsx** - Better error messages
5. **nextjs-frontend/.env.local** - Added PayPal environment variables
6. **nextjs-frontend/src/app/api/paypal/validate-config/route.ts** - New validation endpoint
7. **nextjs-frontend/test-paypal-integration.js** - Testing script

## Next Steps

1. ✅ Add PayPal credentials to environment variables
2. ✅ Run the test script to validate configuration
3. ✅ Test payment flow in sandbox environment
4. ✅ Deploy to production with production credentials
5. ✅ Monitor payment success rates and error logs
6. ✅ Set up alerts for payment failures
