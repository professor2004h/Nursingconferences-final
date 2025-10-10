# Gallery Toggle Implementation Guide

## Overview
This guide explains how to show or hide the **Gallery** option in the "More" dropdown menu of the website navigation using the Sanity CMS.

## ✅ Features Implemented

### 1. **Gallery Settings Schema**
- Created a new `gallerySettings` schema in Sanity CMS
- Singleton document (only one settings document exists)
- Located at: `SanityBackend/schemaTypes/gallerySettings.ts`

### 2. **Toggle Controls**
The Gallery Settings document includes the following fields:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| **Show Gallery in Navigation** | Boolean | Toggle to show/hide the Gallery link in the More dropdown menu | `true` |
| **Navigation Label** | String | Customize the text displayed for the Gallery link | `"Gallery"` |
| **Show on Homepage** | Boolean | Toggle to show/hide Gallery section on homepage (future feature) | `false` |

### 3. **API Endpoint**
- Created `/api/gallery-settings` endpoint
- Returns gallery settings with caching (30 seconds)
- Provides default values if settings not found

### 4. **Frontend Integration**
- Updated `HeaderClient.tsx` to fetch and use gallery settings
- Gallery link conditionally rendered based on `showGallery` setting
- Works in both desktop dropdown and mobile menu
- Custom navigation label support

---

## 🎯 How to Use

### **Step 1: Access Sanity Studio**
1. Open your browser and navigate to: **http://localhost:3333**
2. Or visit your deployed Sanity Studio URL

### **Step 2: Navigate to Gallery Settings**
1. In the Sanity Studio sidebar, look for **"Gallery Settings"**
2. Click on it to open the settings document

### **Step 3: Toggle Gallery Visibility**

#### **To Hide the Gallery Link:**
1. Find the **"Show Gallery in Navigation"** toggle
2. Click to turn it **OFF** (toggle should be gray/disabled)
3. Click **"Publish"** button in the bottom right
4. Wait 30 seconds for cache to refresh, or refresh your website

#### **To Show the Gallery Link:**
1. Find the **"Show Gallery in Navigation"** toggle
2. Click to turn it **ON** (toggle should be green/enabled)
3. Click **"Publish"** button in the bottom right
4. Wait 30 seconds for cache to refresh, or refresh your website

### **Step 4: Customize Navigation Label (Optional)**
1. In the **"Navigation Label"** field, enter your desired text
   - Examples: "Photo Gallery", "Conference Photos", "Gallery", etc.
2. Click **"Publish"** to save changes
3. The new label will appear in the navigation menu

---

## 📍 Where the Gallery Link Appears

When **enabled**, the Gallery link appears in:

### **Desktop Navigation:**
- Click "More" in the main navigation bar
- Gallery link appears in the dropdown menu
- Located between "Organizing Committee" and "Journal" (if enabled)

### **Mobile Navigation:**
- Tap the hamburger menu (☰)
- Tap "More" to expand the section
- Gallery link appears in the expanded list

---

## 🔧 Technical Details

### **Files Modified/Created:**

1. **Backend (Sanity):**
   - `SanityBackend/schemaTypes/gallerySettings.ts` - New schema
   - `SanityBackend/schemaTypes/index.ts` - Added gallerySettings to exports
   - `SanityBackend/create-gallery-settings.js` - Initialization script

2. **Frontend (Next.js):**
   - `nextjs-frontend/src/app/api/gallery-settings/route.ts` - New API endpoint
   - `nextjs-frontend/src/app/components/HeaderClient.tsx` - Updated to use settings

### **How It Works:**

1. **Settings Storage:**
   - Gallery settings are stored in Sanity CMS as a singleton document
   - Only one settings document can exist (enforced by `__experimental_singleton`)

2. **Data Flow:**
   ```
   Sanity CMS (gallerySettings)
        ↓
   API Endpoint (/api/gallery-settings)
        ↓
   HeaderClient Component (useEffect fetch)
        ↓
   Conditional Rendering (showGallery check)
        ↓
   Gallery Link Visible/Hidden
   ```

3. **Caching:**
   - API responses are cached for 30 seconds
   - Changes may take up to 30 seconds to appear on the website
   - Force refresh the page to see changes immediately

4. **Default Behavior:**
   - If settings document doesn't exist: Gallery is **shown** by default
   - If API fails: Gallery is **shown** by default (fail-safe)
   - Navigation label defaults to "Gallery" if not specified

---

## 🎨 Customization Examples

### **Example 1: Hide Gallery Completely**
```
Show Gallery in Navigation: OFF
Navigation Label: Gallery
```
**Result:** Gallery link is hidden from all navigation menus

### **Example 2: Show with Custom Label**
```
Show Gallery in Navigation: ON
Navigation Label: Photo Gallery
```
**Result:** Link appears as "Photo Gallery" in navigation

### **Example 3: Conference-Specific Label**
```
Show Gallery in Navigation: ON
Navigation Label: ICMCNM 2024 Photos
```
**Result:** Link appears as "ICMCNM 2024 Photos" in navigation

---

## 🔍 Troubleshooting

### **Gallery link not appearing after enabling:**
1. Wait 30 seconds for cache to refresh
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors
4. Verify the setting is published (not just saved as draft)

### **Changes not reflecting:**
1. Ensure you clicked **"Publish"** (not just save)
2. Clear browser cache
3. Check if both frontend and backend servers are running
4. Verify API endpoint is accessible: `http://localhost:3000/api/gallery-settings`

### **Gallery link still showing after disabling:**
1. Verify the toggle is OFF and published
2. Wait for cache to expire (30 seconds)
3. Check browser console for cached responses
4. Try incognito/private browsing mode

---

## 🚀 Future Enhancements

The following features can be added in the future:

1. **Homepage Gallery Section:**
   - Use the "Show on Homepage" toggle
   - Display featured gallery images on the homepage

2. **Gallery Page Settings:**
   - Custom page title and description
   - Gallery layout options (grid, masonry, carousel)
   - Images per page setting

3. **Access Control:**
   - Public/private gallery toggle
   - Password-protected galleries
   - Member-only access

4. **SEO Settings:**
   - Custom meta title and description
   - Gallery-specific keywords
   - Social media preview images

---

## 📊 Related Features

This implementation follows the same pattern as:
- **Poster Presenters Settings** - Toggle poster presenters visibility
- **Exhibitors Settings** - Toggle exhibitors visibility
- **Journal Settings** - Toggle journal button visibility
- **Past Conferences Settings** - Toggle past conferences visibility

All these features use the same architecture for consistency and maintainability.

---

## ✅ Testing Checklist

- [x] Gallery settings schema created
- [x] API endpoint created and tested
- [x] HeaderClient updated with gallery settings
- [x] Desktop dropdown shows/hides gallery link
- [x] Mobile menu shows/hides gallery link
- [x] Custom navigation label works
- [x] Default values work correctly
- [x] Caching works as expected
- [x] Documentation created

---

## 📝 Summary

You now have full control over the Gallery link visibility in your website navigation through the Sanity CMS. Simply toggle the **"Show Gallery in Navigation"** setting in the Gallery Settings document to show or hide the Gallery option in the More dropdown menu.

**Quick Access:**
- Sanity Studio: http://localhost:3333
- Gallery Settings: Navigate to "Gallery Settings" in the sidebar
- Gallery Page: http://localhost:3000/past-conference-gallery

For any issues or questions, refer to the troubleshooting section above.

