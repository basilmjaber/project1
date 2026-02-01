# Deployment Guide

## 📦 Downloading the Project

### From Figma Make:

1. Click the **"Export"** or **"Download"** button in the top right corner
2. The project will be downloaded as a ZIP file
3. Extract the ZIP file to your desired location

---

## 🐙 Uploading to GitHub

### Step 1: Create a New Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** button → **"New repository"**
3. Name it: `blockchain-degree-verification`
4. Choose **Private** or **Public**
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 2: Upload Your Code

#### Option A: Using GitHub Desktop (Easier)

1. Download and install [GitHub Desktop](https://desktop.github.com)
2. Open GitHub Desktop
3. Click **File** → **Add Local Repository**
4. Select your project folder
5. Click **"Publish repository"**
6. Choose your GitHub account and repository settings
7. Click **"Publish repository"**

#### Option B: Using Git Command Line

```bash
# Navigate to your project folder
cd path/to/blockchain-degree-verification

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Blockchain degree verification system"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/blockchain-degree-verification.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Option C: Using GitHub Web Interface (Simplest)

1. Go to your new repository on GitHub
2. Click **"uploading an existing file"**
3. Drag and drop ALL project files (or click "choose your files")
4. Add commit message: "Initial commit"
5. Click **"Commit changes"**

---

## ⚙️ Environment Variables Setup

### Important: Protect Your Secrets

Before deploying or sharing your repository:

1. **Never commit** the following files:
   - `.env`
   - `.env.local`
   - Any file containing API keys

2. **Create** `.env.example` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=your_database_url_here

# OpenAI (if needed)
OPENAI_API_KEY=your_openai_key_here
```

3. **For collaborators**, ask them to:
   - Copy `.env.example` to `.env`
   - Fill in their own credentials
   - Never commit `.env` file

---

## 🌐 Deploying to Production

### Option 1: Vercel (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **"Deploy"**

### Option 2: Netlify

1. Go to [Netlify](https://netlify.com)
2. Click **"Add new site"** → **"Import existing project"**
3. Connect to GitHub and select your repository
4. Add environment variables in **Site settings** → **Environment variables**
5. Click **"Deploy site"**

### Option 3: Supabase Hosting

Since you're already using Supabase:

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Login to Supabase:

```bash
supabase login
```

3. Link your project:

```bash
supabase link --project-ref lizjpqzjcsloffmgeezp
```

4. Deploy functions:

```bash
supabase functions deploy make-server-4ce262a1
```

---

## 📋 Pre-Deployment Checklist

- [ ] All sensitive data removed from code
- [ ] Environment variables configured
- [ ] `.gitignore` file includes `.env`
- [ ] README.md updated with your information
- [ ] Database tables created in Supabase
- [ ] Supabase Edge Functions deployed
- [ ] Admin credentials changed from default
- [ ] Tested certificate issuance
- [ ] Tested certificate verification
- [ ] Responsive design verified on mobile/tablet

---

## 🔄 Continuous Deployment

### Automatic Deployment on Push

Both Vercel and Netlify support automatic deployments:

1. Push changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

2. Your hosting provider will automatically:
   - Detect the push
   - Build the project
   - Deploy the new version

---

## 🔐 Security Best Practices

### For GitHub:

1. **Use GitHub Secrets** for sensitive data:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add your environment variables as secrets
   - Reference them in workflows

2. **Enable branch protection**:
   - Protect your `main` branch
   - Require pull request reviews
   - Require status checks

3. **Add collaborators carefully**:
   - Only give access to trusted team members
   - Use appropriate permission levels

### For Production:

1. **Change default credentials**:
   - Replace `admin/admin123` with secure credentials
   - Use environment variables for admin credentials

2. **Enable HTTPS**:
   - Both Vercel and Netlify provide free SSL certificates
   - Ensure all API calls use HTTPS

3. **Rate limiting**:
   - Implement rate limiting on API endpoints
   - Prevent abuse of certificate issuance

---

## 📞 Getting Help

### If you encounter issues:

1. **Check logs**:
   - Supabase: Dashboard → Logs
   - Vercel: Deployment → Functions logs
   - Netlify: Deploys → Function logs

2. **Common issues**:
   - **Build fails**: Check Node.js version compatibility
   - **API errors**: Verify environment variables
   - **Database errors**: Check Supabase connection

3. **Resources**:
   - [Supabase Documentation](https://supabase.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)
   - [GitHub Documentation](https://docs.github.com)

---

## 🎉 Success!

Once deployed, your blockchain degree verification system will be:

- ✅ Accessible via public URL
- ✅ Automatically backed up on GitHub
- ✅ Easy to update and maintain
- ✅ Scalable and production-ready

**Your project URL will look like**:

- Vercel: `https://blockchain-degree-verification.vercel.app`
- Netlify: `https://blockchain-degree-verification.netlify.app`

---

**Questions?** Check the main README.md for more information.