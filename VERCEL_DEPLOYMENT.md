# 🚀 Vercel Deployment Guide

## 📋 Overview

You have **TWO** deployments needed:
1. **Frontend** (React app) - Already set up
2. **Backend** (Express API) - New setup needed

---

## 🎯 BACKEND Deployment (Express API)

### **Step 1: Add .vercelignore**

Create `server/.vercelignore` to exclude unnecessary files from deployment.

Already done! ✅

### **Step 2: Set Environment Variables in Vercel**

⚠️ **IMPORTANT**: Your `.env` file is NOT uploaded to Vercel (it's gitignored).

You need to add these environment variables in Vercel Dashboard:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your backend project** (or create new one)
3. **Go to Settings** → **Environment Variables**
4. **Add these variables:**

```
GOOGLE_SHEET_URL = [paste your Google Sheets public link]
JWT_SECRET = secret#text
NODE_ENV = production
PORT = 5000
CLOUDINARY_CLOUD_NAME = dba9qbn3d
CLOUDINARY_API_KEY = 718491755932237
CLOUDINARY_API_SECRET = E6mZDH_4m1NbXs_uGKxktl-3GKE
```

**CRITICAL:** Make sure `GOOGLE_SHEET_URL` is set to your actual Google Sheets link!

### **Step 3: Deploy Backend**

#### Option A: Deploy via GitHub (Recommended)

1. **Make sure backend changes are committed:**
   ```bash
   cd server
   git add .
   git commit -m "Add Vercel config and Google Sheets integration"
   git push
   ```

2. **In Vercel Dashboard:**
   - Click "Add New Project"
   - Import your repository
   - Set **Root Directory** to `server`
   - Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
cd server
npm install -g vercel
vercel --prod
```

### **Step 4: Update Frontend API URL**

After backend is deployed, you'll get a URL like:
```
https://your-backend.vercel.app
```

Update your frontend to use this URL instead of `http://localhost:5000`:

1. Open `src/services/api.js` (or wherever you define API base URL)
2. Change:
   ```javascript
   // OLD
   const API_URL = 'http://localhost:5000/api';
   
   // NEW
   const API_URL = 'https://your-backend.vercel.app/api';
   ```

---

## 🎯 FRONTEND Deployment (React App)

Your frontend is already configured! Just make sure:

### **Step 1: Update API URL in Code**

Before deploying frontend, update the API URL to point to your deployed backend.

### **Step 2: Deploy Frontend**

```bash
git add .
git commit -m "Update API URL to production backend"
git push
```

Vercel will auto-deploy!

---

## ✅ Deployment Checklist

### Backend:
- [ ] Created `server/vercel.json` ✅ (Done)
- [ ] Set environment variables in Vercel Dashboard
- [ ] Committed and pushed changes
- [ ] Deployed to Vercel
- [ ] Got backend URL (e.g., `https://your-backend.vercel.app`)
- [ ] Tested API endpoint: `https://your-backend.vercel.app/`

### Frontend:
- [ ] Updated API URL in code to backend URL
- [ ] Committed and pushed changes
- [ ] Vercel auto-deployed
- [ ] Tested login/signup on production

---

## 🔍 Testing Your Deployment

### Test Backend API

Open in browser:
```
https://your-backend.vercel.app/
```

Should show: `ReferEarn Backend is Running!`

### Test Auth Endpoint

Using Postman or browser console:
```javascript
fetch('https://your-backend.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log)
```

Should return a token!

---

## ⚠️ IMPORTANT Notes

### 1. **CORS Configuration**

Your backend needs to allow requests from your frontend domain. 

Update `server/index.js`:

```javascript
const cors = require('cors');

// Allow your frontend domain
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://your-frontend.vercel.app' // Production
  ],
  credentials: true
}));
```

### 2. **Environment Variables**

- **NEVER** commit `.env` file
- Always set environment variables in Vercel Dashboard
- Each deployment (frontend/backend) has its own environment variables

### 3. **Google Sheets**

- Your Google Sheet MUST be public
- The URL in Vercel environment variables must be the full public link
- Changes to the sheet are reflected immediately (no deployment needed)

---

## 🐛 Troubleshooting

### "Backend not working on Vercel"

1. Check Vercel deployment logs
2. Verify environment variables are set in Vercel Dashboard
3. Make sure `GOOGLE_SHEET_URL` is correct
4. Test the Google Sheets link manually in browser

### "CORS Error"

Update CORS settings in `server/index.js` to include your frontend domain

### "Cannot find module"

Make sure all dependencies in `package.json` are listed under `dependencies` (not `devDependencies`)

---

## 📱 Quick Deployment Commands

**Backend:**
```bash
cd server
git add .
git commit -m "Backend deployment ready"
git push
```

**Frontend:**
```bash
cd ..
git add .
git commit -m "Update API URL for production"
git push
```

---

## 🎉 Success!

Once both are deployed:
- ✅ Frontend: `https://your-app.vercel.app`
- ✅ Backend: `https://your-backend-api.vercel.app`
- ✅ Database: Google Sheets (no hosting needed!)

Your app is LIVE! 🚀
