# Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Run Database Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

## Step 4: Set Up Storage Bucket

1. In Supabase dashboard, go to Storage
2. Create a new bucket named `applications`
3. Set it to **Public** (or configure RLS policies as needed)
4. This bucket will store resumes and cover letters

## Step 5: Create Initial Admin User

After running migrations, you'll need to create an admin user:

1. Sign up through the `/login` page (this creates an auth user)
2. Go to Supabase SQL Editor and run:

```sql
-- Update the user role to Admin (replace 'user-email@example.com' with your email)
UPDATE users 
SET role = 'Admin' 
WHERE email = 'user-email@example.com';
```

Or manually update the `users` table in the Supabase dashboard.

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: (Optional) Set Up Email Notifications

The application structure supports email notifications, but you'll need to:

1. Set up an email service (SendGrid, Resend, AWS SES, etc.)
2. Create API routes in `app/api/emails/` to handle sending emails
3. Add email triggers in the application workflow (e.g., when an application is submitted, interview scheduled, etc.)

Example email triggers:
- Application submitted → notify HR and hiring manager
- Interview scheduled → notify applicant and interviewers
- Offer sent → notify applicant
- Offer accepted → notify HR, payroll, IT

## User Roles

- **Applicant**: Default role for new signups. Can view jobs and submit applications.
- **HR**: Can see all jobs and applicants across all schools.
- **Admin**: Full system access, can manage settings.
- **Principal**: Can see applicants for their school.
- **HiringManager**: Can see applicants for jobs they're assigned to.
- **Interviewer**: Can provide feedback on assigned interviews.

## Next Steps

1. Create job postings through `/admin/jobs/new`
2. Publish jobs to make them visible on `/careers`
3. Test the application flow:
   - Apply as an applicant
   - Review applications as HR/Hiring Manager
   - Schedule interviews
   - Add interview feedback
   - Create offers

## Troubleshooting

### Storage Upload Errors

If file uploads fail:
1. Check that the `applications` bucket exists in Supabase Storage
2. Verify the bucket is set to public or has proper RLS policies
3. Check file size limits (Supabase default is 50MB)

### Authentication Issues

If you can't sign in:
1. Verify your Supabase credentials in `.env.local`
2. Check that email confirmation is disabled in Supabase Auth settings (for development)
3. Ensure the `users` table has a corresponding record for your auth user

### Database Errors

If you see database errors:
1. Verify all migrations have been run
2. Check that RLS policies are correctly set up
3. Ensure foreign key relationships are intact

