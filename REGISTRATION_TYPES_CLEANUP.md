# Registration Types Cleanup Guide

This document outlines the cleanup of registration types to display only the 8 approved categories in both the Sanity backend and Next.js frontend.

## 🎯 Objective

Clean up the registration system to display only these 8 approved registration types:

1. **Speaker/Poster (In-Person)** - `speaker-inperson`
2. **Speaker/Poster (Virtual)** - `speaker-virtual`
3. **Listener (In-Person)** - `listener-inperson`
4. **Listener (Virtual)** - `listener-virtual`
5. **Student (In-Person)** - `student-inperson`
6. **Student (Virtual)** - `student-virtual`
7. **E-poster (Virtual)** - `eposter-virtual`
8. **Exhibitor** - `exhibitor`

## 📝 Changes Made

### 1. Sanity Backend Schema Updates

**Files Updated:**
- `SanityBackend/schemaTypes/registrationTypes.ts`
- `nextjs-frontend/src/app/sanity/schemas/registrationTypes.ts`

**Changes:**
- Updated the `category` field options to include only the 8 approved categories
- Replaced old categories (`speaker`, `delegate`, `student`, `poster`, `online`, `accompanying`) with new specific categories

### 2. Frontend Code Updates

**Files Updated:**
- `nextjs-frontend/src/app/registration/page.tsx`
- `nextjs-frontend/src/app/api/registration/dynamic-config/route.ts`
- `nextjs-frontend/src/app/test-registration/page.tsx`

**Changes:**
- Removed hardcoded category filtering in the registration page
- Updated the dynamic config API to filter for the 8 approved categories
- Updated sort order to display registration types in the correct sequence
- Removed the `.slice(0, 6)` limitation to allow all 8 types to display
- Updated test page to use approved category names

### 3. Data Population Scripts

**Files Updated:**
- `nextjs-frontend/populate-registration-data.js`

**Changes:**
- Updated all registration type categories to use the new approved category values
- Ensured the populate script creates registration types with correct categories

### 4. New Utility Scripts

**Files Created:**
- `SanityBackend/update-registration-types.js` - Script to clean up existing registration types
- `verify-registration-types.js` - Script to verify the cleanup was successful

## 🚀 Implementation Steps

### Step 1: Update Sanity Backend

1. **Update the schema files** (already completed)
2. **Run the cleanup script:**
   ```bash
   cd SanityBackend
   # Update the script with your Sanity project ID and token
   node update-registration-types.js
   ```

### Step 2: Update Frontend

1. **The frontend code has been updated** to:
   - Remove hardcoded category filtering
   - Use the new approved categories
   - Display all 8 registration types dynamically from Sanity

### Step 3: Verify the Changes

1. **Run the verification script:**
   ```bash
   # Update the script with your Sanity project ID and token
   node verify-registration-types.js
   ```

2. **Test the registration page:**
   - Navigate to `/registration`
   - Verify that exactly 8 registration types are displayed
   - Confirm all data is coming from Sanity CMS

## 🔧 Configuration Required

Before running the scripts, update the following files with your Sanity credentials:

1. **`SanityBackend/update-registration-types.js`:**
   ```javascript
   const client = createClient({
     projectId: 'your-actual-project-id',
     dataset: 'production',
     token: 'your-actual-token',
     // ...
   });
   ```

2. **`verify-registration-types.js`:**
   ```javascript
   const client = createClient({
     projectId: 'your-actual-project-id',
     dataset: 'production', 
     token: 'your-actual-token',
     // ...
   });
   ```

## ✅ Expected Results

After completing the cleanup:

1. **Sanity CMS will show:**
   - Exactly 8 active registration types
   - All old/incorrect registration types will be deactivated
   - Registration types will be properly categorized

2. **Frontend registration page will display:**
   - Exactly 8 registration type options
   - All data fetched dynamically from Sanity
   - No hardcoded fallback data
   - Proper sorting and display order

3. **API endpoints will return:**
   - Only the 8 approved registration types
   - Proper filtering based on the new categories
   - Correct pricing and configuration data

## 🧪 Testing Checklist

- [ ] Run `node verify-registration-types.js` and confirm success
- [ ] Visit `/registration` page and verify 8 registration types are shown
- [ ] Confirm registration types match the approved list exactly
- [ ] Test registration form functionality with new types
- [ ] Verify pricing displays correctly for all types
- [ ] Check that selection/deselection works properly
- [ ] Confirm no hardcoded data is being used

## 🔄 Rollback Plan

If issues occur, you can rollback by:

1. **Reactivating old registration types in Sanity CMS**
2. **Reverting the schema changes** in both backend and frontend
3. **Restoring the original category filtering** in the frontend code

## 📞 Support

If you encounter issues during the cleanup process:

1. Check the console logs for any errors
2. Verify your Sanity credentials are correct
3. Ensure you have proper permissions to modify the Sanity dataset
4. Run the verification script to identify specific issues
