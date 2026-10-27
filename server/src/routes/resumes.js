const router = require('express').Router();
const multer = require('multer');
const mammoth = require('mammoth');

// Lazy-load pdf-parse to avoid Vercel serverless filesystem access issues on require()
let pdfModule = null;
function getPdfParser() {
  if (!pdfModule) {
    try { pdfModule = require('pdf-parse'); } catch (e) { pdfModule = null; }
  }
  return pdfModule;
}
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const localStore = require('../utils/localStore');

async function ensureDb() {
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
    } catch (err) {
      console.warn('[Database] Mongoose connect error:', err.message);
    }
  }
}

const isDbConnected = () => mongoose.connection.readyState === 1;

router.use(async (_req, _res, next) => {
  await ensureDb();
  next();
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

async function parsePdfBuffer(buffer) {
  const parser = getPdfParser();
  if (!parser) throw new Error('PDF parsing is not available in this environment.');
  try {
    if (typeof parser === 'function') {
      const parsed = await parser(buffer);
      return parsed.text || '';
    }
    if (parser && parser.PDFParse) {
      const p = new parser.PDFParse({ data: buffer });
      try {
        const parsed = await p.getText();
        return parsed.text || '';
      } finally {
        await p.destroy().catch(() => {});
      }
    }
  } catch (err) {
    console.error('PDF parsing error inside parsePdfBuffer:', err);
    throw new Error('PDF parse failed: ' + err.message);
  }
  throw new Error('No compatible PDF parser available.');
}

function extractResumeFromText(rawText) {
  // Check if file is valid JSON
  try {
    const json = JSON.parse(rawText);
    if (json && (json.fullName || json.skills || json.experience || json.education || json.role)) {
      return {
        fullName: json.fullName || '',
        role: json.role || '',
        email: json.email || '',
        phone: json.phone || '',
        location: json.location || '',
        website: json.website || '',
        summary: json.summary || '',
        skills: json.skills || 'JavaScript, React, Node.js, HTML, CSS',
        education: Array.isArray(json.education) && json.education.length ? json.education : [{ school: '', degree: '', year: '' }],
        projects: Array.isArray(json.projects) && json.projects.length ? json.projects : [{ name: '', tech: '', description: '' }],
        experience: Array.isArray(json.experience) && json.experience.length ? json.experience : [{ company: '', role: '', period: '', description: '' }],
        additionalInfo: json.additionalInfo || '',
        template: json.template || 'modern',
        align: json.align || 'left',
        accentColor: json.accentColor || '#4f46e5',
        fontFamily: json.fontFamily || 'sans',
        spacing: json.spacing || 'normal'
      };
    }
  } catch {}

  const result = {
    fullName: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    skills: '',
    education: [],
    projects: [],
    experience: [],
    additionalInfo: '',
    template: 'modern',
    align: 'left',
    accentColor: '#4f46e5',
    fontFamily: 'sans',
    spacing: 'normal'
  };

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return result;

  // 1. Email extraction
  const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) result.email = emailMatch[1];

  // 2. Phone extraction (handles +91, 10-digit Indian numbers, formatted numbers)
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b)/);
  if (phoneMatch) result.phone = phoneMatch[0].trim();

  // 3. Website / Portfolio / GitHub / LinkedIn
  const links = [];
  const linkMatches = rawText.matchAll(/(?:https?:\/\/)?(?:www\.)?(github\.com\/[^\s,]+|linkedin\.com\/in\/[^\s,]+|[a-zA-Z0-9-]+\.(?:netlify\.app|vercel\.app|github\.io|[a-zA-Z]{2,}\/[^\s,]*))/gi);
  for (const match of linkMatches) {
    if (match[0] && !links.includes(match[0])) links.push(match[0].trim());
  }
  if (links.length) result.website = links.join('  •  ');

  // 4. Location extraction (e.g., "Dharmapuri-635205", "Tamilnadu, India", or City, State)
  const locMatch = rawText.match(/([A-Z][a-zA-Z\s]+(?:-\d{6})?[,\s]+(?:Tamil\s*nadu|Kerala|Karnataka|Andhra|Maharashtra|India|[A-Z]{2}))/i);
  if (locMatch) {
    result.location = locMatch[1].replace(/\s+/g, ' ').trim();
  }

  // 5. Candidate Name & Role from header
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Check if line looks like a person's name (not email, not phone, uppercase or titlecase)
    if (line.length >= 2 && line.length <= 40 && !line.includes('@') && !line.includes('.com') && !/\d{5}/.test(line)) {
      if (!result.fullName) {
        result.fullName = line;
        continue;
      }
      if (!result.role && line.length <= 50 && !line.includes('@') && !line.includes('http')) {
        result.role = line;
        break;
      }
    }
  }

  // 6. Professional Summary
  const summaryRegex = /(?:PROFESSIONAL\s+)?(?:SUMMARY|PROFILE|ABOUT\s+ME|OBJECTIVE)[:\-\s]+([\s\S]+?)(?=(?:TECHNICAL\s+)?SKILLS|EXPERIENCE|WORK\s+EXPERIENCE|PROJECTS|EDUCATION|$)/i;
  const summaryMatch = rawText.match(summaryRegex);
  if (summaryMatch && summaryMatch[1]) {
    result.summary = summaryMatch[1].trim().replace(/\r?\n/g, ' ').slice(0, 600);
  }

  // 7. Technical Skills
  const skillsRegex = /(?:TECHNICAL\s+)?SKILLS?[:\-\s]+([\s\S]+?)(?=(?:PROJECTS|WORK\s+EXPERIENCE|EXPERIENCE|EDUCATION|ADDITIONAL|$))/i;
  const skillsMatch = rawText.match(skillsRegex);
  if (skillsMatch && skillsMatch[1]) {
    const rawSkillsText = skillsMatch[1].trim();
    // Clean categories like "FRONTEND-HTML...", "BACKEND-...", "Tools-..."
    const cleaned = rawSkillsText
      .split(/\r?\n/)
      .map(line => line.replace(/^[A-Z\s]+[-:\uff0d]\s*/i, '').replace(/[•\-\*]/g, '').trim())
      .filter(Boolean)
      .join(', ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/,\s*,/g, ',');
    result.skills = cleaned.slice(0, 500) || rawSkillsText.slice(0, 300);
  }

  // 8. Projects section
  const projRegex = /PROJECTS?[:\-\s]+([\s\S]+?)(?=(?:WORK\s+EXPERIENCE|EXPERIENCE|EDUCATION|ADDITIONAL|$))/i;
  const projMatch = rawText.match(projRegex);
  if (projMatch && projMatch[1]) {
    const projText = projMatch[1].trim();
    const blocks = projText.split(/\n(?=[A-Z0-9\s]{3,30}:|\n[A-Z0-9\s]{3,30}\n)/);
    for (const b of blocks) {
      const pLines = b.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (pLines.length) {
        const name = pLines[0].replace(/[:•]/g, '').trim();
        let tech = '';
        const descLines = [];
        for (let j = 1; j < pLines.length; j++) {
          const l = pLines[j];
          if (/Technologies:/i.test(l)) {
            tech = l.replace(/.*Technologies:\s*/i, '').trim();
          } else {
            descLines.push(l.replace(/^[•\-\*]\s*/, ''));
          }
        }
        if (name) {
          result.projects.push({
            name,
            tech: tech || 'Full Stack',
            description: descLines.join('\n')
          });
        }
      }
    }
  }

  // 9. Work Experience
  const expRegex = /(?:WORK\s+)?EXPERIENCE[:\-\s]+([\s\S]+?)(?=(?:PROJECTS|EDUCATION|ADDITIONAL|CERTIFICATIONS|$))/i;
  const expMatch = rawText.match(expRegex);
  if (expMatch && expMatch[1]) {
    const expText = expMatch[1].trim();
    const eLines = expText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (eLines.length) {
      const role = eLines[0] || 'Developer';
      const companyLine = eLines[1] || '';
      let period = '';
      let company = companyLine;
      if (companyLine.includes('|')) {
        const parts = companyLine.split('|').map(s => s.trim());
        company = parts[0];
        period = parts.slice(1).join(' | ');
      }
      const desc = eLines.slice(2).map(l => l.replace(/^[•\-\*]\s*/, '')).join('\n');
      result.experience.push({ role, company, period, description: desc });
    }
  }

  // 10. Education
  const eduRegex = /EDUCATION[:\-\s]+([\s\S]+?)(?=(?:ADDITIONAL|CERTIFICATIONS|PROJECTS|SKILLS|$))/i;
  const eduMatch = rawText.match(eduRegex);
  if (eduMatch && eduMatch[1]) {
    const eduLines = eduMatch[1].split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of eduLines) {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        result.education.push({
          degree: parts[0] || 'Degree',
          school: parts[1] || parts[2] || 'University',
          year: parts[parts.length - 1] || ''
        });
      } else if (line.length > 5) {
        result.education.push({ degree: line, school: '', year: '' });
      }
    }
  }

  // 11. Additional Information (Languages & Certifications)
  const addRegex = /ADDITIONAL\s+INFORMATION[:\-\s]+([\s\S]+?)$/i;
  const addMatch = rawText.match(addRegex);
  if (addMatch && addMatch[1]) {
    result.additionalInfo = addMatch[1].trim().replace(/\r?\n/g, ' • ');
  }

  // Defaults if empty
  if (!result.experience.length) result.experience.push({ company: '', role: '', period: '', description: '' });
  if (!result.projects.length) result.projects.push({ name: '', tech: '', description: '' });
  if (!result.education.length) result.education.push({ school: '', degree: '', year: '' });
  if (!result.skills) result.skills = 'JavaScript, React, Node.js, HTML, CSS';

  return result;
}

