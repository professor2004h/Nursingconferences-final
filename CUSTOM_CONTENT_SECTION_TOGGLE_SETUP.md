# Custom Content Section Toggle Setup

## Overview
This document outlines the implementation of toggle functionality for the Custom Content Section, allowing administrators to show/hide the section on the homepage through Sanity Studio.

## Features Added

### ✅ Toggle Control
- **Show/Hide Toggle**: Boolean field to control section visibility
- **Default State**: Section is visible by default (`showOnHomepage: true`)
- **Conditional Rendering**: Section only renders when toggle is enabled

### ✅ Sanity Studio Integration
- **Singleton Document**: Only one Custom Content Section settings document
- **Visual Status**: Preview shows "✅ Section Visible" or "❌ Section Hidden"
- **Organized Structure**: Integrated into desk structure with gear icon (⚙️)

### ✅ Frontend Implementation
- **Conditional Rendering**: `{customContentData?.showOnHomepage && (...)}`
- **Fallback Handling**: Graceful handling when data is unavailable
- **Type Safety**: Full TypeScript support with updated interfaces

## Files Modified

### 1. Schema Definition
**File**: `SanityBackend/schemaTypes/customContentSection.ts`

**Changes**:
- Added `showOnHomepage` boolean field
- Updated preview to show toggle status
- Enabled singleton mode (`__experimental_singleton: true`)

```typescript
defineField({
  name: 'showOnHomepage',
  title: 'Show on Homepage',
  type: 'boolean',
  description: 'Toggle to show or hide this section on the homepage',
  initialValue: true,
  validation: (Rule) => Rule.required(),
}),
```

### 2. Data Fetching
**File**: `nextjs-frontend/src/app/getCustomContentSectionStyling.ts`

**Changes**:
- Updated TypeScript interface to include `showOnHomepage: boolean`
- Modified query to fetch the toggle field
- Updated default content to include toggle state
- Enhanced data processing with toggle handling

```typescript
export interface CustomContentSectionData {
  _id: string;
  title: string;
  primaryText: string;
  insights: string;
  targets: string;
  showOnHomepage: boolean;
}
```

### 3. Frontend Rendering
**File**: `nextjs-frontend/src/app/page.tsx`

**Changes**:
- Wrapped Custom Content Section with conditional rendering
- Added toggle check: `{customContentData?.showOnHomepage && (...)}`
- Maintained all existing styling and functionality

```jsx
{/* Custom Content Section - Only show if toggle is enabled */}
{customContentData?.showOnHomepage && (
<section className="custom-content-section bg-white py-12 md:py-16">
  {/* Section content */}
</section>
)}
```

### 4. Desk Structure
**File**: `SanityBackend/deskStructure.js`

**Changes**:
- Updated Custom Content Section to be a singleton
- Added gear icon (⚙️) for visual identification
- Organized under proper document structure

```javascript
S.listItem()
  .title('⚙️ Custom Content Section')
  .id('customContentSection')
  .child(
    S.document()
      .schemaType('customContentSection')
      .documentId('customContentSection')
      .title('Custom Content Section Settings')
  ),
```

### 5. Migration Script
**File**: `SanityBackend/migrations/createCustomContentSectionSettings.js`

**Purpose**: 
- Creates singleton document with default values
- Adds toggle field to existing documents
- Ensures proper initialization

## How to Use

### In Sanity Studio:
1. Navigate to "⚙️ Custom Content Section" in the content structure
2. Toggle the "Show on Homepage" field to control visibility
3. Edit content (Primary Text, Insights, Targets) as needed
4. Save changes

### Toggle States:
- **✅ Section Visible**: Custom Content Section appears on homepage
- **❌ Section Hidden**: Custom Content Section is hidden from homepage

## Technical Implementation

### Conditional Rendering Logic:
```javascript
// Only render if showOnHomepage is true
{customContentData?.showOnHomepage && (
  <section>
    {/* Section content */}
  </section>
)}
```

### Data Flow:
1. **Sanity Studio**: Admin toggles "Show on Homepage"
2. **API**: Data fetched with `showOnHomepage` field
3. **Frontend**: Conditional rendering based on toggle state
4. **User**: Section appears/disappears on homepage

### Default Behavior:
- **New Installations**: Section visible by default
- **Missing Data**: Falls back to default content with toggle enabled
- **API Errors**: Graceful degradation with default values

## Benefits

### ✅ Content Management
- **Easy Control**: Simple toggle to show/hide section
- **No Code Changes**: Content managers can control visibility
- **Instant Updates**: Changes reflect immediately on frontend

### ✅ Performance
- **Conditional Loading**: Section only renders when needed
- **Reduced Payload**: Hidden sections don't affect page load
- **Clean HTML**: No hidden elements in DOM

### ✅ User Experience
- **Seamless Integration**: Toggle works with existing functionality
- **Responsive Design**: Maintains mobile compatibility
- **Visual Feedback**: Clear status indication in Sanity Studio

## Testing

### ✅ Functionality Tests:
1. **Toggle On**: Section appears on homepage
2. **Toggle Off**: Section disappears from homepage
3. **Content Updates**: Changes reflect when section is visible
4. **Responsive**: Works on desktop and mobile
5. **Fallback**: Graceful handling of missing data

### ✅ Studio Tests:
1. **Preview**: Shows correct toggle status
2. **Singleton**: Only one document can exist
3. **Validation**: Required fields properly validated
4. **Save**: Changes persist correctly

## Future Enhancements

### Potential Additions:
- **Scheduling**: Show/hide based on date/time
- **User Roles**: Different visibility for different user types
- **A/B Testing**: Toggle between different content versions
- **Analytics**: Track section engagement when visible

## Support

For issues or questions regarding the Custom Content Section toggle functionality:
1. Check Sanity Studio for proper toggle state
2. Verify data fetching in browser developer tools
3. Ensure migration script has been run
4. Check console for any error messages

---

**Status**: ✅ Implemented and Ready for Use
**Version**: 1.0
**Last Updated**: 2025-07-26
