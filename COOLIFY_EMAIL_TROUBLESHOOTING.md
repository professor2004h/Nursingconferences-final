# 🐳 Coolify Email System Troubleshooting Guide

## 🚨 **IMMEDIATE DIAGNOSTIC STEPS**

### **Step 1: Run Diagnostic Script**
```bash
# SSH into your Coolify container
cd /app
node debug-production-email-coolify.js
```

This script will automatically:
- ✅ Check all environment variables
- ✅ Test DNS resolution
- ✅ Verify network connectivity
- ✅ Test SMTP connections with multiple configurations
- ✅ Send test email
- ✅ Provide specific recommendations

### **Step 2: Check Coolify Application Logs**
```bash
# In Coolify dashboard, check application logs for:
grep "SMTP" /var/log/application.log
grep "payment receipt email" /var/log/application.log
grep "Email delivery metrics" /var/log/application.log
```

## 🔧 **COMMON COOLIFY EMAIL ISSUES & SOLUTIONS**

### **Issue 1: Environment Variables Not Set**

**Symptoms:**
```
❌ Missing environment variables: SMTP_PASS
```

**Solution:**
1. Go to Coolify application settings
2. Navigate to "Environment Variables" section
3. Add missing variables:
   ```
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=contactus@intelliglobalconferences.com
   SMTP_PASS=Muni@12345m
   FROM_EMAIL=contactus@intelliglobalconferences.com
   NODE_ENV=production
   ```
4. **Redeploy the application** after adding variables

### **Issue 2: SMTP Ports Blocked by Firewall**

**Symptoms:**
```
❌ SMTP verification failed: connect ECONNREFUSED
❌ Testing smtp.hostinger.com:465 - BLOCKED
```

**Solution:**
1. **Contact Coolify Support** to open SMTP ports (465, 587)
2. **Alternative:** Use port 587 with STARTTLS:
   ```
   SMTP_PORT=587
   SMTP_SECURE=false
   ```
3. **Test connectivity:**
   ```bash
   # In container terminal:
   telnet smtp.hostinger.com 465
   telnet smtp.hostinger.com 587
   ```

### **Issue 3: DNS Resolution Failures**

**Symptoms:**
```
❌ DNS Resolution failed: getaddrinfo ENOTFOUND smtp.hostinger.com
```

**Solution:**
1. **Check container internet connectivity:**
   ```bash
   ping 8.8.8.8
   nslookup smtp.hostinger.com
   ```
2. **Contact Coolify support** if DNS is not working
3. **Alternative:** Use IP address instead of hostname

### **Issue 4: TLS/SSL Certificate Issues**

**Symptoms:**
```
❌ SMTP verification failed: certificate verify failed
❌ unable to verify the first certificate
```

**Solution:**
The enhanced configuration automatically handles this with:
```javascript
tls: {
  rejectUnauthorized: false,
  servername: 'smtp.hostinger.com',
  ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
}
```

### **Issue 5: Container Resource Limitations**

**Symptoms:**
```
❌ SMTP verification failed: timeout
⏱️ Timeout Issue - Check network connectivity
```

**Solution:**
Enhanced configuration includes:
```javascript
connectionTimeout: 60000,  // 60 seconds
greetingTimeout: 30000,    // 30 seconds
socketTimeout: 60000,      // 60 seconds
pool: false,               // Disable pooling
maxConnections: 1          // Single connection
```

## 🔍 **STEP-BY-STEP DEBUGGING PROCESS**

### **1. Verify Environment Variables**
```bash
# In Coolify container terminal:
echo "SMTP_HOST: $SMTP_HOST"
echo "SMTP_PORT: $SMTP_PORT"
echo "SMTP_USER: $SMTP_USER"
echo "SMTP_PASS: ${SMTP_PASS:+SET}"  # Shows SET if password exists
echo "NODE_ENV: $NODE_ENV"
```

