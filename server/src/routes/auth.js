const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const localStore = require('../utils/localStore');

const isDbConnected = () => mongoose.connection.readyState === 1;
const isLocalStorageAvailable = () => localStore.isAvailable();

function issue(user) {
  return {
    token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'smart_resume_secret_jwt_2026', { expiresIn: '7d' }),
    user: { id: user._id, name: user.name, email: user.email }
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!name || !email || password.length < 8) {
      return res.status(400).json({ message: 'Enter a name, valid email, and password of at least 8 characters.' });
    }

    if (isDbConnected()) {
      try {
        if (await User.findOne({ email })) {
          return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
        return res.status(201).json(issue(user));
      } catch (err) {
        console.warn('MongoDB query failed, switching to local store:', err.message);
      }
    }

    if (!isLocalStorageAvailable()) {
      return res.status(503).json({ message: 'Database not configured. Please contact the site administrator to set up MONGODB_URI.' });
    }

    if (localStore.findUserByEmail(email)) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const user = localStore.createUser({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json(issue(user));
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    let user = null;

    if (isDbConnected()) {
      try {
        user = await User.findOne({ email });
      } catch (err) {
        console.warn('MongoDB query failed, checking local store:', err.message);
      }
    }

    if (!user && isLocalStorageAvailable()) {
      user = localStore.findUserByEmail(email);
    }

    if (!user) {
      if (!isDbConnected() && !isLocalStorageAvailable()) {
        return res.status(503).json({ message: 'Database not configured. Please contact the site administrator.' });
      }
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    res.json(issue(user));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
