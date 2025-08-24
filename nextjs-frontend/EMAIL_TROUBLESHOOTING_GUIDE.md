# Email System Troubleshooting Guide

## 🔍 Current Issue Status
**BOTH passwords tested - BOTH failing with same error:**
```
535 5.7.8 Error: authentication failed: (reason unavailable)
```

## 🧪 Test Results Summary
✅ **SMTP Server Connection**: Working (smtp.hostinger.com:465 and :587)  
❌ **Primary Password** (`Muni@12345m`): Authentication failed  
❌ **App-Specific Password** (`movvod-qerkog-5foJhe`): Authentication failed  

## 🔍 Root Cause Analysis
Since both passwords fail with identical errors, the issue is likely:

### 1. **Email Account Doesn't Exist**
- The account `accounts@intelliglobalconferences.com` may not be created in Hostinger
- Check Hostinger control panel → Email section

### 2. **SMTP Not Enabled**
- Email account exists but SMTP access is disabled
- Need to enable SMTP/IMAP in email settings

### 3. **Domain Configuration Issue**
- Domain `intelliglobalconferences.com` may not be properly configured for email
- DNS MX records might be missing or incorrect

### 4. **Account Restrictions**
- Email account may be suspended or have restrictions
- Security policies preventing SMTP access

## 🛠️ Immediate Solutions

### Option 1: Create/Verify Hostinger Email Account
**Steps to take in Hostinger Control Panel:**

1. **Login to Hostinger**
   - Go to https://hpanel.hostinger.com
   - Login with your account credentials

2. **Check Email Section**
   - Navigate to "Email" section
   - Look for domain: `intelliglobalconferences.com`

3. **Verify Email Account**
   - Check if `accounts@intelliglobalconferences.com` exists
   - If not, create the email account

4. **Enable SMTP Access**
   - Go to email account settings
   - Ensure SMTP/IMAP is enabled
   - Check for any security restrictions

5. **Test Email Account**
   - Try logging into webmail with both passwords
   - Verify the account is active and accessible

### Option 2: Use Gmail SMTP (Temporary Solution)
**For immediate testing while fixing Hostinger:**

1. **Create Gmail App Password**
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate App Password for "Mail"

2. **Update Configuration**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-gmail@gmail.com
   EMAIL_FROM_NAME=Intelli Global Conferences
   ```

### Option 3: Use Professional Email Service
**For production reliability:**
- **SendGrid**: Professional transactional email
- **Mailgun**: Developer-friendly email API
- **Amazon SES**: AWS Simple Email Service

## 🔧 Diagnostic Commands

### Test Email Account Existence
```bash
# Test if email account can receive emails
# Send a test email to accounts@intelliglobalconferences.com from another account
```

### Test SMTP Connection
```bash
cd nextjs-frontend
node test_2fa_passwords.js
```

### Test Email System with Working SMTP
```bash
# After configuring working SMTP credentials
node -e "
fetch('http://localhost:3001/api/email/debug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ testEmail: 'professor2004h@gmail.com' })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
"
```

## 📞 Support Contacts

### Hostinger Support
- **Website**: https://www.hostinger.com/contact
- **Live Chat**: Available 24/7 in control panel
- **Email**: support@hostinger.com

### Questions for Hostinger Support
1. "Does the email account `accounts@intelliglobalconferences.com` exist?"
2. "Is SMTP enabled for this email account?"
3. "What are the correct SMTP settings for this domain?"
4. "Are there any security restrictions preventing SMTP access?"
5. "Can you help me test the email account login?"

## 🚀 Quick Fix Implementation

### Step 1: Verify Account in Hostinger
1. Login to Hostinger control panel
2. Go to Email section
3. Check if `accounts@intelliglobalconferences.com` exists
4. If not, create it with password: `Muni@12345m`
5. Enable SMTP access

### Step 2: Test Again
```bash
node test_2fa_passwords.js
```

### Step 3: Configure Working Settings
Once working, update `.env.local`:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465  # or 587
SMTP_SECURE=true  # or false for 587
SMTP_USER=accounts@intelliglobalconferences.com
SMTP_PASS=working-password
EMAIL_FROM=accounts@intelliglobalconferences.com
EMAIL_FROM_NAME=Intelli Global Conferences
```

### Step 4: Test Email System
```bash
# Test the complete email system
node -e "
fetch('http://localhost:3001/api/email/test-working', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ testEmail: 'professor2004h@gmail.com' })
})
.then(res => res.json())
.then(data => console.log('Email test result:', JSON.stringify(data, null, 2)))
"
```

## 📋 Current Email System Status

### ✅ Implemented Features
- **Professional Email Templates**: Complete HTML email with all details
- **PayPal Integration**: Automatic email sending after payment
- **Error Handling**: Graceful failures that don't break payments
- **Testing Infrastructure**: Multiple test endpoints
- **Production Ready**: Just needs working SMTP credentials

### 🔧 Needs Configuration
- **Working SMTP Credentials**: Either Hostinger or alternative service
- **Email Account Verification**: Confirm account exists and is accessible
- **SMTP Access**: Ensure SMTP is enabled for the account

## 🎯 Next Steps Priority
1. **HIGH**: Verify email account exists in Hostinger control panel
2. **HIGH**: Enable SMTP access for the account
3. **MEDIUM**: Test with working credentials
4. **LOW**: Consider alternative email service if Hostinger issues persist

The email system is fully implemented and ready - it just needs working SMTP credentials to function.