### **2. Test Network Connectivity**
```bash
# Test DNS resolution
nslookup smtp.hostinger.com

# Test port connectivity
telnet smtp.hostinger.com 465
telnet smtp.hostinger.com 587

# Test internet connectivity
ping 8.8.8.8
curl -I https://google.com
```

### **3. Check Application Logs**
```bash
# Real-time log monitoring
tail -f /var/log/application.log | grep -i smtp

# Search for specific patterns
grep "SMTP.*verif" /var/log/application.log
grep "payment receipt email" /var/log/application.log
grep "Email delivery metrics" /var/log/application.log
```

### **4. Test Email Manually**
```bash
# Run diagnostic script
node debug-production-email-coolify.js

# Check for successful output:
# ✅ SMTP connection verified successfully
# ✅ Test email sent successfully!
```

## 🛠️ **COOLIFY-SPECIFIC CONFIGURATIONS**

### **Recommended SMTP Configuration for Coolify:**
```javascript
const smtpConfig = {
  host: 'smtp.hostinger.com',
  port: 587,                    // Use 587 if 465 is blocked
  secure: false,                // Use STARTTLS instead of SSL
  auth: {
    user: 'contactus@intelliglobalconferences.com',
    pass: 'Muni@12345m',
  },
  tls: {
    rejectUnauthorized: false,
    servername: 'smtp.hostinger.com',
    ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  pool: false,                  // Important for containers
  maxConnections: 1             // Single connection
};
```

### **Environment Variables for Coolify:**
```bash
# Primary configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=Muni@12345m

# Application settings
NODE_ENV=production
FROM_EMAIL=contactus@intelliglobalconferences.com
FROM_NAME="Intelli Global Conferences"
```

## 📞 **ESCALATION PROCEDURES**

### **If All Troubleshooting Fails:**

1. **Gather Diagnostic Information:**
   ```bash
   # Run full diagnostic
   node debug-production-email-coolify.js > email-diagnostic.log 2>&1
   
   # Collect system information
   uname -a > system-info.log
   cat /etc/os-release >> system-info.log
   ```

2. **Contact Coolify Support with:**
   - Diagnostic log output
   - System information
   - Specific error messages
   - Steps already attempted

3. **Alternative Email Providers:**
   - **Gmail SMTP:** smtp.gmail.com:587
   - **SendGrid:** smtp.sendgrid.net:587
   - **Mailgun:** smtp.mailgun.org:587

## 🎯 **SUCCESS INDICATORS**

**✅ Email system is working when you see:**
```
🔍 Verifying SMTP connection...
✅ SMTP connection verified successfully
📧 Initiating REAL payment receipt email for registration: [ID]
✅ REAL payment receipt email sent successfully for: [ID]
📊 Email delivery metrics: {...}
```

**❌ Email system needs attention when you see:**
```
❌ SMTP verification failed: [error]
❌ Failed to send REAL payment receipt email: [error]
🔧 SMTP Configuration Issue - Check environment variables
```

## 🔄 **MONITORING & MAINTENANCE**

### **Set Up Monitoring:**
```bash
# Create monitoring script
echo '#!/bin/bash
grep "SMTP.*verif" /var/log/application.log | tail -10
grep "Email delivery metrics" /var/log/application.log | tail -5
' > /app/monitor-email.sh

chmod +x /app/monitor-email.sh
```

### **Regular Health Checks:**
- Run diagnostic script weekly
- Monitor email delivery success rates
- Check for new error patterns in logs
- Verify environment variables after deployments

---

## 🚀 **QUICK FIX CHECKLIST**

**Before contacting support, verify:**
- [ ] All environment variables are set in Coolify
- [ ] Application has been redeployed after adding variables
- [ ] Diagnostic script has been run
- [ ] Network connectivity is working
- [ ] SMTP ports are accessible
- [ ] Application logs have been checked

**Most common fix:** Redeploy application after setting environment variables!
