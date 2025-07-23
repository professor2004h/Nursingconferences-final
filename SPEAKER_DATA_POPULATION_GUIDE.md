# 🎤 Speaker Data Population Guide

## ✅ Complete Test Data Ready for Population

I have created comprehensive test data for **8 conference speakers** with all required and optional fields populated. The data is ready to be added to your Sanity CMS backend.

---

## 🚀 **Method 1: Automated Script (Recommended)**

### **Step 1: Run the Population Script**
```bash
# Navigate to SanityBackend directory
cd SanityBackend

# Install dependencies if needed
npm install @sanity/client

# Run the speaker data creation script
node create-speaker-data.js
```

### **Step 2: Verify Data Population**
After running the script, you should see output like:
```
Creating speaker documents...
Created speaker: Dr. Maria Elena Rodriguez (speaker-id-1)
Created speaker: Prof. James Wei Chen (speaker-id-2)
...
Successfully created 8 speaker documents!
```

---

## 🎯 **Method 2: Manual Entry via Sanity Studio**

If you prefer manual entry or the script doesn't work, follow these steps:

### **Access Sanity Studio**
1. **Open Sanity Studio**: http://localhost:3333/structure/speakers
2. **Navigate to**: "Conference Speakers" section
3. **Click**: "Create new Conference Speaker"

### **Speaker Data to Enter**

#### **🎯 KEYNOTE SPEAKER 1**
- **Full Name**: Dr. Maria Elena Rodriguez
- **Title/Position**: Professor of Biomedical Engineering & Director of Neural Interface Lab
- **Institution**: Stanford University School of Medicine
- **Country**: United States
- **Speaker Category**: keynote
- **Display Order**: 1
- **Is Keynote Speaker**: ✅ (checked)
- **Featured on Homepage**: ✅ (checked)
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 25
- **Area of Specialization**: Neural Interfaces & Brain-Computer Interface Technology
- **Session Title**: The Future of Neural Interfaces: Bridging Mind and Machine
- **Session Abstract**: This keynote will explore the latest advances in neural interface technology and their potential to transform healthcare. We will discuss current challenges in brain-computer interfaces, breakthrough innovations in neural signal processing, and the ethical considerations surrounding direct brain-machine communication. The presentation will include live demonstrations of cutting-edge neural prosthetics and their real-world applications.
- **Email**: maria.rodriguez@stanford.edu
- **LinkedIn**: https://linkedin.com/in/maria-rodriguez-bioeng
- **ORCID ID**: 0000-0001-2345-6789
- **ResearchGate**: https://researchgate.net/profile/Maria-Rodriguez
- **Website**: https://med.stanford.edu/profiles/maria-rodriguez
- **Session Date**: 2024-06-15T09:00:00.000Z
- **Session Location**: Main Auditorium
- **Key Achievements**: 
  - IEEE Fellow for contributions to biomedical engineering and neural interfaces
  - National Academy of Engineering Member (2020)
  - Winner of the 2023 IEEE Engineering in Medicine and Biology Award
  - Founder of three successful biotech startups with combined valuation of $500M
  - NIH Director's Pioneer Award recipient (2019)
- **Notable Publications**:
  - Rodriguez, M.E. et al. (2023). "Advanced Neural Interface Technologies for Clinical Applications." Nature Biomedical Engineering, 7(4), 234-248.
  - Rodriguez, M.E. & Smith, J. (2022). "Ethical Frameworks for Brain-Computer Interfaces in Clinical Practice." Science Translational Medicine, 14(632), eabm7890.

#### **🎯 KEYNOTE SPEAKER 2**
- **Full Name**: Prof. James Wei Chen
- **Title/Position**: Director of AI Research Institute & Professor of Computer Science
- **Institution**: Massachusetts Institute of Technology (MIT)
- **Country**: United States
- **Speaker Category**: keynote
- **Display Order**: 2
- **Is Keynote Speaker**: ✅ (checked)
- **Featured on Homepage**: ✅ (checked)
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 20
- **Area of Specialization**: Artificial Intelligence in Healthcare & Medical Machine Learning
- **Session Title**: AI-Powered Healthcare: Transforming Patient Care Through Intelligent Systems
- **Session Abstract**: Explore how artificial intelligence is revolutionizing healthcare delivery, from diagnostic imaging to personalized treatment plans. This presentation will showcase real-world applications of AI in clinical settings, discuss the challenges of implementing AI in healthcare systems, and present a vision for the future of AI-assisted medicine.
- **Email**: jwchen@mit.edu
- **LinkedIn**: https://linkedin.com/in/james-chen-ai-healthcare
- **ORCID ID**: 0000-0002-3456-7890
- **ResearchGate**: https://researchgate.net/profile/James-Chen-MIT
- **Website**: https://csail.mit.edu/person/james-chen
- **Session Date**: 2024-06-15T14:00:00.000Z
- **Session Location**: Main Auditorium

