# 🚀 Quick Deployment Checklist

Use this checklist before and after deploying to production.

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `RESEND_API_KEY` is set
- [ ] `HR_NOTIFICATION_EMAIL` is set
- [ ] All values are from PRODUCTION Supabase project (not development)

### 2. Database Setup
- [ ] All 5 migrations have been run on production database
- [ ] RLS policies are enabled on all tables
- [ ] Test admin user exists in `users` table with role 'Admin' or 'HR'

### 3. Storage Configuration
- [ ] Supabase Storage bucket `applications` exists
- [ ] Bucket is set to public access
- [ ] RLS policies for storage are applied

### 4. Email Configuration
- [ ] Resend account created
- [ ] Domain added to Resend
- [ ] Domain verified (all DNS records added)
- [ ] Test email sent successfully via `/api/test-email`

### 5. Code Quality
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint warnings (or acceptable warnings documented)

### 6. Git Repository
- [ ] Code committed to Git
- [ ] Pushed to remote repository (GitHub/GitLab/Bitbucket)
- [ ] `.env.local` is NOT committed (check `.gitignore`)

---

## 🚀 Deployment Steps (Vercel - Recommended)

### One-Time Setup
- [ ] Sign up/log in to [Vercel](https://vercel.com)
- [ ] Connect your Git provider (GitHub/GitLab/Bitbucket)

### Each Deployment
- [ ] Import project from Git
- [ ] Configure environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Wait for deployment to complete
- [ ] Note your deployment URL (e.g., `your-app.vercel.app`)

---

## 🧪 Post-Deployment Testing

### Critical Paths to Test

#### 1. Authentication
- [ ] Visit `/login`
- [ ] Sign up with a new account
- [ ] Verify email confirmation (if enabled)
- [ ] Log in with created account
- [ ] Log out
- [ ] Log back in

#### 2. Public Job Listings
- [ ] Visit `/careers`
- [ ] View list of jobs
- [ ] Click on a job to view details
- [ ] Verify job description displays correctly

#### 3. Job Application (Logged In User)
- [ ] Log in as a regular user
- [ ] Navigate to a job posting
- [ ] Click "Apply Now"
- [ ] Fill out application form
- [ ] Upload resume (PDF or DOCX)
- [ ] Submit application
- [ ] Check for success message
- [ ] Verify redirect to success page

#### 4. Email Notifications
- [ ] Check applicant email for "Application Received" email
- [ ] Check HR email for "New Application" notification
- [ ] Verify all email content is correct (job title, applicant name, etc.)

#### 5. My Applications (Applicant Portal)
- [ ] Log in as applicant
- [ ] Visit `/my-applications`
- [ ] Verify submitted application appears
- [ ] Click on application to view details
- [ ] Verify all information is correct
- [ ] Check that resume can be downloaded

#### 6. Admin Dashboard
- [ ] Log in as Admin/HR user
- [ ] Visit `/admin/jobs`
- [ ] Verify all jobs are listed
- [ ] Click "Create Job" and create a test job
- [ ] Verify job appears in list

#### 7. View Applications (Admin)
- [ ] In admin dashboard, click on a job
- [ ] View applications for that job
- [ ] Verify application details are correct
- [ ] Download applicant's resume
- [ ] Verify resume downloads correctly

#### 8. Application Status Updates
- [ ] Select an application
- [ ] Change status (e.g., to "Under Review")
- [ ] Add a comment
- [ ] Submit status update
- [ ] Check applicant email for "Application Update" notification
- [ ] Verify email contains status and comment

#### 9. Edit Job Posting
- [ ] In admin dashboard, click "Edit" on a job
- [ ] Modify job details
- [ ] Save changes
- [ ] Verify changes appear on public job listing
- [ ] Verify changes appear in admin dashboard

#### 10. Schedule Interview
- [ ] View an application in admin panel
- [ ] Click "Schedule Interview"
- [ ] Fill out interview details
- [ ] Select interview participants
- [ ] Submit
- [ ] Verify interview is created

---

## 🔍 Performance & Monitoring

### Initial Checks
- [ ] Run Google Lighthouse audit
  - Performance score > 90
  - Accessibility score > 90
  - Best Practices score > 90
  - SEO score > 90
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### Ongoing Monitoring
- [ ] Set up error monitoring (Vercel dashboard or Sentry)
- [ ] Check logs daily for first week
- [ ] Monitor email delivery rates
- [ ] Track application submission success rate

---

## 🛡️ Security Checks

- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Environment variables are not exposed in client-side code
- [ ] Check browser console for no exposed secrets
- [ ] RLS policies are working (try accessing data you shouldn't)
- [ ] File upload accepts only allowed file types
- [ ] Test with invalid/malicious inputs

---

## 📱 Optional: Custom Domain

If using a custom domain:

- [ ] Domain purchased and DNS accessible
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured (A/CNAME records)
- [ ] SSL certificate issued (automatic, may take 30-60 minutes)
- [ ] Test site loads on custom domain
- [ ] Update Resend sending domain (if different)
- [ ] Update any hardcoded URLs in emails

---

## ✅ Final Verification

Once all above tests pass:

- [ ] Announce to team that system is live
- [ ] Create first real job posting
- [ ] Monitor for first real application
- [ ] Document any issues or improvements needed
- [ ] Schedule first maintenance check (1 week)

---

## 📝 Deployment Notes

**Deployment Date:** _____________

**Deployment URL:** _____________

**Custom Domain (if any):** _____________

**Team Members Notified:**
- [ ] HR Team
- [ ] IT Team
- [ ] Management
- [ ] End Users

**Known Issues (if any):**
- _____________
- _____________

**Follow-up Tasks:**
- _____________
- _____________

---

## 🆘 Rollback Plan

If critical issues are found after deployment:

### Vercel:
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Find the last working deployment
5. Click "..." menu → "Promote to Production"

### Manual:
1. Revert Git to previous commit: `git revert HEAD`
2. Push to repository
3. Redeploy

---

## 📞 Emergency Contacts

**Technical Issues:**
- Developer: _____________
- Email: _____________

**Supabase Issues:**
- Dashboard: https://app.supabase.com
- Support: support@supabase.com

**Email Issues (Resend):**
- Dashboard: https://resend.com
- Support: support@resend.com

**Hosting Issues (Vercel):**
- Dashboard: https://vercel.com
- Support: https://vercel.com/support

---

**🎉 Congratulations on your deployment!**

Remember: It's normal to have minor issues on first deployment. Monitor closely for the first 24-48 hours and be ready to make quick fixes if needed.

