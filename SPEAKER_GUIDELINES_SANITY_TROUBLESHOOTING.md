# Speaker Guidelines Sanity Studio Troubleshooting Guide

## 🎯 Issue Resolution Summary

The Speaker Guidelines content type was not appearing in the Sanity Studio interface because it was missing from the **desk structure configuration**. This has now been resolved.

## ✅ What Was Fixed

### 1. Schema Registration ✅
- **File**: `SanityBackend/schemaTypes/speakerGuidelines.ts` - ✅ Created and properly formatted
- **Import**: `SanityBackend/schemaTypes/index.ts` - ✅ Properly imported and included in schemaTypes array
- **Export**: Schema properly exported as default export

### 2. Desk Structure Configuration ✅ (This was the missing piece)
- **File**: `SanityBackend/deskStructure.js` - ✅ Added Speaker Guidelines entry
- **Configuration**: Added proper list item with icon and schema type reference
- **Position**: Added after Organizing Committee section

### 3. Sanity Studio Restart ✅
- **Action**: Restarted Sanity Studio to pick up desk structure changes
- **Status**: Studio now running at http://localhost:3333

## 🔧 Technical Details

### Schema Configuration
```typescript
// SanityBackend/schemaTypes/speakerGuidelines.ts
export default defineType({
  name: 'speakerGuidelines',
  title: 'Speaker Guidelines',
  type: 'document',
  icon: () => '🎤',
  // ... fields configuration
})
```

### Desk Structure Addition
```javascript
// SanityBackend/deskStructure.js
S.listItem()
  .title('Speaker Guidelines')
  .id('speakerGuidelines')
  .icon(() => '🎤')
  .schemaType('speakerGuidelines')
  .child(
    S.documentTypeList('speakerGuidelines')
      .title('Speaker Guidelines')
  ),
```

## 📍 How to Access Speaker Guidelines in Sanity Studio

### Method 1: Direct URL
```
http://localhost:3333/structure/speakerGuidelines
```

### Method 2: Studio Navigation
1. Open Sanity Studio: http://localhost:3333
2. Look for "Speaker Guidelines" in the content list (with 🎤 icon)
3. Click on "Speaker Guidelines" to access the content type

### Method 3: Search
1. In Sanity Studio, use the search function
2. Search for "Speaker Guidelines" or "speakerGuidelines"

## 🧪 Testing and Verification

### Test URLs
- **Test Page**: http://localhost:3000/test-speaker-guidelines
- **Speaker Guidelines Page**: http://localhost:3000/speaker-guidelines
- **Admin Management**: http://localhost:3000/admin/speaker-guidelines
- **API Endpoint**: http://localhost:3000/api/speaker-guidelines
- **Populate API**: http://localhost:3000/api/populate-speaker-guidelines
- **Sanity Studio**: http://localhost:3333/structure/speakerGuidelines

### Verification Steps
1. ✅ Schema appears in Sanity Studio content list
2. ✅ Can create new Speaker Guidelines documents
3. ✅ API endpoints return data correctly
4. ✅ Frontend pages display content properly
5. ✅ Admin interface shows management options

## 🚨 Common Issues and Solutions

### Issue 1: Schema Not Appearing in Studio
**Cause**: Missing from desk structure configuration
**Solution**: Add to `deskStructure.js` and restart Sanity Studio

### Issue 2: Schema Errors
**Cause**: TypeScript/JavaScript syntax errors in schema file
**Solution**: Check schema file for proper syntax and imports

### Issue 3: Studio Not Updating
**Cause**: Studio needs restart after desk structure changes
**Solution**: Kill and restart Sanity Studio process

### Issue 4: API Errors
**Cause**: Schema not properly registered or Sanity connection issues
**Solution**: Verify schema registration and Sanity client configuration

## 🔄 Restart Instructions

### If Speaker Guidelines Still Not Visible:

1. **Stop Sanity Studio**:
   ```bash
   # Kill the Sanity Studio process (Terminal 91 or current)
   ```

2. **Restart Sanity Studio**:
   ```bash
   cd SanityBackend
   npm run dev
   # or
   sanity dev
   ```

3. **Clear Browser Cache**:
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache for localhost:3333

4. **Verify Schema Registration**:
   - Check `SanityBackend/schemaTypes/index.ts`
   - Ensure `speakerGuidelines` is in the schemaTypes array

## 📋 Current Status

### ✅ Completed
- [x] Schema created and properly formatted
- [x] Schema registered in index.ts
- [x] Desk structure updated with Speaker Guidelines entry
- [x] Sanity Studio restarted
- [x] API endpoints created and tested
- [x] Frontend pages implemented
- [x] Admin interface created
- [x] Test page for verification

### 🎯 Expected Behavior
- Speaker Guidelines should now appear in Sanity Studio content list
- Icon: 🎤 Speaker Guidelines
- Clicking opens the document list for speaker guidelines
- Can create, edit, and manage speaker guidelines content
- All API endpoints should work correctly

## 📞 Support Information

### If Issues Persist:
1. Check browser console for JavaScript errors
2. Verify Sanity Studio is running on port 3333
3. Check that schema file has no syntax errors
4. Ensure desk structure file is properly formatted
5. Try accessing direct URL: http://localhost:3333/structure/speakerGuidelines

### Debug Commands:
```bash
# Check if Sanity Studio is running
curl http://localhost:3333

# Check API endpoint
curl http://localhost:3000/api/speaker-guidelines

# Populate default data
curl http://localhost:3000/api/populate-speaker-guidelines
```

## 🎉 Success Indicators

When everything is working correctly, you should see:
- 🎤 Speaker Guidelines option in Sanity Studio sidebar
- Ability to create and edit speaker guidelines documents
- API endpoints returning proper data
- Frontend pages displaying content correctly
- Admin interface showing management options

The Speaker Guidelines content type is now properly configured and should be accessible in the Sanity Studio interface!
