# 📥 Sanity Content Import Guide

## 🎯 **IMPORT CONTENT FROM EXPORT PACKAGE**

This guide will help you import content data from your Sanity export package while preserving all current credentials and configuration.

---

## 📋 **PREREQUISITES**

### ✅ **Current System Status**
- **Sanity Backend**: Running with project ID `zt8218vh`
- **Frontend**: Running on `http://localhost:3000`
- **Credentials**: All updated to new project
- **Configuration**: All files properly configured

### 📦 **Export Package Requirements**
- Export package location: `C:\Users\qwen\Documents\sanity-complete-export`
- Required files: `.tar.gz` dataset files
- Content: Documents, assets, and content records

---

## 🚀 **STEP-BY-STEP IMPORT PROCESS**

### **Step 1: Locate Export Package**
```powershell
# Navigate to the export package location
cd "C:\Users\qwen\Documents\sanity-complete-export"

# List contents to verify structure
Get-ChildItem -Recurse
```

### **Step 2: Find Dataset Files**
Look for these files in the export package:
- `dataset/production-dataset-complete.tar.gz` (with assets)
- `dataset/production-dataset-raw.tar.gz` (documents only)

### **Step 3: Import Dataset Content**
```powershell
# Navigate to your Sanity backend directory
cd "j:\Nursingconferences\SanityBackend"

# Import the complete dataset (recommended)
npx sanity dataset import "C:\Users\qwen\Documents\sanity-complete-export\dataset\production-dataset-complete.tar.gz" production

# OR import raw dataset if preferred
npx sanity dataset import "C:\Users\qwen\Documents\sanity-complete-export\dataset\production-dataset-raw.tar.gz" production
```

### **Step 4: Verify Import**
```powershell
# Test connection and count documents
node ../test-new-project-connection.js
```

---

## ⚠️ **IMPORTANT SAFEGUARDS**

### **🔒 Preserve Current Configuration**
- **DO NOT** copy configuration files from export package
- **DO NOT** modify `.env`, `.env.local` files
- **DO NOT** change `sanity.config.ts` or `sanity.cli.ts`
- **KEEP** current project ID: `zt8218vh`
- **KEEP** current API token

### **📁 Only Import Content**
- ✅ Import: Documents, assets, content records
- ❌ Don't Import: Configuration, credentials, schema files

---

## 🔧 **MANUAL IMPORT COMMANDS**

If the export package is in a different location, adjust the path:

```powershell
# Example: Import from different location
npx sanity dataset import "path\to\your\export\production-dataset-complete.tar.gz" production

# Example: Import with specific options
npx sanity dataset import "path\to\export.tar.gz" production --replace

# Example: Import without replacing existing data
npx sanity dataset import "path\to\export.tar.gz" production --missing
```

---

## 🧪 **VERIFICATION STEPS**

### **1. Check Document Count**
```javascript
// Run this test
node test-new-project-connection.js
```

### **2. Verify Content in Studio**
- Open Sanity Studio (should be running)
- Check for imported content types
- Verify documents are visible

### **3. Test Frontend Integration**
- Visit `http://localhost:3000`
- Verify content displays correctly
- Test all functionality

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Issue: Export package not found**
```powershell
# Check if package exists
Test-Path "C:\Users\qwen\Documents\sanity-complete-export"

# List available files
Get-ChildItem "C:\Users\qwen\Documents" -Name "*export*"
```

#### **Issue: Import fails**
```powershell
# Check Sanity CLI version
npx sanity --version

# Verify project connection
npx sanity dataset list
```

#### **Issue: Schema mismatch**
- Ensure your current schema types match the exported content
- Check `SanityBackend/schemaTypes` directory
- Update schemas if needed before importing

---

## 📊 **EXPECTED RESULTS**

After successful import, you should see:
- **Increased document count** in your project
- **Content visible** in Sanity Studio
- **Data accessible** through frontend
- **All functionality working** with imported content

---

## 🎯 **ALTERNATIVE: Create Sample Data**

If the export package is not available, you can create sample data:

```powershell
# Create sample conference data
node create-sample-import-data.js

# Verify sample data
node test-new-project-connection.js
```

---

## ✅ **SUCCESS CHECKLIST**

- [ ] Export package located and verified
- [ ] Dataset import command executed successfully
- [ ] Document count increased in project
- [ ] Content visible in Sanity Studio
- [ ] Frontend displays imported content
- [ ] All credentials and configuration preserved
- [ ] No errors in import process
- [ ] All functionality working correctly

---

## 🚀 **NEXT STEPS AFTER IMPORT**

1. **Content Review**: Check all imported content in Studio
2. **Frontend Testing**: Verify all pages work with new content
3. **Schema Updates**: Adjust schemas if needed for imported content
4. **Asset Verification**: Ensure all images and files imported correctly
5. **Production Deployment**: Deploy with imported content

---

**📞 Need Help?**
If you encounter any issues during the import process, check the troubleshooting section or verify that your export package contains the required `.tar.gz` files in the correct structure.
