# Organizing Committee Page Setup Guide

## Overview
This guide explains how to set up and manage the Organizing Committee page for the nursing conference website. The implementation follows the reference design from https://cognitionconferences.com/materialchemistry/committee-members/ and includes full Sanity CMS integration.

## Features Implemented

### ✅ Responsive Layout
- **Desktop**: 4-column grid layout
- **Tablet**: 3-column grid layout
- **Mobile**: 2-column grid layout
- Smooth responsive transitions between breakpoints

### ✅ Committee Member Cards
- Profile image with fallback placeholder
- Name, title/position, institution/affiliation
- Chairperson badge for committee chairs
- "View Profile" button with hover effects
- Consistent card styling with shadow effects

### ✅ Sanity CMS Integration
- Complete schema for committee members (`organizingCommittee.ts`)
- Rich data fields including bio, achievements, publications
- Image upload with optimization
- Admin-friendly interface for content management

### ✅ Profile Modal
- Detailed member information display
- Contact links (email, LinkedIn, ResearchGate, ORCID)
- Achievements and publications lists
- Responsive modal design with escape key support

### ✅ Navigation Integration
- Added "Committee" link to main navigation
- Mobile menu support
- Consistent styling with existing navigation

## File Structure

```
├── SanityBackend/
│   ├── schemaTypes/
│   │   ├── organizingCommittee.ts          # Sanity schema definition
│   │   └── index.ts                        # Updated schema exports
│   └── add-sample-committee-data.js        # Sample data script
├── src/
│   ├── app/
│   │   ├── api/organizing-committee/
│   │   │   └── route.ts                    # API endpoints
│   │   ├── organizing-committee/
│   │   │   └── page.tsx                    # Main committee page
│   │   └── components/
│   │       ├── Header.tsx                  # Updated navigation
│   │       ├── HeaderClient.tsx            # Updated navigation
│   │       └── HeaderServer.tsx            # Navigation server component
│   ├── components/
│   │   └── CommitteeMemberModal.tsx        # Profile modal component
│   └── types/
│       └── organizingCommittee.ts          # TypeScript interfaces
└── nextjs-frontend/public/images/
    └── default-profile.svg                 # Default profile image
```

## Setup Instructions

### 1. Sanity Backend Setup

The Sanity schema has already been created and added to the schema types. To add sample data:

1. **Update the sample data script**:
   ```bash
   cd SanityBackend
   ```

2. **Edit `add-sample-committee-data.js`**:
   - Replace `'your-project-id'` with your actual Sanity project ID
   - Replace `'your-token'` with a valid Sanity token with write permissions

3. **Run the sample data script**:
   ```bash
   node add-sample-committee-data.js
   ```

### 2. Add Profile Images

1. Go to your Sanity Studio (usually at `http://localhost:3333`)
2. Navigate to "Organizing Committee Member" documents
3. For each member, upload a professional profile image
4. Recommended image specifications:
   - Format: JPG or PNG
   - Minimum size: 400x400px
   - Aspect ratio: Square (1:1) preferred
   - File size: Under 2MB for optimal performance

### 3. Frontend Deployment

The frontend components are already integrated. To verify everything is working:

1. **Start the development server**:
   ```bash
   cd nextjs-frontend
   npm run dev
   ```

2. **Visit the committee page**:
   ```
   http://localhost:3000/organizing-committee
   ```

3. **Check navigation**:
   - Verify "Committee" link appears in the main navigation
   - Test mobile menu functionality

## Content Management

### Adding New Committee Members

1. **Via Sanity Studio**:
   - Go to Sanity Studio
   - Click "Create" → "Organizing Committee Member"
   - Fill in all required fields:
     - Name (required)
     - Title/Position (required)
     - Institution (required)
     - Country (required)
     - Profile Image (required)
     - Biography (required, min 50 characters)
     - Display Order (required, determines position on page)

