# Email Notifications Setup Guide

This guide will help you set up email notifications using Resend for HBA Jobs.

---

## Prerequisites

- ✅ Domain: **hbajobs.org** (already registered)
- ✅ Resend account (sign up at [resend.com](https://resend.com))

---

## Step 1: Configure Resend

### 1.1 Sign Up / Log In to Resend
Go to [resend.com](https://resend.com) and sign up or log in.

### 1.2 Verify Your Domain

1. Go to **Domains** in the Resend dashboard
2. Click **"Add Domain"**
3. Enter: **hbajobs.org**
4. Resend will provide DNS records (SPF, DKIM, DMARC)
5. Add these DNS records to your domain registrar:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT  
Name: resend._domainkey
Value: [provided by Resend]

Type: TXT
Name: _dmarc
Value: [provided by Resend]
```

6. Wait for verification (usually takes 5-30 minutes)
7. Once verified, you'll see a ✅ green checkmark

### 1.3 Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click **"Create API Key"**
3. Name it: **HBA Jobs Production**
4. Copy the API key (starts with `re_...`)
5. ⚠️ **Save it securely** - you won't see it again!

---

## Step 2: Configure Environment Variables

### 2.1 Add to `.env.local`

Create or update `.env.local` in your project root:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# Email Settings
RESEND_FROM_EMAIL=notifications@hbajobs.org
HR_NOTIFICATION_EMAIL=hr@hbajobs.org

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 2.2 Update for Production

When deploying to production, update:
```bash
NEXT_PUBLIC_APP_URL=https://hbajobs.org
```

---

## Step 3: Email Notifications Overview

### Emails Sent Automatically:

#### 1. **Application Submitted**
- **To Applicant**: Confirmation email with application tracking link
- **To HR Team**: Notification with applicant details and review link

#### 2. **Status Update**
- **To Applicant**: Email when application status changes
- Includes: New status, optional comment from HR

#### 3. **Interview Scheduled** (Coming Soon)
- **To Applicant**: Interview details, date/time, location, join link

---

## Step 4: Customize Email Templates

Email templates are in `lib/email.ts`. You can customize:

### Change "From" Name:
```typescript
from: 'HBA Jobs <notifications@hbajobs.org>'
```

### Update HR Email:
Change in `.env.local`:
```bash
HR_NOTIFICATION_EMAIL=hiring@hbajobs.org
```

### Customize Email Content:
Edit templates in `lib/email.ts`:
- `applicationSubmitted`
- `statusUpdate`
- `interviewScheduled`
- `hrNotification`

---

## Step 5: Test Emails

### Test Application Submission:
1. Go to Careers page
2. Apply to a job
3. Check:
   - ✅ Applicant receives confirmation email
   - ✅ HR receives notification email

### Test Status Update:
1. As Admin, go to Application Review
2. Change status to "Under Review"
3. Add a comment (optional)
4. Check: Applicant receives status update email

---

## Step 6: Monitor Email Delivery

### Resend Dashboard:
1. Go to **Logs** in Resend dashboard
2. View all sent emails
3. Check delivery status:
   - ✅ **Delivered**: Successfully sent
   - ⏳ **Queued**: Being processed
   - ❌ **Failed**: Check error details

### Debug Issues:
Check server logs for email errors:
```bash
npm run dev
# Look for: "Email sent successfully" or "Email send error"
```

---

## Step 7: Production Deployment

### Vercel/Other Platform:

1. Add environment variables to your deployment platform:
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=notifications@hbajobs.org
HR_NOTIFICATION_EMAIL=hr@hbajobs.org
NEXT_PUBLIC_APP_URL=https://hbajobs.org
```

2. Redeploy your application

3. Test in production!

---

## Troubleshooting

### "Email not configured" Error
**Problem**: Missing `RESEND_API_KEY`  
**Solution**: Add API key to `.env.local` and restart server

### Emails Not Sending
**Check**:
1. ✅ Domain verified in Resend
2. ✅ API key is correct
3. ✅ `.env.local` file exists
4. ✅ Server restarted after adding env vars

### Emails Go to Spam
**Solution**:
1. Verify SPF/DKIM/DMARC records
2. Add domain to sender whitelist
3. Ask recipients to mark as "Not Spam"

---

## Email Flow Diagram

```
Application Submitted
    ├── Save to Database ✅
    ├── Send to Applicant: "Application Received" 📧
    └── Send to HR: "New Application Alert" 📧

Status Changed
    ├── Update Database ✅
    └── Send to Applicant: "Status Update" 📧

Interview Scheduled
    ├── Create Interview Record ✅
    ├── Update Application Status ✅
    └── Send to Applicant: "Interview Scheduled" 📧
```

---

## Need Help?

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Email Templates**: `lib/email.ts`
- **API Routes**: `app/api/emails/`

---

**✨ Email notifications are now configured! Your applicants and HR team will receive automated updates throughout the hiring process.**

