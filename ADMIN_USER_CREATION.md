# Admin User Creation Guide

## Overview

HR and Executive Director (or any Admin) can now create new admin users directly through the web interface, without needing database access!

## How to Access

1. **Log in** as HR or Admin user
2. Go to **Admin > Jobs** page
3. Click on **👥 Users** button in the navigation menu
4. Or visit directly: `http://localhost:3000/admin/users`

## Creating a New Admin User

### Step 1: Click "Create Admin User"
On the User Management page, click the blue "Create Admin User" button in the top right.

### Step 2: Fill in User Details

**Required Fields:**
- **Full Name**: The user's full name (e.g., "John Doe")
- **Email**: The user's email address (must be unique)
- **Temporary Password**: A temporary password (minimum 6 characters)
  - User can change this after first login
- **Role**: Select the appropriate role

**Available Roles:**
- **Admin**: Full system access
- **HR**: Can manage all jobs and applicants across all schools
- **Principal**: Can manage applicants for their assigned school
- **Hiring Manager**: Can manage applicants for jobs they're assigned to
- **Interviewer**: Can provide feedback on assigned interviews

**School Site** (required for Principal and Hiring Manager):
- Harvest
- Wakanda
- Sankofa

### Step 3: Create User
Click "Create User" button and the system will:
1. ✅ Create auth account in Supabase
2. ✅ Auto-confirm email (no verification needed)
3. ✅ Assign the selected role
4. ✅ Link to school site (if applicable)

## After Creation

The new user can immediately:
1. Go to the login page
2. Enter their email and temporary password
3. Log in and start working
4. Change their password in account settings (recommended)

## User Management Features

### View All Users
The Users page shows a table with:
- Name
- Email
- Role (color-coded badges)
- School assignment
- Creation date

### Navigation
Quick navigation bar at the top:
- 📋 **Jobs**: Manage job postings
- 👥 **Users**: Manage admin users (you are here)
- 📅 **Schedule Interview**: Schedule interviews

## Email Notifications

When admin users change application statuses, both HR and Executive Director receive notifications:

**Current Recipients:**
- **HR**: `mwelch-collins@thebestacademy.org`
- **Executive Director**: `epeterson@thebestacademy.org`

**Notifications Sent For:**
- New application submissions
- Status changes (Review, Interview, Offer, etc.)
- Interview scheduling
- Job offers
- New hires

## Security

- ✅ Only HR and Admin users can create new users
- ✅ Only HR and Admin users can view the user management page
- ✅ Uses Supabase service role key for secure user creation
- ✅ Email is auto-confirmed (no verification email needed)
- ✅ Users are created with proper role-based access

## Troubleshooting

### "User already exists" Error
- Check if the email is already registered
- Have the user log in with their existing credentials

### "Service role key not configured" Error
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Get it from: Supabase Dashboard > Settings > API > service_role key

### Can't Access User Management
- Verify you're logged in as HR or Admin
- Check your role in the database users table

## Example: Creating a Hiring Manager

1. Click "Create Admin User"
2. Fill in:
   - **Name**: Sarah Johnson
   - **Email**: sjohnson@harvest.org
   - **Password**: TempPass123!
   - **Role**: Hiring Manager
   - **School Site**: Harvest
3. Click "Create User"
4. ✅ Sarah can now log in and manage applicants for Harvest jobs

## Example: Creating an HR User

1. Click "Create Admin User"
2. Fill in:
   - **Name**: Michael Brown
   - **Email**: mbrown@hbajobs.org
   - **Password**: SecureTemp456!
   - **Role**: HR
   - **School Site**: (leave empty - HR has access to all schools)
3. Click "Create User"
4. ✅ Michael can now log in with full HR access

## Quick Access

**Production URL** (when deployed):
- User Management: `https://hbajobs.org/admin/users`

**Development URL**:
- User Management: `http://localhost:3000/admin/users`

---

For technical support, contact the system administrator.


