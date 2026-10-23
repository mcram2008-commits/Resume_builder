import React, { useEffect, useRef, useState } from 'react';
import {
  FileText, Sparkles, Download, LogOut, Plus, Trash2, Save, Eye,
  WandSparkles, UserRound, BriefcaseBusiness, GraduationCap, Code2,
  Target, CheckCircle, AlertCircle, Upload, Check, Copy, Briefcase,
  RefreshCw, X, FileUp, Palette, AlignLeft, AlignCenter, AlignRight,
  Type, SlidersHorizontal, Award, Languages, Layers, Camera, Image,
  FileDown, CheckSquare, ShieldCheck, ChevronDown, ChevronUp, PlusCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const emptyResume = () => ({
  fullName: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  summary: '',
  skills: 'JavaScript, React, Node.js, HTML, CSS',
  education: [{ school: '', degree: '', year: '' }],
  projects: [{ name: '', tech: '', description: '' }],
  experience: [{ company: '', role: '', period: '', description: '' }],
  certifications: [{ name: '', issuer: '', year: '' }],
  languages: [{ name: '', level: 'Fluent' }],
  customSections: [],     // [{ heading: '', content: '' }]
  additionalInfo: 'Certifications: Full Stack Web Development  •  Languages: English',
  photoUrl: '',
  photoShape: 'circle',   // 'circle' | 'rounded' | 'square' | 'none'
  template: 'modern',     // 'modern' | 'classic' | 'sidebar' | 'minimal' | 'creative'
  align: 'left',          // 'left' | 'center' | 'right'
  accentColor: '#4f46e5', // indigo default
  fontFamily: 'sans',     // 'sans' | 'serif' | 'mono'
  fontSize: 'normal',     // 'compact' | 'normal' | 'large'
  spacing: 'normal'       // 'compact' | 'normal' | 'spacious'
});

const ramkumarSample = () => ({
  fullName: 'RAMKUMAR M',
  role: 'Full Stack Developer',
  email: 'mcram2008@gmail.com',
  phone: '6379782142',
  location: 'Dharmapuri-635205, Tamil Nadu, India',
  website: 'github.com/mcram2008-commits  •  portfolio42ramkumar.netlify.app',
  summary: 'Full Stack Developer skilled in React.js, Node.js, Express.js, REST APIs, and MySQL. Experienced in building responsive, user-friendly web applications with modern technologies. Passionate about problem-solving, clean code, and developing scalable web solutions.',
  skills: 'React.js, Node.js, Express.js, JavaScript, Python, MySQL, SQL, HTML, CSS, REST APIs, Git, GitHub, VS Code',
  experience: [
    {
      company: 'AI Tech Gen Technologies',
      role: 'Web Development Intern',
      period: 'Jul 2026 – Aug 2026 (Remote)',
      description: '• Developed and maintained static and dynamic web pages using HTML, CSS, JavaScript, and modern web development practices.\n• Implemented responsive and user-friendly interfaces based on project requirements.\n• Applied problem-solving and debugging skills to identify and resolve development issues.\n• Collaborated on assigned development tasks while gaining practical experience in the web development lifecycle.'
    }
  ],
  projects: [
    {
      name: 'MEI Lunch',
      tech: 'React.js, Node.js, Python, MySQL, REST APIs, LLM',
      description: '• Developed a full-stack Lunch Management System using React.js, Node.js, Python, and MySQL.\n• Implemented user authentication, registration, and automated email/SMS notifications to streamline user communication.\n• Integrated LLM capabilities and REST APIs to enable personalized messaging and improve data management workflows.'
    },
    {
      name: 'LOCAL BUSINESS MARKETPLACE',
      tech: 'React.js, Node.js, Express.js, SQL, JavaScript, HTML, CSS',
      description: '• Developed a platform connecting local businesses with customers for services and bookings.\n• Implemented business registration, location management, slot booking, and admin verification.\n• Built responsive UI and integrated REST APIs with SQL database operations.'
    }
  ],
  education: [
    {
      degree: 'B.Tech(IT) · CGPA: 84.7%',
      school: 'Mahendra Institute of Technology (Anna University), Namakkal',
      year: '2023–2027'
    },
    {
      degree: 'HSE (State Board) · 79.33%',
      school: 'Government Higher Secondary School, Begarahalli',
      year: '2021–2023'
    }
  ],
  certifications: [
    { name: 'Learnathon-2024 (8 Technical Courses Completed)', issuer: 'ICT Academy', year: '2024' },
    { name: 'CCICS IEEE International Conference Research Paper', issuer: 'IEEE', year: '2025' }
  ],
  languages: [
    { name: 'Tamil', level: 'Native / Bilingual' },
    { name: 'English', level: 'Professional Working' }
  ],
  customSections: [
    {
      heading: 'Key Achievements & Honors',
      content: '• Won 1st place in State-level Web Development Hackathon 2024\n• Published research paper in IEEE International Conference CCICS 2025'
    }
  ],
  additionalInfo: 'Certifications: Learnathon-2024, CCICS IEEE  •  Languages: Tamil, English',
  photoUrl: '',
  photoShape: 'circle',
  template: 'modern',
  align: 'left',
  accentColor: '#4f46e5',
  fontFamily: 'sans',
  fontSize: 'normal',
  spacing: 'normal'
});

const TEMPLATES = [
  { id: 'modern', name: '1. Modern Tech', desc: 'Contemporary layout with colored accent lines and modern badges' },
  { id: 'classic', name: '2. Classic ATS', desc: 'Clean traditional monochrome, optimal for ATS corporate parsing' },
  { id: 'sidebar', name: '3. Executive Sidebar', desc: 'Organized two-column format with contact & skills sidebar' },
  { id: 'minimal', name: '4. Minimalist Frame', desc: 'Subtle borders, clean spacing, and modern typography' },
  { id: 'creative', name: '5. Creative Slate', desc: 'Full-width top colored banner with standout project cards' }
];

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#4f46e5', bg: 'bg-indigo-600' },
  { name: 'Emerald', value: '#059669', bg: 'bg-emerald-600' },
  { name: 'Sky Navy', value: '#0284c7', bg: 'bg-sky-600' },
  { name: 'Slate', value: '#334155', bg: 'bg-slate-700' },
  { name: 'Ruby', value: '#dc2626', bg: 'bg-rose-600' },
  { name: 'Amber Gold', value: '#d97706', bg: 'bg-amber-600' },
  { name: 'Violet', value: '#7c3aed', bg: 'bg-violet-600' },
  { name: 'Teal', value: '#0d9488', bg: 'bg-teal-600' }
];

const LANGUAGE_LEVELS = [
  'Native / Bilingual',
  'Fluent / Full Professional',
  'Professional Working',
  'Intermediate',
  'Elementary / Basic'
];

const SAMPLE_JOBS = [
  {
    title: 'Full Stack Developer',
    label: '🚀 Full Stack (React & Node.js)',
    description: `We are seeking a talented Full Stack Developer skilled in React.js, Node.js, Express.js, and SQL/MySQL. Responsibilities include designing and developing full-stack web applications, architecting robust RESTful APIs, implementing user authentication, optimizing database queries, and collaborating with cross-functional teams using Git and GitHub. Experience with TypeScript, Python, Docker, and modern styling libraries (Tailwind CSS) is a strong plus.`
  },
  {
    title: 'Frontend React Developer',
    label: '💻 Frontend (React & Next.js)',
    description: `Looking for a Frontend Developer with proven expertise in React.js, TypeScript, Next.js, HTML5, CSS3, and Tailwind CSS. The candidate will translate design mockups into responsive, high-performance web applications, manage complex client-side state using Redux or Zustand, integrate with backend REST APIs, and write clean unit tests using Jest.`
  },
  {
    title: 'Backend Node.js Engineer',
    label: '⚙️ Backend (Node.js & MySQL)',
    description: `Hiring a Backend Engineer to build and scale server-side applications and microservices. Must have deep experience in Node.js, Express.js, MySQL, PostgreSQL, Redis, RESTful API design, authentication (JWT/OAuth), and automated testing. Knowledge of CI/CD pipelines, Docker, and cloud platforms (AWS/GCP) is preferred.`
  },
  {
    title: 'Junior Web Developer / Intern',
    label: '🎓 Junior Web Dev / Intern',
    description: `Exciting opportunity for a Junior Web Developer or Intern with a strong foundation in JavaScript, HTML5, CSS3, React.js, and basic Node.js backend integration. Must demonstrate strong problem-solving skills, willingness to learn new technologies, passion for clean code, and familiarity with Git and GitHub.`
  }
];

function parseResumeText(raw) {
  try {
    const json = JSON.parse(raw);
    if (json && (json.fullName || json.skills || json.experience || json.role)) {
      return { ...emptyResume(), ...json };
    }
  } catch {}

  const parsed = emptyResume();
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return parsed;

  const emailMatch = raw.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) parsed.email = emailMatch[1];

  const phoneMatch = raw.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b)/);
  if (phoneMatch) parsed.phone = phoneMatch[0];

  if (lines[0] && lines[0].length < 40 && !lines[0].includes('@')) {
    parsed.fullName = lines[0];
  }
  if (lines[1] && lines[1].length < 50 && !lines[1].includes('@') && !phoneMatch?.includes(lines[1])) {
    parsed.role = lines[1];
  }

  const skillsMatch = raw.match(/skills?[:\-\s]+([^\n\r]+)/i);
  if (skillsMatch && skillsMatch[1]) {
    parsed.skills = skillsMatch[1].trim();
  }

  const summaryMatch = raw.match(/(?:summary|objective|profile|about me)[:\-\s]+([\s\S]+?)(?=(skills|experience|education|projects|$))/i);
  if (summaryMatch && summaryMatch[1].trim()) {
    parsed.summary = summaryMatch[1].trim().slice(0, 500);
  }

  return parsed;
}

async function request(path, token, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Request failed');
  return body;
}

