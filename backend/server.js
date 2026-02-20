const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect DB
connectDB();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://stock-sense-ai-mu.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root route
app.get("/", (req, res) => res.json({ message: "StockSense AI API is running 🚀" }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StockSense AI backend is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StockSense AI backend running on port ${PORT}`);
});