#### **⭐ INVITED SPEAKER 1**
- **Full Name**: Dr. Sarah Michelle Kim
- **Title/Position**: Chief Medical Officer & Director of Precision Oncology
- **Institution**: Johns Hopkins Hospital & Sidney Kimmel Comprehensive Cancer Center
- **Country**: United States
- **Speaker Category**: invited
- **Display Order**: 3
- **Featured on Homepage**: ✅ (checked)
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 18
- **Area of Specialization**: Precision Medicine, Genomic Oncology & Rare Cancer Research
- **Session Title**: Precision Medicine in Oncology: From Genomics to Personalized Treatment
- **Email**: skim@jhmi.edu
- **LinkedIn**: https://linkedin.com/in/sarah-kim-md-precision-oncology
- **ORCID ID**: 0000-0003-4567-8901
- **Session Date**: 2024-06-16T10:30:00.000Z
- **Session Location**: Conference Room A

#### **⭐ INVITED SPEAKER 2**
- **Full Name**: Prof. Ahmed Hassan Al-Rashid
- **Title/Position**: Professor of Global Health & Director of Centre for Tropical Medicine
- **Institution**: University of Oxford, Nuffield Department of Medicine
- **Country**: United Kingdom
- **Speaker Category**: invited
- **Display Order**: 4
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 22
- **Area of Specialization**: Global Health, Infectious Disease Control & Health Systems Strengthening
- **Session Title**: Building Resilient Health Systems: Lessons from the Global South
- **Email**: ahmed.hassan@ndm.ox.ac.uk
- **LinkedIn**: https://linkedin.com/in/ahmed-hassan-globalhealth-oxford
- **ORCID ID**: 0000-0004-5678-9012
- **Session Date**: 2024-06-16T15:00:00.000Z
- **Session Location**: Conference Room B

#### **🎪 PLENARY SPEAKER**
- **Full Name**: Dr. Lisa Wang-Chen
- **Title/Position**: Director of Digital Health Innovation & Chief Medical Officer
- **Institution**: Google Health & DeepMind Health
- **Country**: United States
- **Speaker Category**: plenary
- **Display Order**: 5
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 15
- **Area of Specialization**: Digital Health Technology, AI in Healthcare & Health Tech Innovation
- **Session Title**: Scaling Digital Health Solutions: From Innovation to Implementation
- **Email**: lwang@google.com
- **LinkedIn**: https://linkedin.com/in/lisa-wang-digitalhealth-google
- **ORCID ID**: 0000-0005-6789-0123
- **Session Date**: 2024-06-17T09:00:00.000Z
- **Session Location**: Main Auditorium

#### **💬 SESSION SPEAKER**
- **Full Name**: Dr. Michael James Thompson
- **Title/Position**: Associate Professor of Biostatistics & Director of Clinical Trials Methodology
- **Institution**: Harvard T.H. Chan School of Public Health
- **Country**: United States
- **Speaker Category**: session
- **Display Order**: 6
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 12
- **Area of Specialization**: Biostatistics, Clinical Trial Design & Adaptive Trial Methodology
- **Session Title**: Advanced Statistical Methods for Clinical Research: Adaptive Designs and Bayesian Approaches
- **Email**: mthompson@hsph.harvard.edu
- **LinkedIn**: https://linkedin.com/in/michael-thompson-biostatistics
- **ORCID ID**: 0000-0006-7890-1234
- **Session Date**: 2024-06-17T14:00:00.000Z
- **Session Location**: Conference Room C