2. **Optional Fields**:
   - Specialization area
   - Contact email
   - LinkedIn profile URL
   - ORCID ID
   - ResearchGate profile URL
   - Years of experience
   - Key achievements (list)
   - Notable publications (list)

### Managing Display Order

Committee members are displayed based on the "Display Order" field:
- Lower numbers appear first (1, 2, 3, etc.)
- Chairperson should typically have display order 1
- Use increments of 10 (10, 20, 30) to allow easy reordering

### Chairperson Settings

To mark someone as chairperson:
1. Edit the committee member in Sanity Studio
2. Toggle "Is Chairperson" to true
3. A crown icon and "Chairperson" badge will appear

## API Endpoints

### GET `/api/organizing-committee`
Returns all active committee members ordered by display order.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "member-id",
      "name": "Dr. Sarah Johnson",
      "title": "Professor of Nursing",
      "institution": "Johns Hopkins University",
      "country": "United States",
      "profileImageUrl": "https://cdn.sanity.io/...",
      "bio": "Dr. Sarah Johnson is...",
      "isChairperson": true,
      "displayOrder": 1
    }
  ],
  "count": 8
}
```

### POST `/api/organizing-committee`
Get a single committee member by ID.

**Request**:
```json
{
  "memberId": "member-id-here"
}
```

## Next Steps

1. **Update the sample data script** with your Sanity project credentials
2. **Run the script** to populate sample committee members
3. **Add profile images** through Sanity Studio
4. **Test the page** at `/organizing-committee`
5. **Customize styling** as needed for your brand

The implementation is complete and ready for use!

## File Structure

```
├── SanityBackend/
│   ├── schemaTypes/
│   │   ├── organizingCommittee.ts          # Sanity schema definition
│   │   └── index.ts                        # Updated schema exports
│   └── add-sample-committee-data.js        # Sample data script
├── src/
│   ├── app/
│   │   ├── api/organizing-committee/
│   │   │   └── route.ts                    # API endpoints
│   │   ├── organizing-committee/
│   │   │   └── page.tsx                    # Main committee page
│   │   └── components/
│   │       ├── Header.tsx                  # Updated navigation
│   │       ├── HeaderClient.tsx            # Updated navigation
│   │       └── HeaderServer.tsx            # Navigation server component
│   ├── components/
│   │   └── CommitteeMemberModal.tsx        # Profile modal component
│   └── types/
│       └── organizingCommittee.ts          # TypeScript interfaces
└── nextjs-frontend/public/images/
    └── default-profile.svg                 # Default profile image
```

## Setup Instructions

### 1. Sanity Backend Setup

The Sanity schema has already been created and added to the schema types. To add sample data:

1. **Update the sample data script**:
   ```bash
   cd SanityBackend
   ```

2. **Edit `add-sample-committee-data.js`**:
   - Replace `'your-project-id'` with your actual Sanity project ID
   - Replace `'your-token'` with a valid Sanity token with write permissions

3. **Run the sample data script**:
   ```bash
   node add-sample-committee-data.js
   ```

### 2. Add Profile Images

1. Go to your Sanity Studio (usually at `http://localhost:3333`)
2. Navigate to "Organizing Committee Member" documents
3. For each member, upload a professional profile image
4. Recommended image specifications:
   - Format: JPG or PNG
   - Minimum size: 400x400px
   - Aspect ratio: Square (1:1) preferred
   - File size: Under 2MB for optimal performance

### 3. Frontend Deployment

The frontend components are already integrated. To verify everything is working:

1. **Start the development server**:
   ```bash
   cd nextjs-frontend
   npm run dev
   ```

2. **Visit the committee page**:
   ```
   http://localhost:3000/organizing-committee
   ```

3. **Check navigation**:
   - Verify "Committee" link appears in the main navigation
   - Test mobile menu functionality

## Content Management

### Adding New Committee Members

1. **Via Sanity Studio**:
   - Go to Sanity Studio
   - Click "Create" → "Organizing Committee Member"
   - Fill in all required fields:
     - Name (required)
     - Title/Position (required)
     - Institution (required)
     - Country (required)
     - Profile Image (required)
     - Biography (required, min 50 characters)
     - Display Order (required, determines position on page)