const Field = ({ label, value, onChange, placeholder = '', area = false }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    {area ? (
      <textarea
        className="mt-1.5"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        className="mt-1.5"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </label>
);

function Auth({ onAuth }) {
  const [mode, setMode] = useState('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await request(`/auth/${mode}`, null, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      onAuth(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">
      <section className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="rounded-xl bg-indigo-500 p-2"><FileText /></span> ResumeCraft AI
        </div>
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm text-indigo-200">
            <Sparkles size={15}/> 5 Professional Resume Formats & AI Tailor
          </p>
          <h1 className="max-w-lg text-5xl font-bold leading-tight">
            Turn your experience into a resume that stands out.
          </h1>
          <p className="mt-5 max-w-md text-slate-300">
            Upload any resume (PDF, Word, or text), choose from 5 beautiful layouts, align content to your preference, and tailor to job descriptions.
          </p>
        </div>
        <p className="text-sm text-slate-400">Your story. Your next step.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 text-xl font-bold lg:hidden">
            <span className="rounded-xl bg-indigo-600 p-2 text-white"><FileText /></span> ResumeCraft AI
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            {mode === 'register' ? 'Get started free' : 'Welcome back'}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {mode === 'register' ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-slate-500">Upload, customize formats, and tailor your resumes with AI.</p>
          <div className="mt-7 space-y-4">
            {mode === 'register' && <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />}
            <Field label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password (minimum 8 characters)" value={password} onChange={setPassword} placeholder="••••••••" />
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
          <p className="mt-5 text-center text-sm text-slate-600">
            {mode === 'register' ? 'Already have an account?' : 'New to ResumeCraft?'} {' '}
            <button
              type="button"
              className="font-semibold text-indigo-600"
              onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
            >
              {mode === 'register' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

function SectionTitle({ icon: Icon, title, children }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        <Icon size={18} className="text-indigo-600"/>{title}
      </h3>
      {children}
    </div>
  );
}

// -------------------------------------------------------------
// FLOWCV ATS TOOLS & SCORING HELPERS
// -------------------------------------------------------------
function generateAtsPlainText(data) {
  const lines = [];
  if (data.fullName) lines.push(data.fullName.toUpperCase());
  if (data.role) lines.push(data.role);

  const contacts = [data.email, data.phone, data.location, data.website].filter(Boolean);
  if (contacts.length) lines.push(contacts.join(' | '));
  lines.push('------------------------------------------------------------');

  if (data.summary) {
    lines.push('\nPROFESSIONAL SUMMARY');
    lines.push(data.summary);
  }

  if (data.skills) {
    lines.push('\nTECHNICAL SKILLS');
    lines.push(data.skills);
  }

  const validExp = (data.experience || []).filter(e => e.company || e.role || e.description);
  if (validExp.length) {
    lines.push('\nWORK EXPERIENCE');
    validExp.forEach(e => {
      lines.push(`${e.role || 'Role'} - ${e.company || 'Company'} (${e.period || ''})`);
      if (e.description) lines.push(e.description);
      lines.push('');
    });
  }

  const validProj = (data.projects || []).filter(p => p.name || p.description);
  if (validProj.length) {
    lines.push('\nFEATURED PROJECTS');
    validProj.forEach(p => {
      lines.push(`${p.name} ${p.tech ? `[${p.tech}]` : ''}`);
      if (p.description) lines.push(p.description);
      lines.push('');
    });
  }

  const validEdu = (data.education || []).filter(e => e.school || e.degree);
  if (validEdu.length) {
    lines.push('\nEDUCATION');
    validEdu.forEach(e => {
      lines.push(`${e.degree} - ${e.school} (${e.year})`);
    });
  }

  const validCerts = (data.certifications || []).filter(c => c.name);
  if (validCerts.length) {
    lines.push('\nCERTIFICATIONS & LICENSES');
    validCerts.forEach(c => {
      lines.push(`• ${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.year ? ` (${c.year})` : ''}`);
    });
  }

  const validLangs = (data.languages || []).filter(l => l.name);
  if (validLangs.length) {
    lines.push('\nLANGUAGES');
    validLangs.forEach(l => {
      lines.push(`• ${l.name}${l.level ? ` (${l.level})` : ''}`);
    });
  }

  const validCustom = (data.customSections || []).filter(s => s.heading || s.content);
  if (validCustom.length) {
    validCustom.forEach(s => {
      lines.push(`\n${(s.heading || 'ADDITIONAL SECTION').toUpperCase()}`);
      if (s.content) lines.push(s.content);
    });
  }

  if (data.additionalInfo) {
    lines.push('\nADDITIONAL INFORMATION');
    lines.push(data.additionalInfo);
  }

  return lines.join('\n');
}

function calculateResumeHealth(data) {
  const checks = [];

  // 1. Contact info
  const hasName = Boolean(data.fullName?.trim());
  const hasEmail = Boolean(data.email?.trim());
  const hasPhone = Boolean(data.phone?.trim());
  const hasLocation = Boolean(data.location?.trim());
  const contactCount = [hasName, hasEmail, hasPhone, hasLocation].filter(Boolean).length;
  checks.push({
    id: 'contact',
    label: 'Contact Information',
    desc: contactCount >= 3 ? 'Full name, email, and phone ready' : 'Add name, email, phone number, and location',
    status: contactCount >= 3 ? 'pass' : 'warn',
    points: contactCount >= 4 ? 15 : contactCount >= 3 ? 12 : contactCount * 3
  });

  // 2. Summary
  const summaryWords = (data.summary || '').trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    id: 'summary',
    label: 'Professional Summary',
    desc: summaryWords >= 25 ? `${summaryWords} words (optimal length)` : 'Aim for 25–60 words highlighting core strengths',
    status: summaryWords >= 25 ? 'pass' : 'warn',
    points: summaryWords >= 25 ? 15 : summaryWords > 10 ? 8 : 0
  });

  // 3. Technical Skills
  const skillCount = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean).length;
  checks.push({
    id: 'skills',
    label: 'Core Skills Keywords',
    desc: skillCount >= 6 ? `${skillCount} skills identified` : 'Include 6+ specific tech stack keywords for ATS filters',
    status: skillCount >= 6 ? 'pass' : 'warn',
    points: skillCount >= 6 ? 20 : skillCount >= 3 ? 12 : skillCount > 0 ? 6 : 0
  });

  // 4. Experience / Internships
  const validExp = (data.experience || []).filter(e => e.company || e.role || e.description);
  const hasGoodBullets = validExp.some(e => (e.description || '').length > 30);
  checks.push({
    id: 'experience',
    label: 'Work Experience / Internships',
    desc: validExp.length > 0 && hasGoodBullets ? `${validExp.length} position(s) with bullet points` : 'Add positions with measurable achievements and actions',
    status: validExp.length > 0 && hasGoodBullets ? 'pass' : 'warn',
    points: validExp.length > 0 && hasGoodBullets ? 20 : validExp.length > 0 ? 10 : 0
  });

  // 5. Featured Projects
  const validProj = (data.projects || []).filter(p => p.name || p.description);
  const hasTech = validProj.some(p => p.tech);
  checks.push({
    id: 'projects',
    label: 'Projects & Tech Stacks',
    desc: validProj.length >= 2 ? `${validProj.length} projects documented` : 'List 2+ real-world projects with technologies used',
    status: validProj.length >= 2 && hasTech ? 'pass' : validProj.length >= 1 ? 'warn' : 'warn',
    points: validProj.length >= 2 && hasTech ? 15 : validProj.length >= 1 ? 9 : 0
  });

  // 6. Education
  const validEdu = (data.education || []).filter(e => e.school || e.degree);
  checks.push({
    id: 'education',
    label: 'Education & Degree',
    desc: validEdu.length > 0 ? `${validEdu.length} entry verified` : 'Add degree, institution, and graduation year',
    status: validEdu.length > 0 ? 'pass' : 'warn',
    points: validEdu.length > 0 ? 10 : 0
  });

  // 7. Certifications & Languages
  const validCerts = (data.certifications || []).filter(c => c.name);
  const validLangs = (data.languages || []).filter(l => l.name);
  const hasCredentials = validCerts.length > 0 || validLangs.length > 0 || Boolean(data.additionalInfo?.trim());
  checks.push({
    id: 'credentials',
    label: 'Certifications & Languages',
    desc: hasCredentials ? `${validCerts.length} cert(s), ${validLangs.length} language(s)` : 'Add industry certifications or language proficiencies',
    status: hasCredentials ? 'pass' : 'warn',
    points: hasCredentials ? 5 : 0
  });

  const totalScore = Math.min(100, checks.reduce((sum, c) => sum + c.points, 0));
  const rating = totalScore >= 85 ? 'Excellent (ATS Ready)' : totalScore >= 70 ? 'Good (Strong Foundation)' : 'Needs Enhancement';
  const color = totalScore >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : totalScore >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-rose-700 bg-rose-50 border-rose-200';
  const progressBg = totalScore >= 85 ? 'bg-emerald-500' : totalScore >= 70 ? 'bg-amber-500' : 'bg-rose-500';

  return { totalScore, rating, color, progressBg, checks };
}

function AtsHealthWidget({ data, onFixSection }) {
  const [expanded, setExpanded] = useState(false);
  const health = calculateResumeHealth(data);

  return (
    <div className="no-print mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">ATS Content Health & Completeness</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${health.color}`}>
                {health.totalScore}% · {health.rating}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time analysis for contact, summary, skills, and experience
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          {expanded ? 'Hide Checklist' : 'Review Checklist (7 Checks)'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${health.progressBg}`}
          style={{ width: `${health.totalScore}%` }}
        />
      </div>

      {/* Expandable 7-point Checklist */}
      {expanded && (
        <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
          {health.checks.map(chk => (
            <div
              key={chk.id}
              className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition ${
                chk.status === 'pass' ? 'bg-emerald-50/60 border border-emerald-100' : 'bg-amber-50/60 border border-amber-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {chk.status === 'pass' ? (
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                )}
                <div>
                  <strong className={chk.status === 'pass' ? 'text-emerald-950 font-semibold' : 'text-amber-950 font-semibold'}>
                    {chk.label}
                  </strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">{chk.desc}</p>
                </div>
              </div>

              <span className={`shrink-0 font-bold px-2 py-0.5 rounded text-[11px] ${
                chk.status === 'pass' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'
              }`}>
                +{chk.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// DYNAMIC 5-TEMPLATE RESUME PREVIEW
// -------------------------------------------------------------
function ResumePreview({ data }) {
  const template = data.template || 'modern';
  const align = data.align || 'left';
  const accent = data.accentColor || '#4f46e5';
  const fontClass = data.fontFamily === 'serif' ? 'font-serif' : data.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = data.spacing === 'compact' ? 'space-y-3' : data.spacing === 'spacious' ? 'space-y-6' : 'space-y-4.5';

  // Font scale (FlowCV sizing)
  const fontSize = data.fontSize || 'normal';
  const fontScaleClass = fontSize === 'compact' ? 'text-[12.5px] leading-snug' : fontSize === 'large' ? 'text-[15px] leading-relaxed' : 'text-sm leading-normal';

  // Photo configuration
  const photoShape = data.photoShape || 'circle';
  const photoShapeClass = photoShape === 'square' ? 'rounded-none' : photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-full';
  const showPhoto = Boolean(data.photoUrl && photoShape !== 'none');

  const skills = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const contacts = [data.email, data.phone, data.location, data.website].filter(Boolean);
  const certifications = (data.certifications || []).filter(c => c.name);
  const languages = (data.languages || []).filter(l => l.name);

  const alignClass = align === 'center' ? 'text-center items-center justify-center' : align === 'right' ? 'text-right items-end justify-end' : 'text-left items-start justify-start';

  // -----------------------------------------------------------
  // TEMPLATE 1: MODERN TECH
  // -----------------------------------------------------------
  if (template === 'modern') {
    return (
      <article id="resume-print" className={`print-area mx-auto min-h-[960px] w-full max-w-[800px] bg-white p-8 sm:p-10 shadow-xl ${fontClass} ${fontScaleClass} ${spacingClass}`}>
        <header className={`border-b-2 pb-5 flex flex-wrap items-center gap-4 ${align === 'center' ? 'flex-col text-center justify-center' : align === 'right' ? 'flex-row-reverse text-right justify-between' : 'justify-between text-left'}`} style={{ borderColor: accent }}>
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{data.fullName || 'Your Name'}</h1>
            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>{data.role || 'Full Stack Developer'}</p>
            {contacts.length > 0 && (
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed break-words">
                {contacts.join('  •  ')}
              </p>
            )}
          </div>
          {showPhoto && (
            <img
              src={data.photoUrl}
              alt={data.fullName || 'Profile'}
              className={`h-20 w-20 object-cover border-2 shadow-sm shrink-0 ${photoShapeClass}`}
              style={{ borderColor: accent }}
            />
          )}
        </header>

        {data.summary && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Professional Summary</h2>
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">{data.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="mb-2.5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Technical Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.experience?.some(x => x.company || x.role || x.description) && (
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Work Experience</h2>
            {data.experience.filter(x => x.company || x.role || x.description).map((x, i) => (
              <div key={i} className="mb-3.5">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <strong className="text-sm text-slate-900">{x.role || 'Role'}{x.company ? ` · ${x.company}` : ''}</strong>
                  <span className="text-xs font-medium text-slate-500">{x.period}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">{x.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.projects?.some(x => x.name || x.description) && (
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Projects</h2>
            {data.projects.filter(x => x.name || x.description).map((x, i) => (
              <div key={i} className="mb-3.5">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <strong className="text-sm text-slate-900">{x.name || 'Project'}</strong>
                  {x.tech && <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${accent}15`, color: accent }}>{x.tech}</span>}
                </div>
                <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">{x.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.education?.some(x => x.school || x.degree) && (
          <section>
            <h2 className="mb-2.5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Education</h2>
            {data.education.filter(x => x.school || x.degree).map((x, i) => (
              <div key={i} className="mb-2 flex flex-wrap justify-between items-baseline gap-2">
                <div>
                  <strong className="text-sm text-slate-900">{x.degree}</strong>
                  <p className="text-xs text-slate-600">{x.school}</p>
                </div>
                <span className="text-xs font-medium text-slate-500">{x.year}</span>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="mb-2.5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Certifications & Licenses</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {certifications.map((c, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs">
                  <div className="flex justify-between items-baseline gap-2">
                    <strong className="text-slate-900 font-semibold">{c.name}</strong>
                    {c.year && <span className="text-[11px] font-medium text-slate-500 shrink-0">{c.year}</span>}
                  </div>
                  {c.issuer && <p className="text-[11px] text-slate-600 mt-0.5">{c.issuer}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((l, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                  <strong>{l.name}</strong>
                  {l.level && <span className="text-slate-500">({l.level})</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.customSections?.filter(x => x.heading || x.content).map((sec, i) => (
          <section key={i}>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
              {sec.heading || 'Custom Section'}
            </h2>
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">
              {sec.content}
            </p>
          </section>
        ))}

        {data.additionalInfo && (
          <section className="border-t pt-3">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Additional Information</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{data.additionalInfo}</p>
          </section>
        )}
      </article>
    );
  }

  // -----------------------------------------------------------
  // TEMPLATE 2: CLASSIC ATS / CORPORATE (Traditional, Clean lines)
  // -----------------------------------------------------------
  if (template === 'classic') {
    return (
      <article id="resume-print" className={`print-area mx-auto min-h-[960px] w-full max-w-[800px] bg-white p-8 sm:p-10 shadow-xl ${fontClass} ${fontScaleClass} ${spacingClass}`}>
        <header className={`border-b-2 border-slate-900 pb-4 flex flex-wrap items-center gap-4 ${align === 'center' ? 'flex-col text-center justify-center' : align === 'right' ? 'flex-row-reverse text-right justify-between' : 'justify-between text-left'}`}>
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-950">{data.fullName || 'Your Name'}</h1>
            <p className="mt-1 text-base font-medium tracking-wide text-slate-700">{data.role || 'Full Stack Developer'}</p>
            {contacts.length > 0 && (
              <p className="mt-2 text-xs text-slate-600 tracking-normal break-words">
                {contacts.join(' | ')}
              </p>
            )}
          </div>
          {showPhoto && (
            <img
              src={data.photoUrl}
              alt={data.fullName || 'Profile'}
              className={`h-20 w-20 object-cover border border-slate-400 shadow-2xs shrink-0 ${photoShapeClass}`}
            />
          )}
        </header>

        {data.summary && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Summary</h2>
            <p className="mt-2 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-800">{data.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Technical Skills</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-800">{skills.join(' • ')}</p>
          </section>
        )}

        {data.experience?.some(x => x.company || x.role || x.description) && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Experience</h2>
            {data.experience.filter(x => x.company || x.role || x.description).map((x, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-wrap justify-between items-baseline">
                  <strong className="text-sm font-bold text-slate-900">{x.role} — <span className="font-semibold italic text-slate-700">{x.company}</span></strong>
                  <span className="text-xs text-slate-600">{x.period}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-800">{x.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.projects?.some(x => x.name || x.description) && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Projects</h2>
            {data.projects.filter(x => x.name || x.description).map((x, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-wrap justify-between items-baseline">
                  <strong className="text-sm font-bold text-slate-900">{x.name}</strong>
                  {x.tech && <span className="text-xs italic text-slate-600">[{x.tech}]</span>}
                </div>
                <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-800">{x.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.education?.some(x => x.school || x.degree) && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Education</h2>
            {data.education.filter(x => x.school || x.degree).map((x, i) => (
              <div key={i} className="mt-2 flex flex-wrap justify-between items-baseline">
                <div>
                  <strong className="text-sm text-slate-900">{x.degree}</strong>
                  <p className="text-xs text-slate-700">{x.school}</p>
                </div>
                <span className="text-xs text-slate-600">{x.year}</span>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Certifications & Licenses</h2>
            <div className="mt-2 space-y-1.5 text-xs text-slate-800">
              {certifications.map((c, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <span>• <strong>{c.name}</strong>{c.issuer ? ` (${c.issuer})` : ''}</span>
                  {c.year && <span className="text-slate-600">{c.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Languages</h2>
            <p className="mt-2 text-xs text-slate-800">
              {languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(' • ')}
            </p>
          </section>
        )}

        {data.customSections?.filter(x => x.heading || x.content).map((sec, i) => (
          <section key={i}>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
              {sec.heading || 'Custom Section'}
            </h2>
            <p className="mt-2 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-800">
              {sec.content}
            </p>
          </section>
        ))}

        {data.additionalInfo && (
          <section>
            <h2 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">Additional Information</h2>
            <p className="mt-2 text-xs text-slate-800 leading-relaxed">{data.additionalInfo}</p>
          </section>
        )}
      </article>
    );
  }

  // -----------------------------------------------------------
  // TEMPLATE 3: EXECUTIVE SIDEBAR (Two-Column Layout)
  // -----------------------------------------------------------
  if (template === 'sidebar') {
    return (
      <article id="resume-print" className={`print-area mx-auto min-h-[960px] w-full max-w-[800px] bg-white shadow-xl ${fontClass} ${fontScaleClass} flex flex-col md:flex-row overflow-hidden`}>
        {/* Left Sidebar */}
        <aside className="w-full md:w-[34%] bg-slate-50 border-r border-slate-200 p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Prominent Profile Photo at Top of Sidebar */}
            {showPhoto && (
              <div className="flex justify-center mb-3">
                <img
                  src={data.photoUrl}
                  alt={data.fullName || 'Profile'}
                  className={`h-24 w-24 object-cover border-2 shadow-md ${photoShapeClass}`}
                  style={{ borderColor: accent }}
                />
              </div>
            )}

            <div className={alignClass}>
              <h1 className="text-2xl font-bold text-slate-900">{data.fullName || 'Your Name'}</h1>
              <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>{data.role || 'Full Stack Developer'}</p>
            </div>

            {/* Contact details in sidebar */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Contact</h3>
              <div className="space-y-1.5 text-xs text-slate-700 break-words">
                {data.email && <p className="truncate">✉️ {data.email}</p>}
                {data.phone && <p>📞 {data.phone}</p>}
                {data.location && <p>📍 {data.location}</p>}
                {data.website && <p className="text-[11px] leading-tight">🌐 {data.website}</p>}
              </div>
            </div>

            {/* Skills in sidebar */}
            {skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-800 shadow-2xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages in sidebar */}
            {languages.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Languages</h3>
                <div className="space-y-1 text-xs">
                  {languages.map((l, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-800">{l.name}</span>
                      <span className="text-slate-500 text-[10px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education in sidebar */}
            {data.education?.some(x => x.school || x.degree) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Education</h3>
                <div className="space-y-2 text-xs">
                  {data.education.filter(x => x.school || x.degree).map((x, i) => (
                    <div key={i} className="border-l-2 pl-2" style={{ borderColor: accent }}>
                      <p className="font-bold text-slate-900">{x.degree}</p>
                      <p className="text-slate-600 text-[11px]">{x.school}</p>
                      <p className="text-slate-400 text-[10px]">{x.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications in sidebar */}
            {certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Certifications</h3>
                <div className="space-y-1.5 text-xs">
                  {certifications.map((c, i) => (
                    <div key={i} className="rounded border border-slate-200 bg-white p-1.5 text-[11px]">
                      <strong className="text-slate-800 block truncate">{c.name}</strong>
                      <span className="text-slate-500 text-[10px]">{c.issuer} {c.year ? `· ${c.year}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.additionalInfo && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Info & Certs</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{data.additionalInfo}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Body */}
        <main className={`w-full md:w-[66%] p-6 sm:p-8 ${spacingClass}`}>
          {data.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Professional Profile</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">{data.summary}</p>
            </section>
          )}

          {data.experience?.some(x => x.company || x.role || x.description) && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Experience</h2>
              <div className="mt-3 space-y-3.5">
                {data.experience.filter(x => x.company || x.role || x.description).map((x, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <strong className="text-sm font-bold text-slate-900">{x.role} · <span className="text-slate-600 font-normal">{x.company}</span></strong>
                      <span className="text-xs text-slate-500">{x.period}</span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">{x.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects?.some(x => x.name || x.description) && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Featured Projects</h2>
              <div className="mt-3 space-y-3.5">
                {data.projects.filter(x => x.name || x.description).map((x, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-sm font-bold text-slate-900">{x.name}</strong>
                      {x.tech && <span className="text-[11px] font-semibold text-slate-600">{x.tech}</span>}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700 whitespace-pre-line">{x.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.customSections?.filter(x => x.heading || x.content).map((sec, i) => (
            <section key={i}>
              <h2 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>
                {sec.heading || 'Custom Section'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {sec.content}
              </p>
            </section>
          ))}
        </main>
      </article>
    );
  }

  // -----------------------------------------------------------
  // TEMPLATE 4: MINIMALIST FRAME (Delicate borders & spacious clean feel)
  // -----------------------------------------------------------
  if (template === 'minimal') {
    return (
      <article id="resume-print" className={`print-area mx-auto min-h-[960px] w-full max-w-[800px] bg-white p-8 sm:p-11 shadow-xl border-t-8 ${fontClass} ${fontScaleClass} ${spacingClass}`} style={{ borderColor: accent }}>
        <header className={`pb-4 border-b border-slate-100 flex flex-wrap items-center gap-4 ${align === 'center' ? 'flex-col text-center justify-center' : align === 'right' ? 'flex-row-reverse text-right justify-between' : 'justify-between text-left'}`}>
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-3xl font-light tracking-wide text-slate-900 uppercase">
              <span className="font-bold">{data.fullName?.split(' ')[0]}</span> {data.fullName?.split(' ').slice(1).join(' ')}
            </h1>
            <p className="mt-1 text-sm font-medium tracking-widest uppercase text-slate-500">{data.role || 'Full Stack Developer'}</p>
            {contacts.length > 0 && (
              <p className="mt-2 text-xs text-slate-400 break-words">
                {contacts.join(' / ')}
              </p>
            )}
          </div>
          {showPhoto && (
            <img
              src={data.photoUrl}
              alt={data.fullName || 'Profile'}
              className={`h-20 w-20 object-cover border border-slate-200 shrink-0 ${photoShapeClass}`}
            />
          )}
        </header>

        {data.summary && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">About</h2>
            <p className="mt-1.5 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">{data.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Core Competencies</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-sm">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.experience?.some(x => x.company || x.role || x.description) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Experience</h2>
            <div className="mt-2 space-y-3">
              {data.experience.filter(x => x.company || x.role || x.description).map((x, i) => (
                <div key={i} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                  <div className="flex justify-between items-baseline">
                    <strong className="text-sm text-slate-900">{x.role} <span className="font-normal text-slate-500">at {x.company}</span></strong>
                    <span className="text-xs text-slate-400">{x.period}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">{x.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects?.some(x => x.name || x.description) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Selected Work</h2>
            <div className="mt-2 space-y-3">
              {data.projects.filter(x => x.name || x.description).map((x, i) => (
                <div key={i} className="border border-slate-200/80 rounded p-3">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-sm font-medium text-slate-900">{x.name}</strong>
                    {x.tech && <span className="text-xs text-slate-500 font-mono">{x.tech}</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{x.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.some(x => x.school || x.degree) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Education</h2>
            <div className="mt-2 space-y-1.5">
              {data.education.filter(x => x.school || x.degree).map((x, i) => (
                <div key={i} className="flex justify-between items-baseline text-xs">
                  <div><strong className="text-slate-800">{x.degree}</strong> — <span className="text-slate-500">{x.school}</span></div>
                  <span className="text-slate-400">{x.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Certifications</h2>
            <div className="mt-2 space-y-1.5 text-xs">
              {certifications.map((c, i) => (
                <div key={i} className="flex justify-between items-baseline text-slate-700">
                  <span><strong>{c.name}</strong> — {c.issuer}</span>
                  <span className="text-slate-400">{c.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Languages</h2>
            <p className="mt-1.5 text-xs text-slate-700">
              {languages.map(l => `${l.name} (${l.level})`).join('  /  ')}
            </p>
          </section>
        )}

        {data.customSections?.filter(x => x.heading || x.content).map((sec, i) => (
          <section key={i}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {sec.heading || 'Custom Section'}
            </h2>
            <p className="mt-1.5 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">
              {sec.content}
            </p>
          </section>
        ))}

        {data.additionalInfo && (
          <section className="text-xs text-slate-500 pt-2 border-t">
            {data.additionalInfo}
          </section>
        )}
      </article>
    );
  }

  // -----------------------------------------------------------
  // TEMPLATE 5: CREATIVE SLATE BANNER (Bold colored banner header)
  // -----------------------------------------------------------
  return (
    <article id="resume-print" className={`print-area mx-auto min-h-[960px] w-full max-w-[800px] bg-white shadow-xl ${fontClass} ${fontScaleClass} overflow-hidden`}>
      {/* Top Banner */}
      <header className={`p-8 sm:p-10 text-white flex flex-wrap items-center gap-6 ${align === 'center' ? 'flex-col text-center justify-center' : align === 'right' ? 'flex-row-reverse text-right justify-between' : 'justify-between text-left'}`} style={{ backgroundColor: accent }}>
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{data.fullName || 'Your Name'}</h1>
          <p className="mt-1 text-lg font-medium opacity-90">{data.role || 'Full Stack Developer'}</p>
          {contacts.length > 0 && (
            <div className={`mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-85 break-words ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
              {contacts.map((c, i) => (
                <span key={i}>• {c}</span>
              ))}
            </div>
          )}
        </div>
        {showPhoto && (
          <img
            src={data.photoUrl}
            alt={data.fullName || 'Profile'}
            className={`h-24 w-24 object-cover border-4 border-white/60 shadow-lg shrink-0 ${photoShapeClass}`}
          />
        )}
      </header>

      <div className={`p-8 sm:p-10 ${spacingClass}`}>
        {data.summary && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Executive Summary</h2>
            </div>
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700 pl-3">{data.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Skills & Tooling</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-3">
              {skills.map((s, i) => (
                <span key={i} className="rounded-full px-3 py-1 text-xs font-semibold shadow-2xs" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.experience?.some(x => x.company || x.role || x.description) && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Work History</h2>
            </div>
            <div className="pl-3 space-y-3">
              {data.experience.filter(x => x.company || x.role || x.description).map((x, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-sm font-bold text-slate-900">{x.role} · {x.company}</strong>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">{x.period}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700">{x.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects?.some(x => x.name || x.description) && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Key Projects</h2>
            </div>
            <div className="pl-3 space-y-3">
              {data.projects.filter(x => x.name || x.description).map((x, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-sm font-bold text-slate-900">{x.name}</strong>
                    {x.tech && <span className="text-xs font-medium text-slate-500">{x.tech}</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700">{x.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.some(x => x.school || x.degree) && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Education</h2>
            </div>
            <div className="pl-3 space-y-1.5">
              {data.education.filter(x => x.school || x.degree).map((x, i) => (
                <div key={i} className="flex justify-between items-baseline text-xs">
                  <div><strong className="text-slate-900">{x.degree}</strong> — <span className="text-slate-600">{x.school}</span></div>
                  <span className="text-slate-500">{x.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Certifications</h2>
            </div>
            <div className="pl-3 grid gap-2 sm:grid-cols-2">
              {certifications.map((c, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-slate-900">{c.name}</strong>
                    {c.year && <span className="text-[11px] font-medium text-slate-500">{c.year}</span>}
                  </div>
                  {c.issuer && <p className="text-[11px] text-slate-600">{c.issuer}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Languages</h2>
            </div>
            <div className="pl-3 flex flex-wrap gap-2">
              {languages.map((l, i) => (
                <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                  {l.name} {l.level && <span className="text-slate-500">({l.level})</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.customSections?.filter(x => x.heading || x.content).map((sec, i) => (
          <section key={i}>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3 w-1 rounded" style={{ backgroundColor: accent }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                {sec.heading || 'Custom Section'}
              </h2>
            </div>
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700 pl-3">
              {sec.content}
            </p>
          </section>
        ))}

        {data.additionalInfo && (
          <section className="pl-3 pt-2 text-xs text-slate-600">
            <strong>Certifications & Details:</strong> {data.additionalInfo}
          </section>
        )}
      </div>
    </article>
  );
}

// -------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------
export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('resume-session') || 'null'); } catch { return null; }
  });
  const [data, setData] = useState(emptyResume);
  const [resumeId, setResumeId] = useState(null);
  const [title, setTitle] = useState('My Resume');
  const [saved, setSaved] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [sectionFeedback, setSectionFeedback] = useState(null);
  const [provider, setProvider] = useState('');
  const [tab, setTab] = useState('edit'); // 'edit' | 'tailor' | 'saved'
  const [aiSection, setAiSection] = useState('Professional summary');

  // Job Tailoring state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailorResult, setTailorResult] = useState(null);
  const [tailorBusy, setTailorBusy] = useState(false);

  // File upload state & ref
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [showPageGuide, setShowPageGuide] = useState(true);

  useEffect(() => {
    if (session) localStorage.setItem('resume-session', JSON.stringify(session));
    else localStorage.removeItem('resume-session');
  }, [session]);

  useEffect(() => {
    if (session?.token) loadSaved();
  }, [session?.token]);

  async function loadSaved() {
    try {
      setSaved(await request('/resumes', session.token));
    } catch (e) {
      setNotice(e.message);
    }
  }

  function update(key, value) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function updateRow(key, index, field, value) {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map((row, i) => i === index ? { ...row, [field]: value } : row)
    }));
  }

  function addRow(key, row) {
    update(key, [...data[key], row]);
  }

  function removeRow(key, index) {
    update(key, data[key].filter((_, i) => i !== index));
  }

  async function saveResume() {
    setBusy(true);
    setNotice('');
    try {
      const result = await request(resumeId ? `/resumes/${resumeId}` : '/resumes', session.token, {
        method: resumeId ? 'PUT' : 'POST',
        body: JSON.stringify({ title, data })
      });
      setResumeId(result._id);
      setTitle(result.title);
      setNotice('Resume saved successfully.');
      await loadSaved();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function openResume(id) {
    try {
      const result = await request(`/resumes/${id}`, session.token);
      setResumeId(result._id);
      setTitle(result.title);
      setData({ ...emptyResume(), ...result.data });
      setSuggestions('');
      setTailorResult(null);
      setTab('edit');
      setNotice(`Loaded "${result.title}" into editor.`);
    } catch (e) {
      setNotice(e.message);
    }
  }

  async function deleteResume(id) {
    if (!confirm('Delete this saved resume?')) return;
    try {
      await request(`/resumes/${id}`, session.token, { method: 'DELETE' });
      if (resumeId === id) {
        setResumeId(null);
        setData(emptyResume());
        setTitle('My Resume');
      }
      await loadSaved();
      setNotice('Resume deleted.');
    } catch (e) {
      setNotice(e.message);
    }
  }

  function newResume() {
    setData(emptyResume());
    setResumeId(null);
    setTitle('My Resume');
    setSuggestions('');
    setTailorResult(null);
    setNotice('Started a clean, new resume template.');
    setTab('edit');
  }

  function loadRamkumarResume() {
    const rData = ramkumarSample();
    setData(rData);
    setResumeId(null);
    setTitle("Ramkumar M's Resume");
    setSuggestions('');
    setTailorResult(null);
    setNotice("Loaded Ramkumar M's Full Stack Developer resume!");
    setTab('edit');
  }

  // Handle direct file upload (.pdf, .docx, .txt, .json)
  async function handleFileUpload(file) {
    if (!file) return;
    setUploading(true);
    setNotice(`Reading and parsing "${file.name}"…`);
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        setData(prev => ({ ...emptyResume(), ...parsed }));
        setResumeId(null);
        const cleanTitle = (parsed.fullName ? `${parsed.fullName}'s Resume` : file.name.replace(/\.[^/.]+$/, '')) || 'Uploaded Resume';
        setTitle(cleanTitle);
        setImportModalOpen(false);
        setImportText('');
        setTailorResult(null);
        setTab('edit');
        setNotice(`Successfully restored JSON backup "${file.name}"!`);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API}/resumes/parse-file`, {
        method: 'POST',
        headers: {
          ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {})
        },
        body: formData
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to parse file');

      if (body.data) {
        setData(prev => ({ ...prev, ...body.data }));
        setResumeId(null);
        const cleanTitle = (body.data.fullName ? `${body.data.fullName}'s Resume` : file.name.replace(/\.[^/.]+$/, '')) || 'Uploaded Resume';
        setTitle(cleanTitle);
        setImportModalOpen(false);
        setImportText('');
        setTailorResult(null);
        setTab('edit');
        setNotice(`Successfully imported "${file.name}"! Edit details or select from 5 formats.`);
      }
    } catch (err) {
      setNotice(`File upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function exportJson() {
    const exportData = {
      ...data,
      meta: {
        exportedAt: new Date().toISOString(),
        tool: 'ResumeCraft AI'
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.fullName || 'resume').toLowerCase().replace(/[^a-z0-9]/g, '_')}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('💾 Complete JSON backup downloaded! You can re-import this anytime.');
  }

  function copyPlainText() {
    const text = generateAtsPlainText(data);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setNotice('📋 ATS Plain-Text resume copied to clipboard! Ready to paste into job portals.');
    } else {
      setNotice('Clipboard access unavailable.');
    }
  }

  function handleImportSubmit() {
    if (!importText.trim()) return;
    const parsed = parseResumeText(importText);
    setData(prev => ({ ...prev, ...parsed }));
    setResumeId(null);
    setTitle(parsed.fullName ? `${parsed.fullName}'s Resume` : 'Imported Resume');
    setImportModalOpen(false);
    setImportText('');
    setTailorResult(null);
    setTab('edit');
    setNotice('Existing resume content parsed and loaded into editor!');
  }

  async function getSuggestions() {
    const text = aiSection === 'Professional summary' ? data.summary :
      aiSection === 'Skills' ? data.skills :
      aiSection === 'Projects' ? data.projects.map(x => `${x.name} (${x.tech}): ${x.description}`).join('\n') :
      data.experience.map(x => `${x.role} at ${x.company}: ${x.description}`).join('\n');
    if (!text.trim()) {
      setNotice(`Add content to ${aiSection.toLowerCase()} first.`);
      return;
    }
    setBusy(true);
    setNotice('');
    setSuggestions('');
    setSectionFeedback(null);
    try {
      const result = await request('/ai/suggest', session.token, {
        method: 'POST',
        body: JSON.stringify({ text, section: aiSection })
      });
      setSectionFeedback(result);
      setSuggestions(result.suggestions);
      setProvider(result.provider);
      setNotice('Professional critique and rewrite ready below!');
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }

  function applySectionRewrite(improvedText) {
    if (!improvedText) return;
    if (aiSection === 'Professional summary') {
      update('summary', improvedText);
      setNotice('Applied professional rewrite to Professional Summary!');
    } else if (aiSection === 'Skills') {
      update('skills', improvedText);
      setNotice('Applied categorized skills structure!');
    } else {
      navigator.clipboard?.writeText(improvedText);
      setNotice('Copied improved rewrite to clipboard! Paste it into your project or experience description.');
    }
  }

  async function handleTailor() {
    if (!data.fullName && !data.skills && !data.role) {
      setNotice('⚠️ Step 1: Please select or upload your resume first before checking match.');
      return;
    }
    if (!jobTitle.trim() && !jobDescription.trim()) {
      setNotice('⚠️ Step 2: Please enter a target Job Title or paste a Job Description.');
      return;
    }
    setTailorBusy(true);
    setNotice('');
    try {
      const result = await request('/ai/tailor', session.token, {
        method: 'POST',
        body: JSON.stringify({ resume: data, jobTitle, jobDescription })
      });
      setTailorResult(result);
      setNotice('✅ Match complete! Review ATS score and tailored suggestions below.');
    } catch (e) {
      setNotice(e.message);
    } finally {
      setTailorBusy(false);
    }
  }

  function applyTailoredSummary(summary) {
    update('summary', summary);
    setNotice('Tailored summary applied to your resume!');
  }

  function applyJobTitle(newRole) {
    update('role', newRole);
    setNotice(`Updated professional title to "${newRole}"!`);
  }

  function addMissingSkill(skill) {
    const current = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!current.some(s => s.toLowerCase() === skill.toLowerCase())) {
      update('skills', [...current, skill].join(', '));
      setNotice(`Added "${skill}" to your skills!`);
    }
  }

  function addAllMissingSkills() {
    if (!tailorResult?.missingSkills?.length) return;
    const current = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    const toAdd = tailorResult.missingSkills.filter(
      skill => !current.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    if (toAdd.length > 0) {
      update('skills', [...current, ...toAdd].join(', '));
      setNotice(`Added ${toAdd.length} missing skill(s) to your resume!`);
    }
  }

  if (!session?.token) return <Auth onAuth={setSession} />;

  return (
    <div className="min-h-screen">
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
        }}
        accept=".pdf,.docx,.doc,.txt,.json,.md"
        className="hidden"
      />

      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-indigo-600 p-2 text-white"><FileText size={21}/></span>
            <div>
              <p className="font-bold text-slate-900">ResumeCraft <span className="text-indigo-600">AI</span></p>
              <p className="hidden text-xs text-slate-500 sm:block">Smart Resume Builder · 5 Formats & Layout Controls</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadRamkumarResume}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              title="Click to load Ramkumar M's Full Stack Developer resume sample"
            >
              ⚡ Load Ramkumar M Sample
            </button>
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">Hi, {session.user.name}</span>
            <button
              onClick={() => { setSession(null); }}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <LogOut size={16}/> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1540px] px-4 py-6 sm:px-6">
        {/* Top Header Actions */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">Resume Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Customizable Resumes & Formats</h1>
            <p className="mt-2 text-slate-500">
              Upload PDF or choose from 5 simple formats, customize alignment and colors, and tailor to job descriptions.
            </p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 font-semibold text-indigo-700 hover:bg-indigo-100 shadow-sm transition"
              title="Select a resume file from your computer (.pdf, .docx, .txt, .json)"
            >
              {uploading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <FileUp size={17}/> Select Resume File (.pdf)
                </>
              )}
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Upload size={17}/> Import
            </button>
            <button
              onClick={newResume}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Plus size={17}/> New Blank
            </button>
            <button
              type="button"
              onClick={copyPlainText}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
              title="Copy ATS-friendly plain text to clipboard for job application portals"
            >
              <Copy size={16}/> Copy Text
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
              title="Export complete resume data as a JSON file backup"
            >
              <FileDown size={16}/> Export JSON
            </button>
            <button
              disabled={busy}
              onClick={saveResume}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-sm"
            >
              <Save size={17}/>{busy ? 'Saving…' : 'Save Resume'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 shadow-sm"
            >
              <Download size={17}/> Download / Print PDF
            </button>
          </div>
        </div>

        {notice && (
          <div className="no-print mb-4 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/90 px-4 py-3 text-sm font-medium text-indigo-900 shadow-sm">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-indigo-700 hover:text-indigo-950"><X size={16}/></button>
          </div>
        )}

        {/* Existing Resume Quick Switcher Bar */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><FileText size={18}/></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Resume:</span>
                <span className="font-bold text-slate-900">{title}</span>
                {resumeId ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Saved</span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Unsaved</span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {saved.length > 0 ? `${saved.length} saved resume(s) in your library` : 'Create your first resume or upload your PDF'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <FileUp size={14} className="text-indigo-600"/> Select File (.pdf, .docx)
            </button>
            {saved.length > 0 && (
              <select
                value={resumeId || ''}
                onChange={e => { if (e.target.value) openResume(e.target.value); }}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <option value="" disabled>Load existing resume...</option>
                {saved.map(r => (
                  <option key={r._id} value={r._id}>📂 {r.title}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => setTab('tailor')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === 'tailor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Target size={16}/> Match & Tailor to Job
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            RESUME STYLING & CONTROLS BAR
            ------------------------------------------------------------- */}
        <div className="no-print mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-indigo-600"/>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Design & Layout Controls
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  update('spacing', 'compact');
                  update('fontSize', 'compact');
                  setNotice('✨ Fit to 1 Page activated! Spacing and font sizes optimized to fit within a single standard page.');
                }}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 shadow-2xs hover:from-amber-100 hover:to-orange-100 transition"
                title="Automatically adjusts font size and vertical spacing to compress content into 1 standard A4 page"
              >
                <Sparkles size={14} className="text-amber-600 animate-pulse" /> ✨ Fit to 1 Page
              </button>

              <span className="text-xs text-slate-300">|</span>

              <button
                type="button"
                onClick={() => {
                  update('spacing', 'normal');
                  update('fontSize', 'normal');
                  setNotice('Restored normal spacing and font size.');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300"
              >
                Reset layout
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* 1. Format / Template Selector */}
            <div className="xl:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-600"/> Select Format (5 Formats)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update('template', t.id)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                      (data.template || 'modern') === t.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="truncate font-bold">{t.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Text Alignment & Font Sizing */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <AlignLeft size={14} className="text-indigo-600"/> Alignment & Font Size
              </label>
              
              {/* Alignment */}
              <div className="flex gap-1.5 mb-2.5">
                <button
                  type="button"
                  onClick={() => update('align', 'left')}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-1.5 text-xs font-semibold transition ${
                    (data.align || 'left') === 'left'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Left align header"
                >
                  <AlignLeft size={14}/> Left
                </button>
                <button
                  type="button"
                  onClick={() => update('align', 'center')}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-1.5 text-xs font-semibold transition ${
                    data.align === 'center'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Center align header"
                >
                  <AlignCenter size={14}/> Center
                </button>
                <button
                  type="button"
                  onClick={() => update('align', 'right')}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-1.5 text-xs font-semibold transition ${
                    data.align === 'right'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Right align header"
                >
                  <AlignRight size={14}/> Right
                </button>
              </div>

              {/* Font Size Selector (Compact / Normal / Large) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Size:</span>
                {['compact', 'normal', 'large'].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => update('fontSize', sz)}
                    className={`flex-1 rounded-lg border py-1 text-center text-xs font-semibold capitalize transition ${
                      (data.fontSize || 'normal') === sz
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-400'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Theme Color & Typography */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Palette size={14} className="text-indigo-600"/> Accent & Font</span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{data.accentColor || '#4f46e5'}</span>
              </label>

              {/* Color Swatches + Native Hex Color Picker */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update('accentColor', c.value)}
                    className={`h-6 w-6 rounded-full transition-transform ${c.bg} ${
                      (data.accentColor || '#4f46e5').toLowerCase() === c.value.toLowerCase() ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}

                {/* Custom Color Wheel Input */}
                <div className="relative flex items-center ml-1" title="Pick any custom color wheel / hex">
                  <input
                    type="color"
                    value={data.accentColor || '#4f46e5'}
                    onChange={e => update('accentColor', e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded-full border border-slate-300 p-0 overflow-hidden"
                  />
                </div>
              </div>

              {/* Spacing Density & Font Family */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={data.fontFamily || 'sans'}
                  onChange={e => update('fontFamily', e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="sans">Modern Sans</option>
                  <option value="serif">Classic Serif</option>
                  <option value="mono">Tech Mono</option>
                </select>

                <select
                  value={data.spacing || 'normal'}
                  onChange={e => update('spacing', e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="compact">Tight Spacing</option>
                  <option value="normal">Normal Spacing</option>
                  <option value="spacious">Spacious Spacing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(440px,0.95fr)]">
          {/* Left Column: Editor & Tool Tabs */}
          <section className="no-print min-w-0">
            {/* Primary Tab Bar */}
            <div className="mb-4 flex gap-1 rounded-2xl bg-slate-200/80 p-1.5">
              <button
                onClick={() => setTab('edit')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  tab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserRound size={16}/> Resume Editor
              </button>
              <button
                onClick={() => setTab('tailor')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  tab === 'tailor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target size={16}/> Job Matcher & AI Tailor
              </button>
              <button
                onClick={() => setTab('saved')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  tab === 'saved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText size={16}/> My Resumes ({saved.length})
              </button>
            </div>

            {/* TAB 1: RESUME EDITOR */}
            {tab === 'edit' && (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <Field label="Resume name (for your dashboard)" value={title} onChange={setTitle} placeholder="Frontend Developer Resume" />
                  </div>
                  <SectionTitle icon={UserRound} title="Personal details"/>

                  {/* FlowCV-Style Profile Photo Uploader */}
                  <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <div className="relative shrink-0">
                      {data.photoUrl ? (
                        <img
                          src={data.photoUrl}
                          alt="Avatar"
                          className={`h-16 w-16 object-cover border-2 border-indigo-200 shadow-sm ${
                            data.photoShape === 'square' ? 'rounded-none' : data.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                          }`}
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400">
                          <UserRound size={26} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Profile Photo (Optional)</p>
                        {data.photoUrl && (
                          <button
                            type="button"
                            onClick={() => update('photoUrl', '')}
                            className="text-[11px] font-semibold text-red-600 hover:underline"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Appears in modern, sidebar, minimal, and creative templates</p>
                      
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition">
                          Upload Headshot
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = ev => update('photoUrl', ev.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {/* Shape Switcher */}
                        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-[11px]">
                          {['circle', 'rounded', 'square', 'none'].map(shape => (
                            <button
                              key={shape}
                              type="button"
                              onClick={() => update('photoShape', shape)}
                              className={`rounded px-2 py-0.5 capitalize font-medium transition ${
                                (data.photoShape || 'circle') === shape
                                  ? 'bg-indigo-600 text-white font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {shape === 'none' ? 'Hidden' : shape}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full name" value={data.fullName} onChange={v => update('fullName', v)} placeholder="e.g. RAMKUMAR M" />
                    <Field label="Professional title" value={data.role} onChange={v => update('role', v)} placeholder="Full Stack Developer" />
                    <Field label="Email" value={data.email} onChange={v => update('email', v)} placeholder="mcram2008@gmail.com" />
                    <Field label="Phone" value={data.phone} onChange={v => update('phone', v)} placeholder="6379782142" />
                    <Field label="City / location" value={data.location} onChange={v => update('location', v)} placeholder="Dharmapuri-635205, Tamil Nadu, India" />
                    <Field label="Portfolio / LinkedIn / GitHub" value={data.website} onChange={v => update('website', v)} placeholder="github.com/mcram2008-commits • portfolio42ramkumar.netlify.app" />
                  </div>
                  <div className="mt-4">
                    <Field
                      label="Professional summary"
                      area
                      value={data.summary}
                      onChange={v => update('summary', v)}
                      placeholder="Write 2–4 lines about your strengths, experience, and career goals."
                    />
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={Code2} title="Technical Skills"/>
                  <Field
                    label="Skills (separate with commas)"
                    area
                    value={data.skills}
                    onChange={v => update('skills', v)}
                    placeholder="React.js, Node.js, Express.js, JavaScript, Python, MySQL, SQL, HTML, CSS, REST APIs, Git"
                  />
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={BriefcaseBusiness} title="Experience"/>
                  {data.experience.map((x, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Job title" value={x.role} onChange={v => updateRow('experience', i, 'role', v)} placeholder="Web Development Intern" />
                        <Field label="Company" value={x.company} onChange={v => updateRow('experience', i, 'company', v)} placeholder="AI Tech Gen Technologies" />
                        <Field label="Dates / Location" value={x.period} onChange={v => updateRow('experience', i, 'period', v)} placeholder="Jul 2026 – Aug 2026 (Remote)" />
                      </div>
                      <div className="mt-3">
                        <Field
                          label="Achievements / responsibilities"
                          area
                          value={x.description}
                          onChange={v => updateRow('experience', i, 'description', v)}
                          placeholder="Describe work, achievements, and impact."
                        />
                      </div>
                      <button onClick={() => removeRow('experience', i)} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700">
                        Remove experience
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRow('experience', { company: '', role: '', period: '', description: '' })}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Add experience
                  </button>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={Code2} title="Projects"/>
                  {data.projects.map((x, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Project name" value={x.name} onChange={v => updateRow('projects', i, 'name', v)} placeholder="MEI Lunch" />
                        <Field label="Technologies" value={x.tech} onChange={v => updateRow('projects', i, 'tech', v)} placeholder="React.js, Node.js, Python, MySQL, REST APIs, LLM" />
                      </div>
                      <div className="mt-3">
                        <Field
                          label="Description & Highlights"
                          area
                          value={x.description}
                          onChange={v => updateRow('projects', i, 'description', v)}
                          placeholder="What does it do? Key implementation details..."
                        />
                      </div>
                      <button onClick={() => removeRow('projects', i)} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700">
                        Remove project
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRow('projects', { name: '', tech: '', description: '' })}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Add project
                  </button>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={GraduationCap} title="Education"/>
                  {data.education.map((x, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Degree / qualification" value={x.degree} onChange={v => updateRow('education', i, 'degree', v)} placeholder="B.Tech(IT) · CGPA: 84.7%" />
                        <Field label="Institution" value={x.school} onChange={v => updateRow('education', i, 'school', v)} placeholder="Mahendra Institute of Technology (Anna University)" />
                        <Field label="Year / duration" value={x.year} onChange={v => updateRow('education', i, 'year', v)} placeholder="2023–2027" />
                      </div>
                      <button onClick={() => removeRow('education', i)} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700">
                        Remove education
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRow('education', { school: '', degree: '', year: '' })}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Add education
                  </button>
                </div>

                {/* FLOWCV MODULAR SECTION: CERTIFICATIONS & LICENSES */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={Award} title="Certifications & Licenses"/>
                  {(data.certifications || []).map((x, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <Field label="Certification name" value={x.name} onChange={v => updateRow('certifications', i, 'name', v)} placeholder="e.g. AWS Certified Solutions Architect" />
                        </div>
                        <Field label="Year / Date" value={x.year} onChange={v => updateRow('certifications', i, 'year', v)} placeholder="2024" />
                      </div>
                      <div className="mt-2.5">
                        <Field label="Issuing Organization" value={x.issuer} onChange={v => updateRow('certifications', i, 'issuer', v)} placeholder="Amazon Web Services / Coursera / ICT Academy" />
                      </div>
                      <button onClick={() => removeRow('certifications', i)} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700">
                        Remove certification
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRow('certifications', { name: '', issuer: '', year: '' })}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Add certification
                  </button>
                </div>

                {/* FLOWCV MODULAR SECTION: LANGUAGES & PROFICIENCY */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={Languages} title="Languages & Proficiency"/>
                  {(data.languages || []).map((x, i) => (
                    <div key={i} className="mb-3 flex flex-wrap items-end gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="flex-1 min-w-[150px]">
                        <Field label="Language" value={x.name} onChange={v => updateRow('languages', i, 'name', v)} placeholder="e.g. English, Tamil, German" />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-slate-700">
                          Proficiency Level
                          <select
                            value={x.level || 'Fluent / Full Professional'}
                            onChange={e => updateRow('languages', i, 'level', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-800"
                          >
                            {LANGUAGE_LEVELS.map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <button
                        onClick={() => removeRow('languages', i)}
                        className="mb-2 text-xs font-semibold text-red-600 hover:text-red-700 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRow('languages', { name: '', level: 'Fluent / Full Professional' })}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Add language
                  </button>
                </div>

                {/* EXTRA CUSTOM SECTIONS (+ ADD HEADING) */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <PlusCircle size={18} className="text-indigo-600"/>
                      <h3 className="font-semibold text-slate-900">Custom Sections & Extra Headings</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => addRow('customSections', { heading: '', content: '' })}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
                    >
                      <Plus size={15}/> + Add Custom Heading
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    Add any extra headings you need (e.g. Awards, Volunteering, Publications, Portfolio Links, Key Highlights, Hobbies).
                  </p>

                  {(data.customSections || []).map((sec, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Section Heading Title
                          </label>
                          <input
                            type="text"
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800"
                            value={sec.heading || ''}
                            onChange={e => updateRow('customSections', i, 'heading', e.target.value)}
                            placeholder="e.g. Awards & Achievements / Publications / Volunteering"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow('customSections', i)}
                          className="sm:mt-4 rounded-lg p-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 self-start sm:self-auto"
                        >
                          <Trash2 size={14}/> Remove
                        </button>
                      </div>

                      <div className="mt-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Section Content & Highlights
                        </label>
                        <textarea
                          className="min-h-[85px] rounded-lg border border-slate-300 bg-white p-3 text-xs sm:text-sm leading-relaxed"
                          value={sec.content || ''}
                          onChange={e => updateRow('customSections', i, 'content', e.target.value)}
                          placeholder="Type bullet points or paragraphs for this custom section..."
                        />
                      </div>
                    </div>
                  ))}

                  {(!data.customSections || data.customSections.length === 0) && (
                    <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
                      <p className="text-xs text-slate-500">Need an extra heading? Click the button below to add custom sections.</p>
                      <button
                        type="button"
                        onClick={() => addRow('customSections', { heading: '', content: '' })}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <Plus size={15}/> + Add Custom Heading
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <SectionTitle icon={FileText} title="Additional Notes / Custom Details"/>
                  <Field
                    label="Languages, Certifications, Conferences"
                    area
                    value={data.additionalInfo || ''}
                    onChange={v => update('additionalInfo', v)}
                    placeholder="Languages: Tamil, English  •  Certifications: Learnathon-2024 (complete 8 courses), CCICS (IEEE conference paper)"
                  />
                </div>

                {/* Section AI Coach */}
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5 shadow-sm">
                  <SectionTitle icon={WandSparkles} title="Section AI coach">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 border">
                      AI / Demo
                    </span>
                  </SectionTitle>
                  <label className="block text-sm font-medium text-slate-700">
                    Improve specific section
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm"
                      value={aiSection}
                      onChange={e => setAiSection(e.target.value)}
                    >
                      <option>Professional summary</option>
                      <option>Skills</option>
                      <option>Projects</option>
                      <option>Experience</option>
                    </select>
                  </label>
                  <button
                    disabled={busy}
                    onClick={getSuggestions}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-sm"
                  >
                    <Sparkles size={17}/>{busy ? 'Generating…' : 'Get AI section feedback'}
                  </button>
                  {sectionFeedback ? (
                    <div className="mt-4 space-y-3.5 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <Sparkles size={14}/> Professional Section Critique
                        </span>
                        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                          {sectionFeedback.provider === 'gemini' ? 'Gemini AI' : 'Executive Coach Engine'}
                        </span>
                      </div>

                      {sectionFeedback.critique && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs leading-relaxed text-amber-950">
                          <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-amber-600"/> Coach Assessment:
                          </p>
                          <p>{sectionFeedback.critique}</p>
                        </div>
                      )}

                      {sectionFeedback.improvedVersion && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Rewrite:</p>
                            {(aiSection === 'Professional summary' || aiSection === 'Skills') && (
                              <button
                                type="button"
                                onClick={() => applySectionRewrite(sectionFeedback.improvedVersion)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
                              >
                                <Check size={13}/> Apply to {aiSection === 'Professional summary' ? 'Summary' : 'Skills'}
                              </button>
                            )}
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed font-mono text-slate-800 whitespace-pre-wrap">
                            {sectionFeedback.improvedVersion}
                          </div>
                        </div>
                      )}

                      {sectionFeedback.specificSuggestions?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Key Improvement Points:</p>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {sectionFeedback.specificSuggestions.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check size={14} className="mt-0.5 text-emerald-600 shrink-0"/>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sectionFeedback.actionVerbs?.length > 0 && (
                        <div className="border-t pt-2.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">High-Impact Action Verbs to Use:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {sectionFeedback.actionVerbs.map((v, idx) => (
                              <span key={idx} className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(sectionFeedback.improvedVersion || suggestions)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <Copy size={14}/> Copy Rewrite
                        </button>
                      </div>
                    </div>
                  ) : suggestions ? (
                    <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                        {provider === 'gemini' ? 'Gemini feedback' : 'Demo feedback'}
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{suggestions}</p>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(suggestions)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <Copy size={15}/> Copy feedback
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* RESUME ALIGNMENT & FINAL TOUCH (AFTER ADDING CONTENT) */}
                <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <AlignLeft size={17} className="text-indigo-600"/> Resume Alignment & Final Layout
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Content add panna aprum, ungalukku vendiya text alignment & layout-ah inga set pannikkalam.
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                      Active: {data.align ? data.align.toUpperCase() : 'LEFT'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Select Alignment:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            update('align', 'left');
                            setNotice('Updated alignment to Left');
                          }}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                            (data.align || 'left') === 'left'
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <AlignLeft size={16}/> Left Align
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            update('align', 'center');
                            setNotice('Updated alignment to Center');
                          }}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                            data.align === 'center'
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <AlignCenter size={16}/> Center Align
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            update('align', 'right');
                            setNotice('Updated alignment to Right');
                          }}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                            data.align === 'right'
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <AlignRight size={16}/> Right Align
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Quick Layout & Save:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            update('spacing', 'compact');
                            update('fontSize', 'compact');
                            setNotice('✨ Fit to 1 Page: spacing and font sizes compressed!');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-2.5 text-xs font-bold text-amber-900 shadow-2xs hover:from-amber-100 hover:to-orange-100"
                        >
                          <Sparkles size={14} className="text-amber-600" /> ✨ Fit to 1 Page
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={saveResume}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 p-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm disabled:opacity-60"
                        >
                          <Save size={15}/> {busy ? 'Saving...' : 'Save Resume'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: JOB MATCHER & AI TAILOR */}
            {tab === 'tailor' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Target className="text-indigo-600" size={22} /> Job Matcher & AI Tailor
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                      Resume-ah select/upload pannunga, target job description-ah enter pannunga, kela match score and suggestions-ah paathukonga.
                    </p>
                  </div>

                  {/* 1. RESUME VANGU (GET RESUME) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <UserRound size={17} className="text-indigo-600"/> 1. Candidate Resume:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 shadow-2xs"
                        >
                          <FileUp size={14}/> {uploading ? 'Reading File…' : 'Upload Resume (.pdf, .docx)'}
                        </button>
                        {saved.length > 0 && (
                          <select
                            value={resumeId || ''}
                            onChange={e => { if (e.target.value) openResume(e.target.value); }}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
                          >
                            <option value="" disabled>Load Saved Resume ({saved.length})...</option>
                            {saved.map(r => (
                              <option key={r._id} value={r._id}>📂 {r.title}</option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={loadRamkumarResume}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                        >
                          ⚡ Ramkumar Sample
                        </button>
                      </div>
                    </div>

                    {/* Resume Status Card */}
                    {(data.fullName || data.role || data.skills) ? (
                      <div className="rounded-lg border border-emerald-200 bg-white p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {data.fullName || 'Active Resume'}{data.role ? ` · ${data.role}` : ''}
                          </p>
                          <p className="text-slate-500 mt-0.5 truncate">
                            {[data.email, data.phone].filter(Boolean).join('  •  ') || 'Contact loaded'} · {(data.skills || '').split(',').filter(Boolean).length} Skills · {data.projects?.length || 0} Projects
                          </p>
                        </div>
                        <span className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle size={13}/> Resume Ready
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <AlertCircle size={15} className="text-amber-600 shrink-0"/> Please upload your PDF resume or click "Ramkumar Sample" above.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2. JOB DISCREPTION VANGU (GET JOB DESCRIPTION) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                    <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BriefcaseBusiness size={17} className="text-indigo-600"/> 2. Target Job Details:
                    </label>

                    <Field
                      label="Job Title"
                      value={jobTitle}
                      onChange={setJobTitle}
                      placeholder="e.g. Full Stack Developer, React Engineer, Node.js Specialist"
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Job Description & Requirements
                        <textarea
                          className="mt-1.5 min-h-[130px] w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none"
                          value={jobDescription}
                          onChange={e => setJobDescription(e.target.value)}
                          placeholder="Paste target job description and requirements here..."
                        />
                      </label>
                    </div>

                    {/* Quick Sample Job Fill Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-500">Quick Test Samples:</span>
                      {SAMPLE_JOBS.map((job, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setJobTitle(job.title);
                            setJobDescription(job.description);
                            setNotice(`Loaded sample: "${job.title}" into Job Description!`);
                          }}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            jobTitle === job.title
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {job.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CHECK MATCH BUTTON */}
                  <button
                    disabled={tailorBusy}
                    onClick={handleTailor}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-md transition"
                  >
                    {tailorBusy ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Checking Match…
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Check Match & Get Suggestions
                      </>
                    )}
                  </button>
                </div>

                {/* 3. KELA SUGESSION PANNU (SUGGESTIONS BELOW) */}
                {tailorResult && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} /> Suggestions for this Job Opening
                      </h3>
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                        {tailorResult.matchScore}% Match
                      </span>
                    </div>

                    {/* Match Score & Verdict */}
                    <div className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      tailorResult.matchScore >= 75 ? 'border-emerald-200 bg-emerald-50 text-emerald-950' :
                      tailorResult.matchScore >= 50 ? 'border-amber-200 bg-amber-50 text-amber-950' :
                      'border-rose-200 bg-rose-50 text-rose-950'
                    }`}>
                      <div>
                        <p className="font-bold text-base">
                          {tailorResult.matchScore >= 75 ? '🎉 Strong Match! (ATS Ready)' :
                           tailorResult.matchScore >= 50 ? '⚠️ Moderate Match (Needs Changes to Match)' :
                           '❌ Low Match (Follow Suggestions Below to Match)'}
                        </p>
                        <p className="text-xs mt-0.5 opacity-90">
                          {tailorResult.matchScore >= 75
                            ? 'Your resume matches the core requirements well! Review minor suggestions below.'
                            : 'Resume-la missing skills and key points irukku. Kela irukura suggestions apply pannunga:'}
                        </p>
                      </div>
                      <div className="w-full sm:w-40">
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${
                              tailorResult.matchScore >= 75 ? 'bg-emerald-500' :
                              tailorResult.matchScore >= 50 ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`}
                            style={{ width: `${tailorResult.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUGGESTION 1: MISSING SKILLS TO ADD */}
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <AlertCircle size={15} className="text-amber-500"/> Missing Skills (Job Description-la irukku, Resume-la illa):
                        </p>
                        {tailorResult.missingSkills?.length > 0 && (
                          <button
                            type="button"
                            onClick={addAllMissingSkills}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            + Add all to resume
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tailorResult.missingSkills?.length > 0 ? (
                          tailorResult.missingSkills.map((skill, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => addMissingSkill(skill)}
                              className="group inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition"
                              title="Click to add to resume"
                            >
                              <span>{skill}</span>
                              <Plus size={13} className="text-amber-600 group-hover:scale-125 transition-transform" />
                            </button>
                          ))
                        ) : (
                          <p className="text-xs font-medium text-emerald-700">✅ All required skills are already in your resume!</p>
                        )}
                      </div>
                      {tailorResult.matchedSkills?.length > 0 && (
                        <p className="text-[11px] text-slate-500 pt-1">
                          Matched Skills: {tailorResult.matchedSkills.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* SUGGESTION 2: JOB TITLE ALIGNMENT */}
                    {jobTitle && data.role !== jobTitle && (
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Change Resume Title:</p>
                          <p className="text-xs text-slate-700 mt-0.5">
                            Current: <strong>"{data.role || 'Not set'}"</strong> ➔ Change to: <strong className="text-indigo-700">"{jobTitle}"</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyJobTitle(jobTitle)}
                          className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs"
                        >
                          Update Title to "{jobTitle}"
                        </button>
                      </div>
                    )}

                    {/* SUGGESTION 3: TAILORED SUMMARY REWRITE */}
                    {tailorResult.tailoredSummary && (
                      <div className="space-y-2 border-b pb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Sparkles size={15} className="text-indigo-600"/> Recommended Summary Rewrite:
                          </p>
                          <button
                            type="button"
                            onClick={() => applyTailoredSummary(tailorResult.tailoredSummary)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs"
                          >
                            <Check size={13}/> Apply to Resume Summary
                          </button>
                        </div>
                        <blockquote className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">
                          {tailorResult.tailoredSummary}
                        </blockquote>
                      </div>
                    )}

                    {/* SUGGESTION 4: EXPERIENCE & PROJECT BULLETS REWRITES */}
                    {tailorResult.experienceSuggestions?.length > 0 && (
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <BriefcaseBusiness size={15} className="text-indigo-600"/> What to Change in Experience & Projects:
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {tailorResult.experienceSuggestions.map((sug, idx) => (
                            <li key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-indigo-600">•</span>
                                <span className="leading-relaxed">{sug}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(sug);
                                  setNotice('Copied suggestion to clipboard!');
                                }}
                                className="self-end sm:self-auto shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                              >
                                <Copy size={13}/> Copy
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MY SAVED RESUMES */}
            {tab === 'saved' && (
              <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText size={20} className="text-indigo-600"/> Saved Resumes Library
                    </h3>
                    <p className="text-xs text-slate-500">Open an existing resume to edit or tailor it for new jobs.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      <FileUp size={14}/> Select File
                    </button>
                    <button
                      onClick={newResume}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <Plus size={14}/> Create New
                    </button>
                  </div>
                </div>

                {saved.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">No saved resumes found in your account.</p>
                    <p className="mt-1 text-xs text-slate-400">Select a file from your computer or create a new one above.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {saved.map(r => (
                      <div
                        key={r._id}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition ${
                          resumeId === r._id ? 'border-indigo-500 bg-indigo-50/30' : 'hover:border-slate-300'
                        }`}
                      >
                        <button onClick={() => openResume(r._id)} className="min-w-0 flex-1 text-left">
                          <p className="truncate font-semibold text-slate-900">{r.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Last updated {new Date(r.updatedAt).toLocaleDateString()} at {new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openResume(r._id)}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Open / Edit
                          </button>
                          <button
                            aria-label="Delete resume"
                            onClick={() => deleteResume(r._id)}
                            className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Right Column: Live A4 Resume Preview */}
          <section className="min-w-0">
            {/* FlowCV Live ATS Content Health & Completeness Checklist */}
            <AtsHealthWidget
              data={data}
              onFixSection={() => setTab('edit')}
            />

            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">Live Resume Preview</p>
                <p className="text-xs text-slate-500">
                  Format: {TEMPLATES.find(t => t.id === (data.template || 'modern'))?.name} · Align: {data.align || 'left'} · Size: {data.fontSize || 'normal'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPageGuide(prev => !prev)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    showPageGuide
                      ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Toggle visual indicator for standard A4 Page 1 cutoff"
                >
                  <FileText size={13}/> A4 Cutoff Guide: {showPageGuide ? 'ON' : 'OFF'}
                </button>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Eye size={14}/> Live View
                </span>
              </div>
            </div>

            {/* A4 Canvas Container with visual cutoff guideline */}
            <div className="relative">
              <ResumePreview data={data}/>
              {showPageGuide && (
                <div
                  className="no-print pointer-events-none absolute left-0 right-0 border-b-2 border-dashed border-rose-500 z-10 flex items-center justify-between px-4"
                  style={{ top: '1050px' }}
                >
                  <span className="rounded bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow">
                    ✂️ Standard A4 Page 1 Boundary (~1050px)
                  </span>
                  <span className="rounded bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200 shadow-2xs">
                    Content below this prints on Page 2
                  </span>
                </div>
              )}
            </div>

            <div className="no-print mt-4 rounded-xl border bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                💡 <strong>PDF Export Tip:</strong> Click <strong>Download / Print PDF</strong>, then select <strong>Save as PDF</strong> in your browser print dialog. Make sure 'Background graphics' is checked.
              </div>
              <button
                type="button"
                onClick={() => {
                  update('spacing', 'compact');
                  update('fontSize', 'compact');
                  setNotice('✨ Fit to 1 Page: spacing and font sizes compressed to fit content onto 1 page!');
                }}
                className="shrink-0 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-2xs"
              >
                ✨ Fit to 1 Page
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* IMPORT / UPLOAD RESUME MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileUp size={20} className="text-indigo-600" /> Select or Import Resume
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Option 1: File Upload Box */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Option 1: Choose Resume File</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer transition"
              >
                <span className="rounded-full bg-white p-3 text-indigo-600 shadow-sm">
                  {uploading ? <RefreshCw size={24} className="animate-spin" /> : <FileUp size={24} />}
                </span>
                <p className="mt-3 font-semibold text-slate-800">
                  {uploading ? 'Processing file…' : 'Click to select a resume file'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supports <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, <strong>Text (.txt)</strong>, and <strong>JSON (.json)</strong>
                </p>
              </div>
            </div>

            {/* Quick Sample Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  loadRamkumarResume();
                  setImportModalOpen(false);
                }}
                className="w-full rounded-xl border border-indigo-200 bg-indigo-50/50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                ⚡ Load Ramkumar M's Full Stack Developer Resume (Sample)
              </button>
            </div>

            {/* Option 2: Paste Raw Text */}
            <div className="mt-5 border-t pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Option 2: Or Paste Resume Text</p>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-slate-300 p-3 text-xs font-mono"
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Paste raw resume text or JSON here..."
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!importText.trim()}
                  onClick={handleImportSubmit}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Parse & Load Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="no-print py-8 text-center text-xs text-slate-400">
        ResumeCraft AI · Build, align, choose from 5 simple formats, and tailor resumes for any job.
      </footer>
    </div>
  );
}