router.use(auth);

// File upload and parsing endpoint (.pdf, .docx, .txt, .json)
router.post('/parse-file', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select a resume file (.pdf, .docx, .txt, .json).' });
    }

    const origName = req.file.originalname || '';
    const ext = origName.toLowerCase().split('.').pop();
    let text = '';

    if (ext === 'pdf') {
      text = await parsePdfBuffer(req.file.buffer);
    } else if (ext === 'docx') {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = parsed.value || '';
    } else {
      // txt, json, md
      text = req.file.buffer.toString('utf-8');
    }

    if (!text.trim()) {
      return res.status(400).json({ message: 'Could not extract readable text from the uploaded file.' });
    }

    const data = extractResumeFromText(text);
    res.json({
      success: true,
      fileName: origName,
      data,
      rawText: text.slice(0, 5000)
    });
  } catch (e) {
    console.error('File parsing failed:', e);
    res.status(500).json({ message: 'Failed to process file: ' + e.message });
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        return res.json(await Resume.find({ user: req.userId }).sort({ updatedAt: -1 }).select('title updatedAt createdAt'));
      } catch (err) {
        console.warn('MongoDB query failed, using local store:', err.message);
      }
    }
    return res.json(localStore.findResumesByUser(req.userId));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const doc = await Resume.findOne({ _id: req.params.id, user: req.userId });
        if (doc) return res.json(doc);
      } catch (err) {
        console.warn('MongoDB query failed, checking local store:', err.message);
      }
    }
    const localDoc = localStore.findResumeById(req.params.id, req.userId);
    if (!localDoc) return res.status(404).json({ message: 'Resume not found.' });
    res.json(localDoc);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const doc = await Resume.create({ user: req.userId, title: req.body.title || 'My Resume', data: req.body.data || {} });
        return res.status(201).json(doc);
      } catch (err) {
        console.warn('MongoDB create failed, switching to local store:', err.message);
      }
    }
    const doc = localStore.createResume({ user: req.userId, title: req.body.title || 'My Resume', data: req.body.data || {} });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const doc = await Resume.findOneAndUpdate(
          { _id: req.params.id, user: req.userId },
          { title: req.body.title || 'My Resume', data: req.body.data || {} },
          { new: true, runValidators: true }
        );
        if (doc) return res.json(doc);
      } catch (err) {
        console.warn('MongoDB update failed, checking local store:', err.message);
      }
    }
    const doc = localStore.updateResume(req.params.id, req.userId, { title: req.body.title, data: req.body.data });
    if (!doc) return res.status(404).json({ message: 'Resume not found.' });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const doc = await Resume.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (doc) return res.json({ message: 'Resume deleted.' });
      } catch (err) {
        console.warn('MongoDB delete failed, checking local store:', err.message);
      }
    }
    const ok = localStore.deleteResume(req.params.id, req.userId);
    if (!ok) return res.status(404).json({ message: 'Resume not found.' });
    res.json({ message: 'Resume deleted.' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
