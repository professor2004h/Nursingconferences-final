# Gallery Toggle Feature

## 🎯 Overview

You can now **show or hide the Gallery link** in the "More" dropdown menu using either:
1. **Sanity Studio UI** (Recommended - No coding required)
2. **Command Line Script** (Quick toggle via terminal)

---

## 📍 Method 1: Using Sanity Studio (Recommended)

### **Step-by-Step:**

1. **Open Sanity Studio**
   - URL: http://localhost:3333
   - Or: http://localhost:3333/structure/gallerySettings

2. **Find Gallery Settings**
   - Look in the left sidebar for "Gallery Settings"
   - Click to open the settings document

3. **Toggle Visibility**
   - Find the **"Show Gallery in Navigation"** toggle
   - Click to turn ON (show) or OFF (hide)
   - Click **"Publish"** button to save

4. **Wait for Changes**
   - Changes appear in ~30 seconds (due to caching)
   - Or hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### **Customize Label:**
- Edit the **"Navigation Label"** field
- Examples: "Photo Gallery", "Conference Photos", "Gallery"
- Click **"Publish"** to save

---

## 📍 Method 2: Using Command Line Script

### **Quick Toggle:**

```bash
node toggle-gallery-visibility.js
```

This script will:
- ✅ Show current gallery visibility status
- ✅ Toggle the visibility (ON → OFF or OFF → ON)
- ✅ Display the new status
- ✅ Provide helpful information

### **Example Output:**

```
🔍 Fetching current gallery settings...

📊 Current Configuration:
   Document ID: hY1KZnhsaIM4Q2Zu6zxKWy
   Show Gallery: true
   Navigation Label: Gallery
   Show on Homepage: false

🔄 Toggling showGallery from true to false...

✅ Gallery settings updated successfully!

📊 New Configuration:
   Show Gallery: false
   Navigation Label: Gallery

🔒 Gallery is now HIDDEN from the navigation menu!
📍 The "Gallery" link will not appear in the More dropdown

⏱️  Changes will appear in ~30 seconds (due to caching)
💡 Hard refresh your browser (Ctrl+Shift+R) to see changes immediately
```

---

## 🔍 Where to Find the Gallery Link

### **Desktop Navigation:**
1. Look at the top navigation bar
2. Click the **"More"** button
3. Gallery link appears in the dropdown menu
4. Located between "Organizing Committee" and "Journal"

### **Mobile Navigation:**
1. Tap the hamburger menu (☰)
2. Tap **"More"** to expand the section
3. Gallery link appears in the expanded list

---

## ⚙️ Settings Available

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| **Show Gallery in Navigation** | Toggle | Shows/hides Gallery link in More dropdown | ON (true) |
| **Navigation Label** | Text | Custom text for the Gallery link | "Gallery" |
| **Show on Homepage** | Toggle | Future feature for homepage gallery section | OFF (false) |

---

## 🎨 Customization Examples

### **Example 1: Hide Gallery**
```
Show Gallery in Navigation: OFF
Navigation Label: Gallery
```
**Result:** Gallery link is completely hidden from navigation

### **Example 2: Custom Label**
```
Show Gallery in Navigation: ON
Navigation Label: Photo Gallery
```
**Result:** Link appears as "Photo Gallery" in the More dropdown

### **Example 3: Conference-Specific**
```
Show Gallery in Navigation: ON
Navigation Label: ICMCNM 2024 Photos
```
**Result:** Link appears as "ICMCNM 2024 Photos" in the More dropdown

---

## 🔧 Technical Information

### **API Endpoint:**
```
GET http://localhost:3000/api/gallery-settings
```

**Response:**
```json
{
  "showGallery": true,
  "navigationLabel": "Gallery",
  "showOnHomepage": false
}
```

### **Sanity Document:**
- **Type:** `gallerySettings`
- **Document ID:** `hY1KZnhsaIM4Q2Zu6zxKWy`
- **Singleton:** Only one settings document exists

### **Caching:**
- API responses cached for 30 seconds
- Changes may take up to 30 seconds to appear
- Hard refresh browser to see changes immediately

---

## 🚀 Quick Links

| Resource | URL |
|----------|-----|
| **Website** | http://localhost:3000 |
| **Sanity Studio** | http://localhost:3333 |
| **Gallery Settings** | http://localhost:3333/structure/gallerySettings |
| **Gallery Page** | http://localhost:3000/past-conference-gallery |
| **API Endpoint** | http://localhost:3000/api/gallery-settings |

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `GALLERY_TOGGLE_README.md` | This file - Quick reference guide |
| `GALLERY_TOGGLE_QUICK_START.md` | Quick start guide with minimal steps |
| `GALLERY_TOGGLE_IMPLEMENTATION.md` | Full technical implementation guide |
| `GALLERY_TOGGLE_SUMMARY.md` | Implementation summary and testing results |

---

## 🛠️ Troubleshooting

### **Gallery link not appearing after enabling:**
1. ✅ Wait 30 seconds for cache to refresh
2. ✅ Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
3. ✅ Check browser console for errors
4. ✅ Verify setting is **published** (not just saved)

### **Changes not reflecting:**
1. ✅ Ensure you clicked **"Publish"** in Sanity Studio
2. ✅ Clear browser cache
3. ✅ Verify both servers are running (frontend & backend)
4. ✅ Try incognito/private browsing mode

### **Script errors:**
1. ✅ Ensure you're in the project root directory
2. ✅ Check that `.env` file exists in `SanityBackend/` folder
3. ✅ Verify `SANITY_API_TOKEN` is set in the `.env` file
4. ✅ Run `npm install` if dependencies are missing

---

## ✅ Testing Checklist

- [x] Gallery settings created in Sanity
- [x] API endpoint working correctly
- [x] Desktop dropdown shows/hides gallery link
- [x] Mobile menu shows/hides gallery link
- [x] Custom navigation label works
- [x] Toggle script works via command line
- [x] Documentation complete

---

## 💡 Tips

1. **Use Sanity Studio for regular changes** - It's more user-friendly
2. **Use the script for quick testing** - Faster for developers
3. **Always publish changes** - Don't just save as draft
4. **Wait for cache** - Changes take ~30 seconds to appear
5. **Hard refresh** - Use Ctrl+Shift+R to see changes immediately

---

## 🎉 Success!

The Gallery toggle feature is fully implemented and ready to use. You have complete control over the Gallery link visibility through the Sanity CMS without touching any code!

**Need Help?** Check the full documentation in `GALLERY_TOGGLE_IMPLEMENTATION.md`

---

**Last Updated:** October 9, 2025  
**Status:** ✅ Complete and Tested  
**Version:** 1.0.0

