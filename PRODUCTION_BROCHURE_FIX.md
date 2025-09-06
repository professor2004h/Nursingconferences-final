# 🔧 Production Brochure Download Fix

## 🚨 **Issue Identified**
The brochure download is working on localhost but failing on production due to:
1. **Wrong Project ID**: Coolify config has `zt8218vh` instead of `zt8218vh`
2. **Missing API Token**: Production environment lacks `SANITY_API_TOKEN`

## ✅ **Solution: Update Coolify Environment Variables**

### **Step 1: Access Coolify Dashboard**
1. Log into your Coolify instance
2. Navigate to your Event Website project
3. Go to **Environment Variables** section

### **Step 2: Update/Add These Variables**

#### **Critical Updates:**
```env
# Fix Project ID (CHANGE THIS)
NEXT_PUBLIC_SANITY_PROJECT_ID=zt8218vh

# Add Missing API Token (ADD THIS)
SANITY_API_TOKEN=skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V
```

#### **Complete Environment Variables List:**
```env
# Core Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Sanity Configuration (CORRECTED)
NEXT_PUBLIC_SANITY_PROJECT_ID=zt8218vh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V

# PayPal Configuration (existing)
PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
PAYPAL_CLIENT_SECRET=EMzGihvUsifDMxblEl3j9CGXLbOACaFsC8ykdBwMv3gK8f_a5S7NulJ9sSqe4atrt2d_2bCo7TBZ6x01
PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
```

### **Step 3: Redeploy Application**
1. After updating environment variables
2. **Trigger a new deployment** in Coolify
3. Wait for build to complete
4. Check deployment logs for success

### **Step 4: Verify Fix**
Test these endpoints after deployment:

1. **Brochure Setup**: `https://www.nursingeducationconferences.org/api/brochure/setup`
   - Should return: `{"success":true,"settings":{...}}`

2. **Brochure Form**: `https://www.nursingeducationconferences.org/brochure`
   - Fill out form and submit
   - Should download PDF successfully

## 🔍 **Troubleshooting**

### **If Still Not Working:**

1. **Check Deployment Logs**:
   ```
   Look for: "✅ SANITY_API_TOKEN is configured"
   Avoid: "❌ SANITY_API_TOKEN is not set"
   ```

2. **Test API Directly**:
   ```bash
   curl https://www.nursingeducationconferences.org/api/brochure/setup
   ```

3. **Verify Environment Variables**:
   - Ensure no trailing spaces
   - Confirm exact project ID: `zt8218vh`
   - Verify API token is complete

### **Success Indicators:**
- ✅ Brochure form submits without errors
- ✅ PDF download link appears
- ✅ PDF file downloads successfully
- ✅ No "Failed to process" error messages

## 📋 **Quick Checklist**
- [ ] Updated `NEXT_PUBLIC_SANITY_PROJECT_ID` to `zt8218vh`
- [ ] Added `SANITY_API_TOKEN` environment variable
- [ ] Triggered new deployment in Coolify
- [ ] Tested brochure download on production site
- [ ] Verified API endpoints are responding correctly

## 🎯 **Expected Result**
After these changes, the brochure download at `https://www.nursingeducationconferences.org/brochure` should work exactly like it does on localhost.
