# AWS App Runner Deployment Guide

## Part 1: Deploy Backend to AWS App Runner

### Step 1: Go to AWS Console
1. Open AWS Console: https://console.aws.amazon.com
2. Search for "App Runner" and click on it

### Step 2: Create App Runner Service
1. Click **Create an App Runner service**
2. Under **Source**, select **GitHub**
3. Click **Add GitHub connection** and authorize AWS App Runner to access your GitHub account
4. Select your repository: `Adamya-sharma44/StockSense-AI`
5. Select branch: **main**

### Step 3: Configure Build Settings
- **Runtime**: Node.js 20
- **Build command**: `npm install`
- **Start command**: `npm start`
- **Port**: `5000`

### Step 4: Configure Environment Variables
Click on **Environment variables** and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb://admin:admin123@ac-ky1vvhj-shard-00-00.cnjprov.mongodb.net:27017,ac-ky1vvhj-shard-00-01.cnjprov.mongodb.net:27017,ac-ky1vvhj-shard-00-02.cnjprov.mongodb.net:27017/studybuddy?ssl=true&replicaSet=atlas-ft0f7t-shard-0&authSource=admin&retryWrites=true&w=majority` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `<your-frontend-url>` (see Part 2) |
| `JWT_SECRET` | `<your-jwt-secret>` |
| `OPENAI_API_KEY` | `<your-openai-api-key>` |

### Step 5: Deploy
1. Click **Next** → **Create Service**
2. Wait for deployment to complete (2-5 minutes)
3. Copy your backend URL (e.g., `https://xyz123.awsapprunner.com`)

---

## Part 2: Deploy Frontend (Vercel - Recommended)

### Step 1: Go to Vercel
1. Open: https://vercel.com
2. Sign up/Login with GitHub

### Step 2: Import Project
1. Click **Add New** → **Project**
2. Import `Adamya-sharma44/StockSense-AI`
3. Under **Frontend**, configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
Add environment variable:
- `VITE_API_BASE_URL` = `https://<your-backend-url>/api`

### Step 4: Deploy
1. Click **Deploy**
2. Copy your frontend URL (e.g., `https://stocksense-ai.vercel.app`)

---

## Part 3: Update Backend with Frontend URL

1. Go back to AWS App Runner → Your backend service
2. **Configuration** → **Environment variables**
3. Update `CLIENT_URL` with your frontend URL
4. **Deploy** changes

---

## Testing

After deployment:
- Backend Health: `https://<backend-url>/api/health`
- Backend Root: `https://<backend-url>/`
- Frontend: `https://<frontend-url>`

---

## Local Development

To run locally after cloning:
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```
