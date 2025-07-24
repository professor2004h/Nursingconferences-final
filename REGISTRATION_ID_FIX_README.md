# Registration ID Uniqueness Fix

## 🎯 Problem Solved

The registration system was creating duplicate registration IDs, causing multiple entries with the same ID to appear in the Sanity CMS. This has been fixed with the following improvements:

## ✅ Changes Made

### 1. Schema-Level Uniqueness Validation

**Files Modified:**
- `SanityBackend/schemaTypes/conferenceRegistration.ts`
- `SanityBackend/schemaTypes/sponsorRegistration.ts`

**Changes:**
- Added custom validation to the `registrationId` field that checks for duplicates in the database
- Prevents saving documents with duplicate registration IDs
- Shows clear error message when duplicates are detected

### 2. API-Level Duplicate Prevention

**Files Modified:**
- `nextjs-frontend/src/app/api/registration/route.ts`
- `nextjs-frontend/src/app/api/sponsorship/register/route.ts`

**Changes:**
- Added duplicate check before creating new registrations
- Automatically regenerates ID if collision is detected (up to 5 attempts)
- Returns error if unable to generate unique ID after maximum attempts

### 3. Enhanced ID Generation

**Files Modified:**
- `nextjs-frontend/src/app/api/registration/route.ts`
- `nextjs-frontend/src/app/getSponsorshipData.ts`

**Changes:**
- Improved ID generation with higher entropy
- Added microsecond precision, multiple random strings, and process entropy
- Significantly reduced probability of collisions

## 🛠️ Cleanup Scripts

### 1. Verify Current State

Run this script to check for existing duplicate registration IDs:

```bash
node verify-registration-ids.js
```

This will:
- Show all duplicate registration IDs
- Display cross-type conflicts (same ID in both conference and sponsor registrations)
- Provide a summary of issues found

### 2. Fix Duplicate IDs

Run this script to clean up existing duplicates:

```bash
node fix-duplicate-registration-ids.js
```

This will:
- Keep the most recent registration for each duplicate group
- Delete older duplicates and their associated payment records
- Regenerate unique IDs for any remaining conflicts
- Provide detailed logging of all operations

## 🔧 Environment Setup

Make sure you have the following environment variables set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
```

## 📊 ID Format

### Conference Registrations
- Format: `REG-{timestamp}{microseconds}-{random1}{random2}{entropy}`
- Example: `REG-LM8K2J3K123-ABC123DEF456GH78`

### Sponsor Registrations
- Format: `SPR-{timestamp}{microseconds}-{random1}{random2}{entropy}`
- Example: `SPR-LM8K2J3K123-XYZ789UVW012IJ34`

## 🚀 How It Works

### Registration Process
1. Generate initial registration ID with high entropy
2. Check database for existing ID
3. If duplicate found, regenerate new ID (up to 5 attempts)
4. If still duplicate after 5 attempts, return error
5. Save registration with unique ID

### Schema Validation
1. When saving/updating in Sanity Studio
2. Custom validation function queries database
3. Checks for existing registrations with same ID
4. Excludes current document from check (for updates)
5. Returns validation error if duplicate found

## 🔍 Monitoring

To monitor registration ID uniqueness going forward:

1. Run `verify-registration-ids.js` periodically
2. Check Sanity Studio for validation errors when creating registrations
3. Monitor application logs for ID collision warnings

## 📝 Notes

- The schema validation only works in Sanity Studio interface
- API-level validation prevents duplicates from frontend submissions
- Both validations work together to ensure complete uniqueness
- Existing duplicates must be cleaned up using the provided scripts

## 🆘 Troubleshooting

### If you see "Registration ID collision detected" in logs:
- This is normal and expected behavior
- The system automatically handles collisions by regenerating IDs
- Only becomes an issue if it happens repeatedly (indicates low entropy)

### If registration fails with "Unable to generate unique registration ID":
- Very rare occurrence (probability < 1 in billions)
- User should try submitting again
- Check if ID generation function needs more entropy

### If Sanity Studio shows "Registration ID must be unique" error:
- Someone is trying to manually create a registration with existing ID
- Use the auto-generated ID instead of manual entry
- Check for existing registrations with that ID
