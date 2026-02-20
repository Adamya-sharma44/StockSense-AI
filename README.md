## StockSense AI

AI-powered inventory assistant for e‑commerce retail. Predicts demand trends, surfaces low-stock risk, and recommends smart restocking plans.

### Tech stack

- **Frontend**: React + Vite, React Router, Context API, Axios, Recharts
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, OpenAI API
- **Database**: MongoDB Atlas

### Project structure

- **backend**
  - `server.js` – Express app entry, routes, middleware
  - `config/db.js` – MongoDB connection helper
  - `models/User.js` – user model (auth)
  - `models/InventoryItem.js` – inventory & sales history
  - `middleware/authMiddleware.js` – JWT guard
  - `routes/authRoutes.js` – register/login/me
  - `routes/inventoryRoutes.js` – CRUD + low-stock list
  - `routes/aiRoutes.js` – OpenAI‑powered stock recommendations
  - `routes/analyticsRoutes.js` – basic analytics for charts
  - `.env.example` – backend env template
- **frontend**
  - Vite React app
  - `src/context/AuthContext.jsx` – auth state & JWT handling
  - `src/services/api.js` – Axios client & typed API helpers
  - `src/components/ProtectedRoute.jsx` – route guard
  - `src/components/Layout.jsx` – shell (header, nav, footer)
  - `src/components/InventoryForm.jsx` – add/edit inventory items
  - `src/pages/AuthPage.jsx` – login/register
  - `src/pages/Dashboard.jsx` – inventory table, low-stock alerts, AI recs
  - `src/pages/Analytics.jsx` – charts & KPIs
  - `.env.example` – frontend env template

---

### 1. Backend setup

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies (already done if you ran `npm install` once, but safe to repeat):

   ```bash
   npm install
   ```

3. Create `.env` from the template:

   ```bash
   copy .env.example .env   # PowerShell / cmd
   # or manually create .env using the example
   ```

4. Fill in `.env`:

   - **PORT** – usually `5000`
   - **MONGODB_URI** – MongoDB Atlas connection string
   - **JWT_SECRET** – any strong random string
   - **OPENAI_API_KEY** – your OpenAI API key
   - **CLIENT_URL** – `http://localhost:5173`

5. Start the backend:

   ```bash
   npm run dev
   ```

6. Health check:

   - Open `http://localhost:5000/api/health` – should return JSON `{ status: "ok", ... }`.

---

### 2. Frontend setup

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` from template:

   ```bash
   copy .env.example .env
   ```

   Adjust `VITE_API_BASE_URL` if your backend port/host differ.

4. Start the frontend dev server:

   ```bash
   npm run dev
   ```

5. Open the app:

   - Visit the URL printed by Vite (usually `http://localhost:5173`).

---

### 3. Core flows

- **Register / login**
  - Hit `Register` to create an account (name, email, password).
  - JWT is stored in `localStorage` and attached to all API requests.
  - Logout from the header.

- **Inventory dashboard**
  - Add items with SKU, category, stock levels, reorder thresholds, and pricing.
  - Edit/delete rows from the table.
  - Low-stock items (stock ≤ reorder level) show up under “Low-stock alerts”.

- **AI recommendations**
  - On the dashboard, click **Generate insights**.
  - Backend summarizes inventory + sales history and calls OpenAI.
  - Frontend shows cards with `riskLevel`, recommendation, suggested reorder quantity, and reasoning.

- **Analytics**
  - KPIs: total SKUs, total on-hand units, stock value.
  - Bar chart: monthly sales trend (from `salesHistory`).
  - Pie chart: stock distribution by category.

---

### 4. Notes & customization

- To seed historical sales data, you can extend `InventoryItem.salesHistory` via:
  - Mongo shell / Compass, or
  - Additional seed script / endpoints.
- For production:
  - Serve the built React app behind a reverse proxy.
  - Use environment variables for API keys and database URLs.
  - Enable proper CORS / HTTPS / logging as needed.

