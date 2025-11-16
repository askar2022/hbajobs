# HBA Jobs - Automated Email Flow

## 📧 Complete Email Flow Documentation

This document outlines all automated emails sent throughout the application process.

---

## 🔄 Email Flow Overview

```
APPLICANT SUBMITS APPLICATION
    ↓
✉️ Email 1: "Application Received" (to Applicant)
✉️ Email 2: "New Application Alert" (to HR)
    ↓
HR REVIEWS & CHANGES STATUS
    ↓
✉️ Email 3: "Application Under Review" (to Applicant)
    ↓
HR SCHEDULES INTERVIEW
    ↓
✉️ Email 4: "Interview Scheduled" (to Applicant)
    ↓
INTERVIEW HAPPENS (manual communication)
    ↓
HR EXTENDS OFFER (Changes status to "Offer")
    ↓
✉️ Email 5: "Job Offer Extended" (to Applicant)
    ↓
APPLICANT ACCEPTS
    ↓
HR MARKS AS HIRED (Changes status to "Hired")
    ↓
✉️ Email 6: "Welcome to HBA!" (to Applicant)
```

---

## 📬 Detailed Email Descriptions

### 1. Application Received (Automated ✅)

**Trigger:** When applicant submits application form

**Sent To:** Applicant

**Subject:** `Application Received - [Job Title]`

**Content:**
- Thank you message
- Job title and school site
- Link to track application status
- HR contact information

**Design:** Blue gradient header with HBA branding

---

### 2. New Application Alert (Automated ✅)

**Trigger:** When applicant submits application form

**Sent To:** HR Team (configured email)

**Subject:** `New Application - [Job Title] at [School]`

**Content:**
- Applicant name and email
- Position and school
- Submission timestamp
- Direct link to review application

**Design:** Green gradient header (HR notification style)

---

### 3. Application Status Update (Automated ✅)

**Trigger:** When HR changes application status (except "Offer" and "Hired")

**Sent To:** Applicant

**Subject:** `Application Update - [Job Title]`

**Content:**
- Current status badge
- Optional comment from HR
- Link to view full application details

**Statuses That Trigger This Email:**
- Submitted
- Under Review
- Phone Screen
- Interview
- Rejected
- Withdrawn

**Design:** Blue gradient header with status badge

---

### 4. Interview Scheduled (Automated ✅)

**Trigger:** When HR schedules an interview

**Sent To:** Applicant

**Subject:** `Interview Scheduled - [Job Title]`

**Content:**
- Interview type/stage
- Date and time (formatted)
- Location (if in-person)
- Zoom/meeting link (if virtual)
- Preparation tips
- Link to application

**Design:** Blue gradient header with 🎉 celebration icon

---

### 5. Job Offer Extended (Automated ✅)

**Trigger:** When HR changes status to "Offer"

**Sent To:** Applicant

**Subject:** `🎉 Job Offer - [Job Title]`

**Content:**
- Congratulations message with 🎉 emoji
- Position and school
- Start date (from HR comment field)
- Salary (optional, from HR comment)
- Next steps for accepting
- Link to view details

**Design:** Green gradient header (success/offer style)

**HR Note:** Include start date in the comment field when changing status to "Offer"

---

### 6. Welcome to HBA (Automated ✅)

**Trigger:** When HR changes status to "Hired"

**Sent To:** New Hire

**Subject:** `Welcome to HBA! - [Job Title]`

**Content:**
- Welcome message with 🌟 emoji
- Position and school confirmation
- Start date (from HR comment field)
- Pre-start checklist:
  - Complete onboarding paperwork
  - Submit required documents
  - Background check
  - Review employee handbook
- What to expect on first day
- HR contact for questions

**Design:** Purple gradient header (welcome/celebration style)

**HR Note:** Include start date in the comment field when changing status to "Hired"

---

## 🎨 Email Design Features

All emails include:
- ✅ HBA branding and colors
- ✅ Mobile-responsive design
- ✅ Professional gradient headers
- ✅ Clear call-to-action buttons
- ✅ School names and logos
- ✅ Footer with copyright and school info

---

## ⚙️ How to Use (For HR Staff)

### Scheduling an Interview

1. Go to application details page
2. Click **"Schedule Interview"**
3. Fill in:
   - Interview type (Phone Screen, Panel, etc.)
   - Date and time
   - Location OR Zoom link
   - Select interviewers
4. Click **"Schedule Interview"**
5. ✉️ **Email automatically sent** to applicant

### Extending a Job Offer

1. Go to application details
2. Change status to **"Offer"**
3. In comment field, type:
   ```
   Start Date: January 15, 2025
   Salary: $65,000/year
   ```
4. Click **"Update Status"**
5. ✉️ **Job offer email automatically sent**

### Marking as Hired

1. After applicant accepts offer
2. Change status to **"Hired"**
3. In comment field, type:
   ```
   Start Date: January 15, 2025
   ```
4. Click **"Update Status"**
5. ✉️ **Welcome email automatically sent**

---

## 🔧 Configuration

### Environment Variables Required

```env
# Resend (Email Service)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=notifications@hbajobs.org

# HR Notifications
HR_NOTIFICATION_EMAIL=hr@hbajobs.org

# App URL (for email links)
NEXT_PUBLIC_APP_URL=https://hbajobs.vercel.app
```

### Email Sending Service

- **Provider:** Resend.com
- **Domain:** hbajobs.org (must be verified)
- **From Address:** notifications@hbajobs.org
- **HR Address:** Configurable via environment variable

---

## 📊 Email Status Mapping

| Application Status | Email Sent                    | Recipient  |
|--------------------|------------------------------|------------|
| Submitted          | Application Received         | Applicant  |
| Submitted          | New Application Alert        | HR         |
| Under Review       | Application Status Update    | Applicant  |
| Phone Screen       | Interview Scheduled          | Applicant  |
| Interview          | Interview Scheduled          | Applicant  |
| **Offer**          | **Job Offer Extended** 🎉    | Applicant  |
| **Hired**          | **Welcome to HBA!** 🌟       | New Hire   |
| Rejected           | Application Status Update    | Applicant  |

---

## ❌ What's NOT Automated

The following remain **manual** (HR sends directly):

- Interview feedback discussions
- Salary negotiations
- Follow-up questions
- Schedule changes/cancellations
- Detailed rejection reasons
- Reference check requests
- Benefits enrollment information

**Why?** These require personal touch and vary case-by-case.

---

## 🐛 Troubleshooting

### Emails not being sent?

1. **Check environment variables:**
   - Is `RESEND_API_KEY` set?
   - Is `HR_NOTIFICATION_EMAIL` correct?
   
2. **Check Resend dashboard:**
   - Is domain verified?
   - Are there any delivery issues?
   
3. **Check browser console:**
   - Are there any error messages?

### Applicant not receiving emails?

1. Ask them to check spam/junk folder
2. Verify email address in application
3. Check Resend delivery logs

### Want to test emails?

Use the test endpoint:
```
GET /api/test-email
```

---

## 📈 Future Enhancements

Possible additions (not yet implemented):

- 📱 SMS notifications
- 🔔 Push notifications (PWA)
- 📅 Calendar invite attachments
- 📄 PDF offer letter attachments
- 🔄 Email templates customization in admin
- 📊 Email analytics dashboard

---

## 📞 Support

For email configuration issues:
- Check `SETUP_EMAIL.md` for Resend setup
- Contact IT support for domain/DNS issues
- See Resend documentation: https://resend.com/docs

---

**All emails are sent automatically to keep applicants informed and reduce HR workload!** ✉️✨

