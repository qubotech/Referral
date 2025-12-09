# 🚀 Deployment Guide - ReferEarn App

## Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (you already have this)

---

## STEP 1: Fix MongoDB Atlas Connection

### Option A: Allow Your IP (Recommended for Testing)
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar under Security)
3. Click **+ ADD IP ADDRESS**
4. Click **ADD CURRENT IP ADDRESS**
5. Click **Confirm**

### Option B: Allow All IPs (For Vercel Deployment)
1. Go to **Network Access** in MongoDB Atlas
2. Click **+ ADD IP ADDRESS**
3. Enter `0.0.0.0/0` (allows all)
4. Add description: "Vercel Production"
5. Click **Confirm**

**⚠️ Wait 1-2 minutes after adding IPs for changes to take effect**

---

## STEP 2: Deploy Frontend to Vercel

### Method 1: Using Vercel CLI (Easiest)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd referral-app-react

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### Method 2: Using GitHub + Vercel Dashboard
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/referral-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - Click **Deploy**

---

## STEP 3: Deploy Backend

### Option A: Deploy to Render (Free, Recommended)
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `referearn-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = `secret#text`
   - `NODE_ENV` = `production`
7. Click **Create Web Service**

### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. Click **New Project** → **Deploy from GitHub**
4. Select your repo
5. Set root directory to `server`
6. Add environment variables (same as above)
7. Deploy

---

## STEP 4: Update Frontend API URL

Once backend is deployed, update the API URL in your frontend:

**File**: `src/services/api.js`
```javascript
// Change from:
const API_URL = 'http://localhost:5001/api';

// To:
const API_URL = 'https://your-backend.onrender.com/api';
// OR
const API_URL = 'https://your-backend.up.railway.app/api';
```

Then redeploy frontend to Vercel.

---

## STEP 5: Quick Test Locally (Before Deployment)

### Start Frontend:
```bash
cd referral-app-react
npm run dev
```
Opens at: http://localhost:5173

### Start Backend (New Terminal):
```bash
cd referral-app-react/server
npm start
```
Runs on: http://localhost:5001

**Expected Log**: `✅ MongoDB Connected (Real Database)`

If you see this, your app is fully functional!

---

## Troubleshooting

### "Can't Login/Signup"
- **Check**: Is backend running? (`npm start` in server folder)
- **Check**: MongoDB connected? (see server logs)
- **Check**: Network tab in browser - is API call reaching `localhost:5001`?

### "MongoDB Connection Timeout"
- **Fix**: Add IP to MongoDB Atlas Network Access (see Step 1)
- **Wait**: 1-2 minutes after adding IP

### "Port 5001 in use"
```bash
npx kill-port 5001
npm start
```

### Build Fails on Vercel
- Make sure `vercel.json` exists (already created)
- Make sure `build` script in `package.json` is `vite build` (already fixed)

---

## Environment Variables for Production

### Frontend (.env in root)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env in server folder)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret#text
NODE_ENV=production
PORT=5000
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas IP whitelist updated
- [ ] Backend deployed and running
- [ ] Frontend API URL points to deployed backend
- [ ] Frontend deployed to Vercel
- [ ] Test signup from deployed URL
- [ ] Test login from deployed URL
- [ ] Check MongoDB Atlas for new users

---

## Need Help?
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
