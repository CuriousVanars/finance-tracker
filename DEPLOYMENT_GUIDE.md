# 🚀 Finance Tracker - Deployment Guide

## 🔧 **Step 1: Set up Supabase (Database & Authentication)**

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: `finance-tracker`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
4. Wait for the project to be created (2-3 minutes)

### Configure Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the content from `database/schema.sql`
3. Click **Run** to create all tables and security policies

### Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon/public key)

### Update Environment Variables
1. In your project, update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🌐 **Step 2: Deploy on Vercel (Recommended)**

### Option A: Deploy via GitHub (Recommended)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add authentication and database integration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your `finance-tracker` repository
   - Click "Deploy"

3. **Add Environment Variables**:
   - In Vercel dashboard, go to your project
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
     ```
   - Click "Save"

4. **Redeploy**:
   - Go to **Deployments**
   - Click the three dots on latest deployment
   - Click "Redeploy"

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy with environment variables
vercel --prod
```

## 🔄 **Step 3: Alternative Deployment Options**

### Deploy on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Add environment variables in Site Settings

### Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

## 🧪 **Step 4: Test Your Deployment**

1. **Visit your deployed URL**
2. **Test user registration**:
   - Click "Create Account"
   - Use a real email address
   - Check email for verification link
3. **Test login**:
   - Sign in with verified account
   - Verify dashboard loads
4. **Test functionality**:
   - Add a transaction
   - Check if data persists after refresh

## 🔒 **Step 5: Configure Authentication (Supabase)**

### Email Templates
1. In Supabase dashboard, go to **Authentication** → **Email Templates**
2. Customize the confirmation email template
3. Set your site URL: `https://your-app-domain.vercel.app`

### URL Configuration
1. Go to **Authentication** → **URL Configuration**
2. Add your domain to **Site URL**: `https://your-app-domain.vercel.app`
3. Add redirect URLs if needed

## 🌍 **Step 6: Custom Domain (Optional)**

### Vercel Custom Domain
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase Site URL to your custom domain

## 📊 **Step 7: Monitoring & Analytics**

### Vercel Analytics
1. In Vercel dashboard, go to **Analytics**
2. Enable Web Analytics
3. Monitor page views and performance

### Supabase Monitoring
1. In Supabase dashboard, monitor:
   - **Database usage**
   - **Authentication metrics**
   - **API requests**

## 🔧 **Troubleshooting**

### Common Issues

**1. Environment Variables Not Working**
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names match exactly

**2. Authentication Not Working**
- Check Supabase URL configuration
- Verify email confirmation is working
- Check browser console for errors

**3. Database Connection Issues**
- Verify Supabase credentials
- Check Row Level Security policies
- Ensure database schema is applied

**4. Build Failures**
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check Next.js version compatibility

## 🎉 **Your App is Live!**

Once deployed, your users can:
- ✅ Register with email/password
- ✅ Login securely
- ✅ Add income, expenses, and savings
- ✅ Set financial goals
- ✅ View detailed analytics
- ✅ Access from any device

## 📱 **Mobile Access**

Your app is now accessible on mobile devices:
- **iOS**: Add to home screen via Safari
- **Android**: Add to home screen via Chrome
- **Progressive Web App** features included

## 🔄 **Continuous Deployment**

Every time you push to your main branch:
1. Vercel automatically rebuilds your app
2. New version is deployed instantly
3. No downtime for users

---

**Need Help?** 
- Check Vercel documentation
- Check Supabase documentation  
- Review error logs in deployment dashboard
