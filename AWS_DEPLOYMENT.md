# AWS App Runner Deployment Guide

## Backend Deployment

### Prerequisites
- AWS Account
- MongoDB URI (already configured)
- Node.js 20+ locally for testing

### Steps to Deploy Backend on AWS App Runner

1. **Prepare the backend for deployment:**
   - Ensure all changes are committed to your repository
   - The backend is in the `backend/` directory

2. **Create an AWS App Runner service:**
   - Go to AWS Console → App Runner → Create Service
   - Source: Connect to GitHub repository (or push to AWS CodeCommit)
   - Or: Upload source code as a ZIP

3. **Configure the service:**
   - **Repository:** Your GitHub repository
   - **Branch:** main
   - **Runtime:** Node.js 20
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Port:** `5000`

4. **Set Environment Variables:**
   - `MONGO_URI` = `mongodb://admin:admin123@ac-ky1vvhj-shard-00-00.cnjprov.mongodb.net:27017,ac-ky1vvhj-shard-00-01.cnjprov.mongodb.net:27017,ac-ky1vvhj-shard-00-02.cnjprov.mongodb.net:27017/studybuddy?ssl=true&replicaSet=atlas-ft0f7t-shard-0&authSource=admin&retryWrites=true&w=majority`
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `<your-frontend-url>` (after deploying frontend)
   - `JWT_SECRET` = `<your-secret>`
   - `OPENAI_API_KEY` = `<your-api-key>`

5. **Deploy and note the URL:**
   - After deployment, you'll get a default URL like: `https://<id>.awsapprunner.com`
   - Copy this URL for the frontend configuration

---

## Frontend Deployment

### Steps to Deploy Frontend on AWS App Runner (or Vercel/Netlify)

1. **Option A: AWS App Runner**
   - Similar to backend, but:
     - **Build command:** `npm run build`
     - **Start command:** `npx serve dist`
     - **Port:** `3000`

2. **Option B: Vercel (Recommended for Vite + React)**
   ```bash
   npm i -g vercel
   cd frontend
   vercel
   ```
   - Set environment variable: `VITE_API_BASE_URL` = `<your-backend-url>/api`

3. **Option C: Netlify**
   - Connect GitHub repo
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables: `VITE_API_BASE_URL` = `<your-backend-url>/api`

---

## After Deployment

1. Update the frontend `.env` file:
   ```
   VITE_API_BASE_URL=https://YOUR_APP_RUNNER_URL/api
   ```

2. Set `CLIENT_URL` in backend environment variables to your frontend URL

3. Test the health endpoint:
   ```
   https://YOUR_BACKEND_URL/api/health
   ```

4. Test the root endpoint:
   ```
   https://YOUR_BACKEND_URL/
   ```

---

## Quick Test Locally

```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

The frontend will connect to `http://localhost:5000/api` by default.
