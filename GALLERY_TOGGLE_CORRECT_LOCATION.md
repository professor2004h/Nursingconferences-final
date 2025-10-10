# ⚠️ Important: Correct Location for Gallery Toggle

## 🎯 You're Looking at the Wrong Document!

Based on your screenshot, you're currently viewing:
- **URL:** `http://localhost:3333/structure/pastConferenceGallery;6f348172-42d9-4725-9151-824e242ac7a2`
- **Document Type:** `pastConferenceGallery` (Individual gallery item)
- **Field:** "Active Gallery" (Controls if THIS specific gallery is shown)

This is **NOT** the correct location for hiding the Gallery link from navigation!

---

## ✅ Correct Location: Gallery Settings

To hide the Gallery link from the navigation menu, you need to go to:

### **Correct URL:**
```
http://localhost:3333/structure/gallerySettings
```

### **Step-by-Step:**

1. **Open Sanity Studio:** http://localhost:3333

2. **Look in the LEFT SIDEBAR** for a document called:
   - **"Gallery Settings"** (with a ⚙️ gear icon)
   - NOT "Conference Gallery" (with a 📸 camera icon)

3. **Click on "Gallery Settings"**

4. **You should see these fields:**
   - ✅ **Show Gallery in Navigation** ← This is the toggle you need!
   - Navigation Label
   - Show on Homepage

5. **Toggle OFF** the "Show Gallery in Navigation" switch

6. **Click "Publish"** (not just save)

7. **Wait 30 seconds** or hard refresh your browser

---

## 📊 Difference Between the Two Documents

| Document | Purpose | Location |
|----------|---------|----------|
| **Gallery Settings** ⚙️ | Controls if Gallery link appears in navigation | `/structure/gallerySettings` |
| **Conference Gallery** 📸 | Individual gallery items/photos | `/structure/pastConferenceGallery` |

### **Gallery Settings (What you need):**
- Controls the **navigation menu**
- Shows/hides the Gallery link in the More dropdown
- Only ONE document exists

### **Conference Gallery (What you're currently viewing):**
- Individual gallery collections
- Each gallery has its own "Active Gallery" toggle
- Controls if THAT specific gallery is displayed on the gallery page
- Multiple documents can exist

---

## 🎯 Quick Access

**Click this URL to go directly to the correct settings:**
```
http://localhost:3333/structure/gallerySettings
```

---

## 🖼️ Visual Guide

### ❌ WRONG - What You're Currently Viewing:
```
Sanity Studio
├── Conference Gallery 📸  ← You are here (WRONG)
│   ├── Gallery Item 1
│   │   └── Active Gallery (toggle)  ← This only affects this gallery item
│   ├── Gallery Item 2
│   └── Gallery Item 3
```

### ✅ CORRECT - Where You Should Go:
```
Sanity Studio
├── Gallery Settings ⚙️  ← Go here (CORRECT)
│   ├── Show Gallery in Navigation  ← This hides the link from menu
│   ├── Navigation Label
│   └── Show on Homepage
```

---

## 🔧 Alternative: Use Command Line

If you can't find the Gallery Settings in Sanity Studio, use this command:

```bash
node toggle-gallery-visibility.js
```

This will toggle the navigation visibility directly.

---

## 📝 Summary

**Problem:** You toggled the wrong field
- ❌ You toggled: "Active Gallery" on a gallery item
- ✅ You need to toggle: "Show Gallery in Navigation" in Gallery Settings

**Solution:** Go to the correct document
- **Correct URL:** http://localhost:3333/structure/gallerySettings
- **Look for:** "Gallery Settings" ⚙️ in the sidebar
- **Toggle:** "Show Gallery in Navigation"
- **Publish:** Click the Publish button

---

## 🚀 Try This Now

1. Open: http://localhost:3333/structure/gallerySettings
2. Find: "Show Gallery in Navigation" toggle
3. Turn it OFF
4. Click "Publish"
5. Wait 30 seconds
6. Refresh your website

The Gallery link should disappear from the More dropdown menu!

