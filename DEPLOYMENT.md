# HBA Jobs - Production Deployment Guide

## ✅ Production Build Complete!

Your application has been successfully built for production and is ready to deploy!

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- ✅ Supabase project URL and anon key
- ✅ Resend API key configured and domain verified
- ✅ HR notification email configured
- ✅ `.env.local` file with all required variables (see below)
- ✅ Database migrations applied to your Supabase project
- ✅ Storage bucket `applications` created in Supabase

---

## 🔐 Environment Variables

Your deployment platform will need these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
HR_NOTIFICATION_EMAIL=your_hr_email@example.com
```

**⚠️ IMPORTANT:** Never commit your `.env.local` file to git. It's already in `.gitignore`.

---

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Push your code to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables in the dashboard
   - Click "Deploy"

4. **Or Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts and add environment variables when asked.

5. **Configure Production Environment Variables**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all 4 environment variables listed above
   - Make sure to select "Production" environment

6. **Custom Domain** (optional):
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain (e.g., `hbajobs.org`)
   - Follow DNS configuration instructions

#### Vercel Pricing:
- **Hobby Plan**: FREE for personal projects
- **Pro Plan**: $20/month for production apps

---

### Option 2: Deploy to Netlify

#### Steps:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Configure Environment Variables**:
   - In Netlify Dashboard → Site settings → Environment variables
   - Add all 4 environment variables

#### Netlify Pricing:
- **Starter Plan**: FREE
- **Pro Plan**: $19/month

---

### Option 3: Deploy to Your Own VPS/Server

If you have your own server (e.g., DigitalOcean, AWS, Linode):

#### Requirements:
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx for reverse proxy

#### Steps:

1. **Copy files to your server**:
   ```bash
   rsync -avz --exclude 'node_modules' ./ user@your-server:/path/to/app
   ```

2. **On your server, install dependencies**:
   ```bash
   cd /path/to/app
   npm install --production
   ```

3. **Create `.env.local` file** with your production environment variables

4. **Build the application**:
   ```bash
   npm run build
   ```

5. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "hba-jobs" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx** (example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🗄️ Database Migration

If you haven't already, make sure your Supabase database has all migrations applied:

1. Go to Supabase Dashboard → SQL Editor
2. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_fix_users_insert_policy.sql`
   - `supabase/migrations/004_auto_create_user_profile.sql`
   - `supabase/migrations/005_fix_users_select_policy.sql`

---

## 📦 Storage Configuration

Make sure your Supabase Storage is configured:

1. Go to Supabase Dashboard → Storage
2. Create a bucket named `applications` (if not already created)
3. Set the bucket to **Public** access
4. Configure RLS policies (should be done via migrations)

---

## 📧 Email Configuration

Ensure your Resend domain is verified:

1. Go to [resend.com](https://resend.com) → Domains
2. Check that your domain shows "Verified" status
3. Test emails using the `/api/test-email` endpoint:
   ```
   https://your-domain.com/api/test-email
   ```

---

## 🧪 Post-Deployment Testing

After deployment, test these critical flows:

### 1. **User Signup/Login**
   - Visit `/login`
   - Sign up with a new account
   - Verify user is created in Supabase

### 2. **Job Application**
   - Browse `/careers`
   - Apply to a job
   - Check that both applicant and HR receive emails
   - Verify application appears in "My Applications"

### 3. **Admin Functions**
   - Log in as HR/Admin
   - Create a new job posting
   - View applications
   - Change application status
   - Verify status update email is sent

### 4. **File Upload**
   - Apply to a job with a resume
   - Verify file is uploaded to Supabase Storage
   - Check that resume can be downloaded in admin panel

---

## 🔍 Monitoring & Logs

### Vercel:
- Dashboard → Your Project → Logs
- Real-time function logs
- Analytics available on Pro plan

### Netlify:
- Dashboard → Your Site → Functions → Logs

### Self-Hosted:
- Check PM2 logs: `pm2 logs hba-jobs`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`

---

## 🐛 Troubleshooting

### Issue: "Auth session missing" in production
**Solution:** Make sure your Supabase URL and anon key are correctly set in environment variables.

### Issue: Emails not sending
**Solution:** 
- Check Resend API key is correct
- Verify domain is verified in Resend
- Check `HR_NOTIFICATION_EMAIL` is set correctly
- Test using `/api/test-email` endpoint

### Issue: 403 errors on admin pages
**Solution:**
- Verify user role in Supabase `users` table
- Check RLS policies are applied correctly

### Issue: Resume upload failing
**Solution:**
- Verify Supabase Storage bucket `applications` exists
- Check RLS policies on `storage.objects` table

---

## 📊 Performance Optimization

Your production build is already optimized with:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Image optimization
- ✅ Static page generation where possible

### Additional Optimizations:

1. **Enable Caching Headers** (in `next.config.js`):
   ```js
   async headers() {
     return [
       {
         source: '/careers/:path*',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }
         ]
       }
     ]
   }
   ```

2. **Use a CDN** (Vercel provides this automatically)

3. **Monitor Performance**:
   - Use Google Lighthouse
   - Check Core Web Vitals
   - Monitor with Vercel Analytics or similar

---

## 🔄 Continuous Deployment

### With Vercel/Netlify:
- Automatic deployments on `git push` to main branch
- Preview deployments for pull requests
- Rollback to previous deployments with one click

### With GitHub Actions (for self-hosted):
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            npm install
            npm run build
            pm2 restart hba-jobs
```

---

## 📈 Scaling Considerations

As your application grows:

1. **Database**: Supabase scales automatically, consider upgrading plan if needed
2. **File Storage**: Monitor Supabase Storage usage
3. **Email Sending**: Resend has generous limits, upgrade if needed
4. **Server**: Vercel scales automatically, for self-hosted consider load balancing

---

## 🛡️ Security Best Practices

- ✅ All environment variables are server-side only
- ✅ RLS policies protect database access
- ✅ File uploads are validated
- ✅ HTTPS enforced (automatic on Vercel/Netlify)
- ✅ Auth tokens are httpOnly cookies
- ✅ CORS configured properly

### Additional Recommendations:
- Set up rate limiting for API routes
- Enable CAPTCHA for application forms
- Regular security audits with `npm audit`
- Keep dependencies updated

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks:
- **Weekly**: Check error logs
- **Monthly**: Review and update dependencies
- **Quarterly**: Database performance review
- **Yearly**: Security audit

### Need Help?
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Vercel Support: https://vercel.com/support

---

## 🎉 Congratulations!

Your HBA Jobs application is production-ready and deployed!

### What's Next?
- Monitor your first real applications
- Gather user feedback
- Iterate and improve
- Scale as needed

**Good luck with your recruitment platform!** 🚀

