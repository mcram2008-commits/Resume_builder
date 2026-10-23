require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Prevent Mongoose from buffering queries indefinitely when Atlas connection is down/unwhitelisted
mongoose.set('bufferCommands', false);

const authRoutes = require('./src/routes/auth');
const resumeRoutes = require('./src/routes/resumes');
const aiRoutes = require('./src/routes/ai');

const port = process.env.PORT || 5000;
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 150 }));

app.get('/', (_req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 40px; line-height: 1.6;">
      <h2>Smart Resume Builder API is Running! 🚀</h2>
      <p>This is the backend server running on port ${port}.</p>
      <p>Access the web application frontend here: <a href="http://localhost:5173" style="font-weight: bold; color: #2563eb;">http://localhost:5173</a></p>
    </div>
  `);
});

app.get('/api/health', (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    port,
    database: dbState,
    storageMode: mongoose.connection.readyState === 1 ? 'mongodb_atlas' : 'local_storage_fallback'
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
    message = 'MongoDB Atlas connection issue: IP not whitelisted. Please add 0.0.0.0/0 in MongoDB Atlas Network Access.';
  }

  res.status(err.status || 500).json({ message });
});

app.listen(port, () => console.log(`API running on http://localhost:${port}`));

function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.log('[Database] No MONGODB_URI configured. Running with local persistent database.');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 4000
  })
    .then(() => {
      console.log('MongoDB Atlas Connected successfully!');
    })
    .catch(err => {
      console.warn('[Database] MongoDB Atlas connection warning:', err.message);
      if (err.message && (err.message.includes('SSL alert number 80') || err.message.includes('whitelist'))) {
        console.warn('NOTE: SSL Alert 80 occurs because your current IP address is not whitelisted in MongoDB Atlas.');
        console.warn('To fix permanently: Go to cloud.mongodb.com -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0).');
        console.warn('The server is operating seamlessly using the local persistent database until Atlas connects.');
      }
      setTimeout(connectMongo, 15000);
    });
}

connectMongo();
