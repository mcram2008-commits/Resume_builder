const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '../../data');
const filePath = path.join(dataDir, 'local_storage.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [], resumes: [] }, null, 2), 'utf-8');
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) || { users: [], resumes: [] };
  } catch {
    return { users: [], resumes: [] };
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function genId() {
  return crypto.randomBytes(12).toString('hex');
}

module.exports = {
  // Users
  findUserByEmail(email) {
    const db = readData();
    return db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
  },
  findUserById(id) {
    const db = readData();
    return db.users.find(u => String(u._id) === String(id)) || null;
  },
  createUser({ name, email, passwordHash }) {
    const db = readData();
    const newUser = {
      _id: genId(),
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeData(db);
    return newUser;
  },

  // Resumes
  findResumesByUser(userId) {
    const db = readData();
    return db.resumes
      .filter(r => String(r.user) === String(userId))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(r => ({ _id: r._id, title: r.title, updatedAt: r.updatedAt, createdAt: r.createdAt }));
  },
  findResumeById(id, userId) {
    const db = readData();
    return db.resumes.find(r => String(r._id) === String(id) && String(r.user) === String(userId)) || null;
  },
  createResume({ user, title, data }) {
    const db = readData();
    const now = new Date().toISOString();
    const newResume = {
      _id: genId(),
      user: String(user),
      title: title || 'My Resume',
      data: data || {},
      createdAt: now,
      updatedAt: now
    };
    db.resumes.push(newResume);
    writeData(db);
    return newResume;
  },
  updateResume(id, userId, { title, data }) {
    const db = readData();
    const index = db.resumes.findIndex(r => String(r._id) === String(id) && String(r.user) === String(userId));
    if (index === -1) return null;
    if (title !== undefined) db.resumes[index].title = title;
    if (data !== undefined) db.resumes[index].data = data;
    db.resumes[index].updatedAt = new Date().toISOString();
    writeData(db);
    return db.resumes[index];
  },
  deleteResume(id, userId) {
    const db = readData();
    const prevLen = db.resumes.length;
    db.resumes = db.resumes.filter(r => !(String(r._id) === String(id) && String(r.user) === String(userId)));
    if (db.resumes.length !== prevLen) {
      writeData(db);
      return true;
    }
    return false;
  }
};
