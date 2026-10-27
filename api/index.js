// Vercel Serverless Function entry point for the Express API
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const authRoutes = require('../server/src/routes/auth');
const resumeRoutes = require('../server/src/routes/resumes');
const aiRoutes = require('../server/src/routes/ai');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

// Serverless MongoDB connection caching
let isConnected = false;
async function connectDb() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.warn('[Database] MONGODB_URI is not set in environment variables.');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('[Database] MongoDB Atlas Connected!');
  } catch (err) {
    console.warn('[Database] MongoDB connection error:', err.message);
  }
}

// Connect DB middleware for incoming requests
app.use(async (_req, _res, next) => {
  await connectDb();
  next();
});

// Health check (support both /api/health and /health)
app.get(['/health', '/api/health'], (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    database: dbState,
    storageMode: mongoose.connection.readyState === 1 ? 'mongodb_atlas' : 'no_persistent_storage',
    mongodb_uri_set: Boolean(process.env.MONGODB_URI)
  });
});

// Mount routes on both /api/* and /* to handle any rewrite variant cleanly
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/resumes', resumeRoutes);
app.use('/resumes', resumeRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('API Error:', err);
  let message = err.message || 'Server error';
  if (message.includes('SSL alert number 80') || message.includes('whitelist') || err.name === 'MongooseServerSelectionError') {
    message = 'MongoDB Atlas connection issue: IP not whitelisted. Add 0.0.0.0/0 in MongoDB Atlas Network Access.';
  }
  res.status(err.status || 500).json({ message });
});

// Export handler for Vercel serverless
module.exports = app;
