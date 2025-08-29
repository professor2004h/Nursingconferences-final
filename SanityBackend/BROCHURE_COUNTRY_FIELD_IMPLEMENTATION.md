# 🌍 Brochure Country Field Implementation Guide

## 🎯 Overview

This guide documents the implementation of the required "Country" field for the Brochure Download system. The country field has been added to the form, made required, and existing records will be migrated with the default value "India".

## 📋 What's Been Implemented

### **✅ Frontend Changes (http://localhost:3000/brochure):**
1. **New Country Select Field** - Added after Organization field
2. **Required Field Validation** - Form won't submit without country selection
3. **Country Dropdown** - Uses comprehensive country list with proper options
4. **Form State Management** - Updated to handle country field
5. **Form Submission** - Country included in submission data

### **✅ Backend Schema Changes (Already Existed):**
1. **brochureDownload.ts Schema** - Already had country field with validation
2. **Required Field** - Schema already marked country as required
3. **Country Options** - Comprehensive list of countries in schema
4. **Sanity Studio Interface** - Field already appears in document editing

### **✅ API Route Updates:**
1. **Updated brochure/submit/route.ts** - Now validates country field as required
2. **Validation Logic** - Checks for country field presence
3. **Document Creation** - Stores country data in Sanity
4. **Error Handling** - Proper error messages for missing country

### **✅ Data Migration for Existing Records:**
1. **Migration Script** - `add-country-to-brochure-downloads.js` for automated migration
2. **Vision Query** - Manual migration option via Sanity Vision tool
3. **Default Value "India"** - All existing records get country = "India"
4. **Backward Compatibility** - Existing data displays properly

### **✅ Display Updates (Already Working):**
1. **BrochureTableView** - Already had Country column
2. **Table Query** - Already fetches country field from Sanity
3. **CSV Export** - Already includes country field in exports
4. **Default Display** - Now shows "India" for records without country

## 🔧 **Key Changes Made**

### **1. Frontend Form Enhancement**

**File**: `nextjs-frontend/src/app/brochure/BrochureDownloadForm.tsx`

#### **Added Country Select Field**:
```tsx
{/* Country */}
<div>
  <select
    id="country"
    name="country"
    value={formData.country}
    onChange={handleInputChange}
    className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors bg-white ${
      errors.country ? 'border-red-500' : 'border-gray-300'
    }`}
    disabled={isSubmitting}
  >
    <option value="">Select Country*</option>
    {COUNTRY_OPTIONS.map((country) => (
      <option key={country.value} value={country.value}>
        {country.label}
      </option>
    ))}
  </select>
  {errors.country && (
    <p className="mt-1 text-xs text-red-600">{errors.country}</p>
  )}