#### **🛠️ WORKSHOP LEADER**
- **Full Name**: Dr. Elena Mikhailovna Petrov
- **Title/Position**: Senior Research Scientist & Head of Regulatory Strategy
- **Institution**: European Medicines Agency (EMA)
- **Country**: Netherlands
- **Speaker Category**: workshop
- **Display Order**: 7
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 16
- **Area of Specialization**: Regulatory Science, Drug Development & Innovative Therapy Approval Pathways
- **Session Title**: Navigating Regulatory Pathways: A Hands-on Workshop for Innovative Therapies
- **Email**: elena.petrov@ema.europa.eu
- **LinkedIn**: https://linkedin.com/in/elena-petrov-ema-regulatory
- **ORCID ID**: 0000-0007-8901-2345
- **Session Date**: 2024-06-18T10:00:00.000Z
- **Session Location**: Workshop Room 1

#### **🎭 PANEL MODERATOR**
- **Full Name**: Prof. David Alexander Johnson
- **Title/Position**: Editor-in-Chief, Medical Innovation Journal & Professor of Medicine
- **Institution**: University of California, San Francisco (UCSF)
- **Country**: United States
- **Speaker Category**: moderator
- **Display Order**: 8
- **Active Speaker**: ✅ (checked)
- **Years of Experience**: 20
- **Area of Specialization**: Medical Research, Scientific Publishing & Research Ethics
- **Session Title**: Panel Discussion: The Future of Medical Research - Innovation, Ethics, and Open Science
- **Email**: david.johnson@ucsf.edu
- **LinkedIn**: https://linkedin.com/in/david-johnson-editor-ucsf
- **ORCID ID**: 0000-0008-9012-3456
- **Session Date**: 2024-06-18T15:30:00.000Z
- **Session Location**: Panel Discussion Hall

---

## 📸 **Profile Images**

For each speaker, you'll need to upload a professional headshot. You can:

1. **Use placeholder images** from services like:
   - https://thispersondoesnotexist.com/ (AI-generated faces)
   - https://unsplash.com/s/photos/professional-headshot
   - https://pixabay.com/images/search/business-portrait/

2. **Upload requirements**:
   - Format: JPG or PNG
   - Minimum size: 400x400px
   - Aspect ratio: Square (1:1) preferred
   - File size: Under 2MB

---

## ✅ **Verification Steps**

### **1. Check Sanity Studio**
- Visit: http://localhost:3333/structure/speakers
- Verify all 8 speakers are listed
- Check that all fields are populated correctly

### **2. Test Frontend Display**
- Visit: http://localhost:3000/speakers
- Verify speakers appear in correct categories
- Test filtering functionality
- Click on speaker cards to test modals

### **3. Verify API Response**
- Visit: http://localhost:3000/api/speakers
- Check that JSON response contains all 8 speakers
- Verify all fields are present in the response

---

## 🎯 **Expected Results**

After population, you should have:

- **2 Keynote Speakers** (featured on homepage)
- **2 Invited Speakers** (1 featured on homepage)
- **1 Plenary Speaker**
- **1 Session Speaker**
- **1 Workshop Leader**
- **1 Panel Moderator**

**Total: 8 speakers** with comprehensive profiles including:
- Complete biographical information
- Session details with dates and locations
- Professional achievements and publications
- Contact information and social media links
- Years of experience and specializations

---

## 🚨 **Troubleshooting**

### **Script Issues**
If the automated script fails:
1. Check that Sanity backend is running: `cd SanityBackend && npm run dev`
2. Verify the project ID and token in the script
3. Check network connectivity to Sanity
4. Use manual entry method instead

### **Manual Entry Issues**
If manual entry has problems:
1. Ensure all required fields are filled
2. Check that speaker categories match exactly
3. Verify date formats are correct
4. Save each speaker before moving to the next

### **Frontend Display Issues**
If speakers don't appear on the frontend:
1. Check that `isActive` is set to `true` for all speakers
2. Verify the API endpoint is working: http://localhost:3000/api/speakers
3. Check browser console for JavaScript errors
4. Restart the Next.js development server

---

## 🎉 **Success Confirmation**

You'll know the population was successful when:

1. ✅ All 8 speakers appear in Sanity Studio
2. ✅ Speakers page loads without errors
3. ✅ Category filtering works correctly
4. ✅ Speaker modals display complete information
5. ✅ Featured speakers appear on homepage (if implemented)

The speaker data is now ready for your conference website! 🚀
