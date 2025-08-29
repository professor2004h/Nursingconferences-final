# 🏢 Organization Field Migration Guide

## 🎯 Overview

This guide explains how to add the new "Organization" field to existing Abstract Submission records in Sanity CMS. All existing records will be updated with the default value "ABC" for the organization field.

## 📋 What's Been Added

### **Frontend Changes:**
- ✅ New "Organization" input field in AbstractSubmissionForm
- ✅ Field positioned after "Country" field
- ✅ Required field validation
- ✅ Proper placeholder text: "Enter your organization/institution name"
- ✅ Form state management updated

### **Backend Schema Changes:**
- ✅ Updated `abstractSubmission.ts` schema with organization field
- ✅ Field is required with validation (min: 2, max: 200 characters)
- ✅ Proper field description and title

### **API Route Updates:**
- ✅ Updated `abstract-submit/route.ts` to handle organization field
- ✅ Added organization validation in API
- ✅ Organization field included in document creation

### **Display Updates:**
- ✅ AbstractTableView updated with Organization column
- ✅ Organization field added to CSV export
- ✅ Query updated to fetch organization field
- ✅ Default "ABC" value for existing records without organization

## 🔄 Migration Process

### **Option 1: Using Sanity Vision Tool (Recommended)**

1. **Open Sanity Studio**: http://localhost:3333
2. **Go to Vision Tool**: Click "Vision" in the left sidebar
3. **Check Current Data**: Run this query to see records without organization:
   ```groq
   *[_type == "abstractSubmission" && !defined(organization)] {
     _id,
     firstName,
     lastName,
     email,
     "needsUpdate": true
   }
   ```

4. **Run Migration**: Switch to "Mutations" tab and run:
   ```json
   [
     ...(*[_type == "abstractSubmission" && !defined(organization)] | {
       "patch": {
         "id": _id,
         "set": {
           "organization": "ABC"
         }
       }
     }.patch)
   ]
   ```

5. **Verify Results**: Switch back to "Query" tab and run:
   ```groq
   *[_type == "abstractSubmission"] {
     _id,
     firstName,
     lastName,
     email,
     organization,
     "hasOrganization": defined(organization)
   }
   ```

### **Option 2: Using Migration Script**

1. **Navigate to Sanity Backend**:
   ```bash
   cd SanityBackend
   ```

2. **Run Migration Script**:
   ```bash
   sanity exec migrations/add-organization-field.js --with-user-token
   ```

3. **Verify Results**: Check Sanity Studio to confirm all records have organization field

### **Option 3: Manual Update (For Small Datasets)**

1. **Open Abstract Submissions**: http://localhost:3333/structure/abstractSubmissionSystem;abstractSubmissionsTable
2. **Edit Each Record**: Click on individual submissions
3. **Add Organization**: Set organization field to "ABC" for each record
4. **Save Changes**: Publish each updated record

## 🧪 Testing Instructions

### **Test New Submissions:**

1. **Go to Abstract Submission Form**: http://localhost:3000/submit-abstract
2. **Fill Out Form**: Include all fields including the new Organization field
3. **Submit Form**: Verify submission works correctly
4. **Check Sanity Studio**: Confirm organization field appears in table
5. **Verify Data**: Ensure organization value is stored correctly

### **Test Existing Records:**

1. **Open Abstract Table**: http://localhost:3333/structure/abstractSubmissionSystem;abstractSubmissionsTable
2. **Check Organization Column**: Should show "ABC" for migrated records
3. **Test CSV Export**: Verify organization field appears in exported data
4. **Edit Record**: Confirm organization field can be updated

### **Test Form Validation:**

1. **Try Empty Organization**: Leave organization field blank and submit
2. **Verify Error**: Should show validation error
3. **Test Min Length**: Try entering single character
4. **Test Max Length**: Try entering very long organization name

## 📊 Expected Results

### **Before Migration:**
- ❌ Organization field missing from existing records
- ❌ Form doesn't include organization input
- ❌ Table doesn't show organization column

### **After Migration:**
- ✅ All existing records have organization = "ABC"
- ✅ New submissions include organization field
- ✅ Table displays organization column
- ✅ CSV export includes organization data
- ✅ Form validation works for organization field

## 🔍 Verification Queries

### **Check Migration Status:**
```groq
{
  "totalSubmissions": count(*[_type == "abstractSubmission"]),
  "withOrganization": count(*[_type == "abstractSubmission" && defined(organization)]),
  "withoutOrganization": count(*[_type == "abstractSubmission" && !defined(organization)]),
  "defaultABC": count(*[_type == "abstractSubmission" && organization == "ABC"])
}
```

### **Sample Records:**
```groq
*[_type == "abstractSubmission"] | order(_createdAt desc) [0...5] {
  _id,
  firstName,
  lastName,
  email,
  organization,
  _createdAt
}
```

## 🚨 Troubleshooting

### **If Migration Fails:**
1. **Check Permissions**: Ensure you have write access to Sanity
2. **Verify Token**: Make sure authentication token is valid
3. **Check Network**: Ensure connection to Sanity is stable
4. **Manual Fallback**: Use manual update method

### **If Form Validation Issues:**
1. **Clear Browser Cache**: Refresh the form page
2. **Check Console**: Look for JavaScript errors
3. **Verify API**: Test API endpoint directly
4. **Check Schema**: Ensure schema changes are deployed

### **If Table Display Issues:**
1. **Refresh Sanity Studio**: Hard refresh the browser
2. **Check Query**: Verify organization field is in query
3. **Clear Cache**: Clear Sanity Studio cache
4. **Restart Studio**: Restart Sanity development server

## 📁 Files Modified

### **Frontend:**
- `nextjs-frontend/src/app/submit-abstract/AbstractSubmissionForm.tsx`
- `nextjs-frontend/src/app/api/abstract-submit/route.ts`

### **Backend:**
- `SanityBackend/schemaTypes/abstractSubmission.ts`
- `SanityBackend/components/AbstractTableView.jsx`

### **Migration Files:**
- `SanityBackend/migrations/add-organization-field.js`
- `SanityBackend/migrations/organization-field-vision-query.groq`

## ✅ Migration Checklist

- [ ] Run migration query/script
- [ ] Verify all existing records have organization = "ABC"
- [ ] Test new form submission with organization field
- [ ] Check organization column appears in Sanity table
- [ ] Verify CSV export includes organization
- [ ] Test form validation for organization field
- [ ] Confirm organization field is required
- [ ] Test editing existing records

## 🎉 Success Criteria

✅ **All existing abstract submissions have organization field set to "ABC"**
✅ **New submissions require and store organization field**
✅ **Organization column visible in Sanity Studio table**
✅ **CSV export includes organization data**
✅ **Form validation works correctly for organization field**

---

**The Organization field has been successfully added to the Abstract Submission system!** 🏢✨