</div>
```

### **2. Form Validation Enhancement**

**File**: `nextjs-frontend/src/app/types/brochure.ts`

#### **Before**:
```typescript
// Note: Country is now optional for the simplified form
```

#### **After**:
```typescript
// Validate country (now required)
if (!data.country || data.country.trim().length === 0) {
  errors.country = 'Country is required';
}
```

### **3. API Route Enhancement**

**File**: `nextjs-frontend/src/app/api/brochure/submit/route.ts`

#### **Before**:
```typescript
const { fullName, email, phone, organization } = formData;
if (!fullName || !email || !phone || !organization) {
  return NextResponse.json(
    { error: 'Missing required fields. Full name, email, phone number, and organization are required.' },
    { status: 400, headers: corsHeaders }
  );
}
```

#### **After**:
```typescript
const { fullName, email, phone, organization, country } = formData;
if (!fullName || !email || !phone || !organization || !country) {
  return NextResponse.json(
    { error: 'Missing required fields. Full name, email, phone number, organization, and country are required.' },
    { status: 400, headers: corsHeaders }
  );
}
```

### **4. Display Enhancement**

**File**: `SanityBackend/utils/countryMapping.ts`

#### **Before**:
```typescript
if (!value) return 'Unknown';
```

#### **After**:
```typescript
if (!value) return 'India'; // Default to India for missing countries
```

## 🔄 **Migration Process**

### **Option 1: Using Sanity Vision Tool (Recommended)**

1. **Open Sanity Studio**: http://localhost:3333
2. **Go to Vision Tool**: Click "Vision" in the left sidebar
3. **Check Current Data**: Run this query to see records without country:
   ```groq
   *[_type == "brochureDownload" && !defined(country)] {
     _id,
     fullName,
     email,
     organization,
     downloadTimestamp,
     "needsUpdate": true
   }
   ```

4. **Run Migration**: Switch to "Mutations" tab and run:
   ```json
   [
     ...(*[_type == "brochureDownload" && !defined(country)] | {
       "patch": {
         "id": _id,
         "set": {
           "country": "India"
         }
       }
     }.patch)
   ]
   ```

5. **Verify Results**: Switch back to "Query" tab and run:
   ```groq
   *[_type == "brochureDownload"] {
     _id,
     fullName,
     email,
     organization,
     country,
     downloadTimestamp,
     "hasCountry": defined(country)
   }
   ```

### **Option 2: Using Migration Script**

1. **Navigate to Sanity Backend**:
   ```bash
   cd SanityBackend
   ```

2. **Run Migration Script**:
   ```bash
   sanity exec migrations/add-country-to-brochure-downloads.js --with-user-token
   ```

3. **Verify Results**: Check Sanity Studio to confirm all records have country field

## 🧪 **Testing Instructions**

### **Test New Brochure Downloads:**

1. **Go to Brochure Page**: http://localhost:3000/brochure
2. **Fill Out Form**: Include all fields including the new Country field
3. **Try Without Country**: Verify validation error appears
4. **Submit Form**: Verify submission works correctly with country
5. **Check Sanity Studio**: Confirm country field appears in table
6. **Verify Data**: Ensure country value is stored correctly

### **Test Existing Records:**

1. **Open Brochure Table**: http://localhost:3333/structure/brochureDownloadSystem;brochureDownloadsTable
2. **Check Country Column**: Should show "India" for migrated records
3. **Test CSV Export**: Verify country field appears in exported data
4. **Edit Record**: Confirm country field can be updated

### **Test Form Validation:**

1. **Try Empty Country**: Leave country field unselected and submit
2. **Verify Error**: Should show "Country is required" validation error
3. **Select Country**: Choose a country and verify form submits successfully

## 📊 **Expected Results**

### **Before Implementation:**
- ❌ Country field missing from brochure form
- ❌ Form submits without country selection
- ❌ Existing records show "Unknown" for missing countries

### **After Implementation:**
- ✅ Country field visible and required in brochure form
- ✅ Form validation prevents submission without country
- ✅ All existing records show "India" for missing countries
- ✅ New submissions include country field
- ✅ Table displays country column correctly
- ✅ CSV export includes country data

## 🔍 **Verification Queries**

### **Check Migration Status:**
```groq
{
  "totalBrochureDownloads": count(*[_type == "brochureDownload"]),
  "withCountry": count(*[_type == "brochureDownload" && defined(country)]),
  "withoutCountry": count(*[_type == "brochureDownload" && !defined(country)]),
  "defaultIndia": count(*[_type == "brochureDownload" && country == "India"])
}
```

### **Sample Records:**
```groq
*[_type == "brochureDownload"] | order(downloadTimestamp desc) [0...5] {
  _id,
  fullName,
  email,
  organization,
  country,
  downloadTimestamp
}
```

## 📁 **Files Modified**

### **Frontend:**
- `nextjs-frontend/src/app/brochure/BrochureDownloadForm.tsx` ← **ENHANCED**
- `nextjs-frontend/src/app/types/brochure.ts` ← **UPDATED**
- `nextjs-frontend/src/app/api/brochure/submit/route.ts` ← **UPDATED**

### **Backend:**
- `SanityBackend/utils/countryMapping.ts` ← **UPDATED**
- `SanityBackend/schemaTypes/brochureDownload.ts` ← **ALREADY HAD COUNTRY FIELD**
- `SanityBackend/components/BrochureTableView.js` ← **ALREADY WORKING**

### **Migration Files:**
- `SanityBackend/migrations/add-country-to-brochure-downloads.js` ← **NEW**
- `SanityBackend/migrations/brochure-country-field-vision-query.groq` ← **NEW**

## ✅ **Implementation Checklist**

- [x] Add country field to brochure form
- [x] Make country field required with validation
- [x] Update API route to validate country field
- [x] Create migration script for existing records
- [x] Update display logic to show "India" for missing countries
- [x] Test form submission with country field
- [x] Verify existing records display correctly
- [x] Test form validation for required country field

## 🎉 **Success Criteria**

✅ **Country field is visible and required in brochure form**
✅ **Form validation prevents submission without country selection**
✅ **All existing brochure downloads show "India" for missing countries**
✅ **New submissions require and store country field**
✅ **Country column visible in Sanity Studio table**
✅ **CSV export includes country data**

---

**The Country field has been successfully implemented for the Brochure Download system!** 🌍✨