2. **Optional Fields**:
   - Specialization area
   - Contact email
   - LinkedIn profile URL
   - ORCID ID
   - ResearchGate profile URL
   - Years of experience
   - Key achievements (list)
   - Notable publications (list)

### Managing Display Order

Committee members are displayed based on the "Display Order" field:
- Lower numbers appear first (1, 2, 3, etc.)
- Chairperson should typically have display order 1
- Use increments of 10 (10, 20, 30) to allow easy reordering

### Chairperson Settings

To mark someone as chairperson:
1. Edit the committee member in Sanity Studio
2. Toggle "Is Chairperson" to true
3. A crown icon and "Chairperson" badge will appear

## Customization Options

### Styling Modifications

The committee page uses Tailwind CSS classes. Key styling files:
- `src/app/organizing-committee/page.tsx` - Main page layout
- `src/components/CommitteeMemberModal.tsx` - Modal styling

### Grid Layout Changes

To modify the responsive grid:
```tsx
// Current: 2 cols mobile, 3 cols tablet, 4 cols desktop
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// Example: 1 col mobile, 2 cols tablet, 3 cols desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Color Scheme Updates

The page uses the site's standard color scheme:
- Primary: Blue gradient (`from-blue-900 via-blue-800 to-blue-700`)
- Accent: Orange (`bg-orange-500 hover:bg-orange-600`)
- Text: Gray scale (`text-gray-900`, `text-gray-600`, `text-gray-500`)

## API Endpoints

### GET `/api/organizing-committee`
Returns all active committee members ordered by display order.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "member-id",
      "name": "Dr. Sarah Johnson",
      "title": "Professor of Nursing",
      "institution": "Johns Hopkins University",
      "country": "United States",
      "profileImageUrl": "https://cdn.sanity.io/...",
      "bio": "Dr. Sarah Johnson is...",
      "isChairperson": true,
      "displayOrder": 1
    }
  ],
  "count": 8
}
```

### POST `/api/organizing-committee`
Get a single committee member by ID.

**Request**:
```json
{
  "memberId": "member-id-here"
}
```

## Troubleshooting

### Common Issues

1. **No committee members showing**:
   - Check if sample data was added successfully
   - Verify `isActive` field is set to `true` for members
   - Check browser console for API errors

2. **Images not loading**:
   - Ensure images are uploaded in Sanity Studio
   - Check image URLs in the API response
   - Verify Sanity CDN is accessible

3. **Modal not opening**:
   - Check browser console for JavaScript errors
   - Verify modal component is imported correctly
   - Test with different browsers

4. **Navigation link missing**:
   - Clear browser cache
   - Restart development server
   - Check if header components were updated correctly

### Performance Optimization

1. **Image Optimization**:
   - Use WebP format when possible
   - Implement lazy loading for images
   - Consider using Sanity's image transformation API

2. **API Caching**:
   - Implement Redis caching for committee data
   - Use Next.js ISR (Incremental Static Regeneration)
   - Add proper cache headers

## Future Enhancements

### Potential Improvements

1. **Search and Filtering**:
   - Add search by name or institution
   - Filter by specialization area
   - Sort by experience or alphabetical order

2. **Enhanced Profiles**:
   - Add social media links
   - Include research interests tags
   - Add downloadable CV/resume

3. **Interactive Features**:
   - Contact form integration
   - Meeting scheduler
   - Committee member directory export

4. **Analytics**:
   - Track profile views
   - Monitor popular committee members
   - Generate engagement reports

## Support

For technical support or questions about the organizing committee feature:
1. Check this documentation first
2. Review the code comments in the implementation files
3. Test with the sample data to isolate issues
4. Check Sanity Studio for data integrity

The implementation follows best practices for React, Next.js, and Sanity CMS integration, ensuring maintainability and scalability for future enhancements.
