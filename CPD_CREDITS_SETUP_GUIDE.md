# CPD Credits Image Setup Guide

## 🎯 Quick Setup Instructions

### What You Need:
1. **CPD Credits Image** - Your certification/accreditation image
2. **Recommended Size**: 1552 x 531 pixels (2.92:1 aspect ratio)
3. **Format**: JPG, PNG, or WebP

---

## 📍 Step-by-Step Setup

### Step 1: Access Sanity Backend
1. Open your browser
2. Navigate to: **http://localhost:3333**
3. Log in to Sanity Studio

### Step 2: Navigate to Image Section
1. Look for **"Image Section"** in the left sidebar
2. Click on it to open
3. You should see the existing Image Section document

### Step 3: Upload CPD Credits Image
1. Scroll down to find **"CPD Credit Image (Bottom)"**
2. Click on the image upload area
3. Select your CPD credits image file
4. Wait for upload to complete

### Step 4: Add Image Details
1. **Alternative Text** (Required):
   - Enter a description like: "CPD Accreditation - Continuing Professional Development Credits"
   - This helps with accessibility and SEO

2. **Caption** (Optional):
   - Add a caption if you want text below the image
   - Example: "Accredited by CPD Certification Service"

### Step 5: Publish Changes
1. Click the **"Publish"** button at the bottom right
2. Wait for confirmation message
3. Changes will appear on the website within 5 seconds

---

## 🎨 Visual Layout on Homepage

After setup, your homepage will display:

```
┌─────────────────────────────────────────────┐
│         ABOUT US (Left Column)              │
│                                             │
│  - Conference Title                         │
│  - Description                              │
│  - Details                                  │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│    CPD CREDITS (Right Column)               │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │   UNIVERSITY CAROUSEL (16:9)         │ │
│  │   - Oxford, Harvard, etc.            │ │
│  │   - Auto-rotating logos              │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │   CPD CREDITS IMAGE (2.92:1)         │ │
│  │   - Certification Display            │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📐 Image Specifications

### Recommended Dimensions:
- **Width**: 1552 pixels
- **Height**: 531 pixels
- **Aspect Ratio**: 2.92:1 (approximately 3:1)

### Why These Dimensions?
- Matches the carousel width for visual consistency
- Provides enough height for clear visibility
- Maintains professional appearance on all devices

### File Size:
- **Recommended**: Under 500 KB
- **Maximum**: 2 MB
- Compress images for faster loading

### Supported Formats:
- ✅ JPG/JPEG
- ✅ PNG
- ✅ WebP (recommended for best performance)
- ✅ SVG (for vector graphics)

---

## 🔧 Troubleshooting

### Image Not Showing?
1. **Check if image is uploaded**: Go to Sanity Studio → Image Section
2. **Verify Alternative Text**: Make sure you filled in the "Alternative Text" field (required)
3. **Check Publish Status**: Ensure you clicked "Publish" after uploading
4. **Clear Browser Cache**: Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
5. **Wait 5 seconds**: Changes take up to 5 seconds to appear

### Image Looks Stretched or Distorted?
1. **Check Image Dimensions**: Verify your image is close to 2.92:1 ratio
2. **Use Correct Aspect Ratio**: Recommended 1552x531 pixels
3. **Re-upload**: Try uploading a properly sized image

### Image Too Small or Too Large?
- The component automatically scales images to fit the container
- Use `object-contain` mode (already set) to maintain aspect ratio
- Ensure your source image is high resolution (at least 1552px wide)

### Caption Not Showing?
- Caption is optional - it only shows if you enter text
- Check that you filled in the "Caption" field in Sanity
- Publish changes after adding caption

---

## 🎯 Best Practices

### Image Quality:
1. **Use High Resolution**: At least 1552x531 pixels
2. **Optimize File Size**: Compress images before uploading
3. **Use WebP Format**: Best balance of quality and file size
4. **Test on Mobile**: Check how it looks on different screen sizes

### Content Guidelines:
1. **Clear Branding**: Make sure CPD logo/text is clearly visible
2. **Professional Design**: Use official certification graphics
3. **Readable Text**: Ensure any text in the image is legible
4. **Consistent Style**: Match your website's color scheme

### Accessibility:
1. **Always Add Alt Text**: Describe what the image shows
2. **Use Descriptive Text**: "CPD Accreditation Certificate" not just "Image"
3. **Add Caption if Needed**: Provide context for the certification

---

## 📊 Example Alt Text

### Good Examples:
- ✅ "CPD Accreditation - Continuing Professional Development Credits"
- ✅ "Certified by CPD Certification Service - 10 CPD Points"
- ✅ "Nursing Conference 2026 - Accredited CPD Provider"

### Bad Examples:
- ❌ "Image"
- ❌ "CPD"
- ❌ "Logo"

---

## 🚀 Testing Checklist

After uploading your CPD image:

- [ ] Image appears on homepage (http://localhost:3000)
- [ ] Image is below the university carousel
- [ ] Image is not stretched or distorted
- [ ] Image loads quickly (under 2 seconds)
- [ ] Alt text is descriptive and accurate
- [ ] Caption displays correctly (if added)
- [ ] Image looks good on mobile devices
- [ ] Image looks good on tablet devices
- [ ] Image looks good on desktop devices
- [ ] Both columns (About Us and CPD Credits) have equal height

---

## 📱 Responsive Behavior

### Desktop (> 1024px):
- Full width in right column
- Displays below carousel
- Maintains 2.92:1 aspect ratio

### Tablet (768px - 1024px):
- Full width in right column
- Slightly smaller but still prominent
- Maintains aspect ratio

### Mobile (< 768px):
- Full width (single column layout)
- Stacks below About Us section
- Maintains aspect ratio
- May appear smaller but still readable

---

## 🎨 Styling Details

The CPD image includes:
- **White Background**: Clean, professional look
- **Shadow Effect**: Elevated card appearance
- **Rounded Corners**: Matches carousel styling
- **Spacing**: 6-unit margin above (mt-6)
- **Object Fit**: Contains (maintains aspect ratio)

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Documentation**: Review this guide and the main implementation guide
2. **Check Console**: Open browser DevTools (F12) and look for errors
3. **Verify Sanity Data**: Ensure image is properly uploaded in Sanity Studio
4. **Test Different Browsers**: Try Chrome, Firefox, Safari
5. **Clear Cache**: Force refresh with Ctrl+F5

---

## ✅ Success!

Once your CPD image is uploaded and published:
- ✅ It will appear below the university carousel
- ✅ It will maintain proper aspect ratio on all devices
- ✅ It will load quickly and look professional
- ✅ It will be fully accessible with alt text
- ✅ It will match the styling of the carousel above

**Your homepage is now complete with both university logos and CPD certification!** 🎉

---

**Last Updated**: 2025-09-30
**Version**: 1.0
**Status**: ✅ Ready to Use

