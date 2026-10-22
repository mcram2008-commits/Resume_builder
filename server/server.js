require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

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
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
