// Vercel Serverless Function entry point for the Express API
// Vercel imports this file and calls it as a handler — no app.listen() needed.

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

// On Vercel, CLIENT_ORIGIN should be set to the production URL in environment variables.
// If not set, allow all origins (open CORS) so the app still works.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Allow Postman, curl, server-to-server
    if (allowedOrigins.length === 0) return cb(null, true); // Allow all if not set
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 150 }));

app.get('/api/health', (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    database: dbState,
    storageMode: mongoose.connection.readyState === 1 ? 'mongodb_atlas' : 'no_persistent_storage',
    mongodb_uri_set: Boolean(process.env.MONGODB_URI)
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('API Error:', err);
  let message = err.message || 'Server error';
  if (message.includes('SSL alert number 80') || message.includes('whitelist') || err.name === 'MongooseServerSelectionError') {
    message = 'MongoDB Atlas connection issue: IP not whitelisted. Add 0.0.0.0/0 in MongoDB Atlas Network Access.';
  }
  res.status(err.status || 500).json({ message });
});

// Connect to MongoDB (non-blocking)
function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.warn('[Database] MONGODB_URI is NOT set. Please add it in Vercel Environment Variables. Auth and resume storage will not work.');
    return;
  }
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  })
    .then(() => console.log('MongoDB Atlas Connected!'))
    .catch(err => {
      console.warn('[Database] MongoDB Atlas warning:', err.message);
      setTimeout(connectMongo, 20000);
    });
}

connectMongo();

// Export for Vercel serverless — do NOT call app.listen()
module.exports = app;
