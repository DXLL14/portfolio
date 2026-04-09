# Deploy to Vercel - Step by Step Guide

## Prerequisites
- A GitHub account
- Your portfolio code on GitHub

## Step 1: Push Your Code to GitHub

1. Open Terminal in your portfolio folder
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial portfolio commit with chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `portfolio`
3. Click "Create repository"
4. Follow the instructions to push your code

## Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "New Project"
5. Select your `portfolio` repository
6. Click "Import"

### Configure Environment Variables

In the Vercel dashboard:

1. Find the Environment Variables section
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `YOUR_ACTUAL_API_KEY` (from `.env` file)
3. Click "Add"
4. Click "Deploy"

## Step 4: Wait for Deployment

Vercel will:
1. Build your project
2. Deploy the frontend (HTML/CSS/JS)
3. Deploy the backend API (`/api/chat`)
4. Give you a live URL like: `https://portfolio-abc123.vercel.app`

## Step 5: Update Your Frontend (If Needed)

The `script.js` is already configured to auto-detect:
- **Local (localhost)** → Uses `http://localhost:3001/api/chat`
- **Production (Vercel)** → Uses `/api/chat` (same domain)

No changes needed! ✅

## Step 6: Test Your Deployed Portfolio

1. Visit your Vercel URL (provided after deployment)
2. Click the 💬 chatbot bubble
3. Type a message
4. Should work perfectly! 🎉

## Project Structure

```
portfolio/
├── index.html              (Frontend)
├── style.css              (Styling)
├── script.js              (Chat logic - auto-detects backend)
├── assets/                (Images)
├── api/
│   └── chat.js            (Vercel serverless function)
├── vercel.json            (Vercel config)
├── .env                   (Local config - NOT deployed)
├── .gitignore             (Prevents .env from pushing)
└── README.md
```

## Environment Variables on Vercel

Your `.env` file is in `.gitignore`, so it won't push to GitHub. Instead:

1. Vercel dashboard → Settings → Environment Variables
2. Add `GEMINI_API_KEY`
3. Vercel automatically injects it into your serverless functions

## Troubleshooting

**Chatbot not responding?**
- Check Vercel deployment logs
- Verify `GEMINI_API_KEY` is set in Environment Variables
- Check browser DevTools (F12 → Console) for errors

**"Cannot find module"?**
- Make sure `api/chat.js` exists
- `vercel.json` is in the root folder

**Site loads but looks different?**
- Verify all assets paths are relative
- CSS/JS files should load correctly

## That's It!

Your portfolio with AI chatbot is now live on Vercel! 🚀

Share your URL: `https://your-portfolio.vercel.app`
