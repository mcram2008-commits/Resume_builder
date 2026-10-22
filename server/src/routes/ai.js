const router = require('express').Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const COMMON_TECH_SKILLS = [
  'React.js', 'Node.js', 'Express.js', 'JavaScript', 'TypeScript', 'Next.js', 'Vue.js', 'Angular',
  'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'PHP', 'Laravel',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
  'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Zustand',
  'Git', 'GitHub', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Linux',
  'Unit Testing', 'Jest', 'Cypress', 'Microservices', 'System Design', 'Agile', 'Scrum',
  'Figma', 'WebSockets', 'OAuth', 'JWT', 'Prisma', 'Postman', 'Performance Optimization',
  'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy'
];

// Professional Action Verbs by category
const ACTION_VERBS = {
  leadership: ['Architected', 'Spearheaded', 'Directed', 'Orchestrated', 'Championed'],
  development: ['Engineered', 'Developed', 'Implemented', 'Constructed', 'Designed'],
  optimization: ['Optimized', 'Streamlined', 'Enhanced', 'Accelerated', 'Refactored'],
  collaboration: ['Collaborated', 'Partnered', 'Facilitated', 'Integrated']
};

/**
 * Professional rule-based resume and job tailor engine
 */
function professionalJobMatch(resume, jobTitle, jobDescription) {
  const jdText = `${jobTitle} ${jobDescription}`.toLowerCase();
  const resumeText = [
    resume.role,
    resume.summary,
    resume.skills,
    resume.additionalInfo,
    ...(resume.experience || []).map(e => `${e.role} ${e.company} ${e.description}`),
    ...(resume.projects || []).map(p => `${p.name} ${p.tech} ${p.description}`),
    ...(resume.education || []).map(ed => `${ed.degree} ${ed.school}`)
  ].filter(Boolean).join(' ').toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  COMMON_TECH_SKILLS.forEach(skill => {
    const cleanSkill = skill.replace(/\.js$/i, '');
    const skillLower = skill.toLowerCase();
    const cleanLower = cleanSkill.toLowerCase();
    
    // Check if skill is mentioned in JD
    const inJD = jdText.includes(skillLower) || jdText.includes(cleanLower);
    if (inJD) {
      // Check if skill is in Resume
      const inResume = resumeText.includes(skillLower) || resumeText.includes(cleanLower);
      if (inResume) {
        if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
      } else {
        if (!missingSkills.includes(skill)) missingSkills.push(skill);
      }
    }
  });

  // Calculate ATS match score
  const totalRelevant = matchedSkills.length + missingSkills.length;
  let matchScore = 55;
  if (totalRelevant > 0) {
    const ratio = matchedSkills.length / totalRelevant;
    matchScore = Math.min(95, Math.max(25, Math.round(ratio * 65 + 30)));
    const titleWords = (jobTitle || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasTitleMatch = titleWords.length > 0 && titleWords.some(w => (resume.role || '').toLowerCase().includes(w));
    if (hasTitleMatch) matchScore = Math.min(96, matchScore + 5);
  } else {
    const titleWords = (jobTitle || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasTitleMatch = titleWords.some(w => resumeText.includes(w));
    matchScore = hasTitleMatch ? 75 : 50;
  }

  const primaryRole = jobTitle || resume.role || 'Full Stack Developer';
  const topMatched = matchedSkills.slice(0, 4).join(', ') || 'modern full-stack web technologies';
  const topMissing = missingSkills.slice(0, 4);

  // 1. Primary Tailored Summary (Results & Impact focused)
  const tailoredSummary = `Results-driven ${primaryRole} with practical expertise in ${topMatched}. Proven track record of developing scalable applications, architecting clean RESTful services, and crafting responsive user experiences. Adept at rapid problem-solving, clean code practices, and collaborating in agile environments to deliver measurable business impact.`;

  // 2. Alternative Tailored Summaries
  const alternativeSummaries = [
    {
      title: 'Technical Depth & Architecture Focused',
      text: `Engineering-focused ${primaryRole} specialized in building high-performance web systems using ${topMatched}. Experienced in end-to-end software development lifecycle, database design, and modern asynchronous workflows with a strong focus on maintainability and system reliability.`
    },
    {
      title: 'Impact & Product Delivery Focused',
      text: `Passionate ${primaryRole} skilled in delivering intuitive digital products from conception to deployment with ${topMatched}. Combines robust technical implementation with user-centric design to drive high user engagement and streamlined business operations.`
    }
  ];

  // 3. Tailored Experience & Project Bullet Point Suggestions (Using Google's X-Y-Z formula)
  const experienceSuggestions = [];

  if (resume.experience && resume.experience.length > 0) {
    const firstExp = resume.experience[0];
    experienceSuggestions.push(
      `Reframe ${firstExp.company || 'your work experience'} bullets using active power verbs: Instead of duty-based statements ("Responsible for developing pages"), use impact-based phrasing: “Engineered responsive user interfaces and backend integrations using ${topMatched.split(',')[0] || 'modern frameworks'}, improving user workflow efficiency by 25%.”`
    );
  }

  if (resume.projects && resume.projects.length > 0) {
    const p1 = resume.projects[0];
    experienceSuggestions.push(
      `Elevate project "${p1.name || 'Core Project'}": Highlight architectural decisions and security: “Architected full-stack ${p1.name} utilizing ${p1.tech || 'Node.js and React'}, implementing robust authentication and optimized database queries that ensured low-latency responses under peak loads.”`
    );
  }

  if (topMissing.length > 0) {
    experienceSuggestions.push(
      `Incorporate Target Keywords: The job description explicitly prioritizes ${topMissing.join(', ')}. If you have used these in personal projects, coursework, or self-learning, explicitly mention them in your technical stack and bullet descriptions.`
    );
  }

  experienceSuggestions.push(
    `Quantify Outcomes: Recruiters and ATS scanners look for numbers. Add measurable metrics where applicable (e.g., “reduced load time by 30%”, “streamlined 500+ daily requests”, “achieved 99% test coverage”).`
  );

  // 4. Actionable ATS Recommendations
  const keyRecommendations = [
    `Set Resume Headline: Ensure your resume headline reads exactly as "${primaryRole}" to pass automated ATS title filters.`,
    topMissing.length > 0
      ? `Bridge Keyword Gaps: Add verified missing skills (${topMissing.join(', ')}) to your Technical Skills section.`
      : `High Skill Alignment: Your core competencies match the job posting requirements well. Focus on showcasing project scale.`,
    `Optimize GitHub & Portfolio Links: Confirm that your GitHub repositories have clean READMEs, live demo links (e.g. Netlify/Vercel), and clear setup instructions.`,
    `Ensure ATS-Friendly Formatting: Maintain clean section headers, standard bullet points, and avoid placing crucial information solely inside graphics.`
  ];

  // 5. Likely Technical Interview Questions Forecast
  const interviewPrepQuestions = [
    `How did you architect the REST APIs in your full-stack applications, and how do you ensure secure authentication and input validation?`,
    topMissing.length > 0
      ? `Can you explain your experience or conceptual understanding of ${topMissing[0]}, and how it fits into modern production architectures?`
      : `How do you measure and optimize database query performance when handling relational or document-based data?`,
    `Describe a challenging debugging issue or production performance bottleneck you encountered in one of your projects and how you resolved it.`
  ];

  return {
    matchScore,
    matchLevel: matchScore >= 75 ? 'Strong Match' : matchScore >= 50 ? 'Moderate Match' : 'Needs Optimization',
    tailoredSummary,
    alternativeSummaries,
    matchedSkills,
    missingSkills,
    experienceSuggestions,
    keyRecommendations,
    interviewPrepQuestions,
    provider: 'professional-engine'
  };
}

/**
 * Deep section-specific professional critique and rewrites
 */
function professionalSectionCritique(section, text) {
  const s = section.toLowerCase();

  if (s.includes('summary')) {
    const lines = text.trim();
    return {
      critique: 'A strong professional summary should immediately communicate your core role, key technical stack, proven accomplishments, and the unique value you bring—avoiding vague clichés.',
      improvedVersion: `Results-driven Full Stack Developer skilled in designing and delivering high-performance web applications using React.js, Node.js, Express, and MySQL. Proven track record in building scalable RESTful architectures, integrating modern LLM/API solutions, and crafting responsive user experiences. Dedicated to clean code standards, proactive problem-solving, and contributing immediate impact to collaborative engineering teams.`,
      specificSuggestions: [
        'Lead with your primary title and the top 3–4 technologies you excel at.',
        'Replace generic phrases like "passionate about coding" with concrete competencies such as "architecting scalable RESTful architectures" or "optimizing SQL queries".',
        'State your commitment to engineering best practices, CI/CD, and agile teamwork.'
      ],
      actionVerbs: ['Architected', 'Spearheaded', 'Optimized', 'Engineered']
    };
  }

  if (s.includes('project')) {
    return {
      critique: 'Project descriptions should follow Google\'s X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]". Highlight the technical challenge, technology stack, and measurable impact.',
      improvedVersion: `• Architected and deployed full-stack web applications using React.js, Node.js, and MySQL, ensuring high availability and seamless data synchronization.
• Implemented secure JWT-based authentication and automated communication webhooks, streamlining user operations and reducing administrative overhead by 35%.
• Integrated Generative AI/LLM endpoints via asynchronous REST APIs, enhancing platform interactivity and data-processing throughput.`,
      specificSuggestions: [
        'Start every bullet point with an assertive action verb (Architected, Engineered, Implemented, Deployed).',
        'Explicitly state the exact tech stack in the first line of each project for ATS indexers.',
        'Highlight database schema design, security practices (JWT/OAuth), and performance optimizations.'
      ],
      actionVerbs: ['Architected', 'Engineered', 'Streamlined', 'Deployed']
    };
  }

  if (s.includes('experience')) {
    return {
      critique: 'Transform duty lists ("Worked on...", "Helped with...") into quantifiable achievement statements that demonstrate initiative, teamwork, and technical rigor.',
      improvedVersion: `• Engineered 10+ responsive, production-ready web interfaces utilizing React.js, JavaScript (ES6+), and modern CSS frameworks, ensuring 100% cross-browser fidelity.
• Collaborated in cross-functional agile sprints to identify and resolve critical UI/UX bottlenecks, boosting overall application performance.
• Applied systematic debugging and automated testing methodologies, accelerating feature delivery cycles.`,
      specificSuggestions: [
        'Focus on the value delivered to users or the business, not just daily tasks.',
        'Mention collaboration with cross-functional teams, code reviews, and version control workflows.',
        'Include numbers where possible (number of interfaces built, bugs resolved, percentage improvement in response times).'
      ],
      actionVerbs: ['Engineered', 'Spearheaded', 'Refactored', 'Accelerated']
    };
  }

  // Skills section
  return {
    critique: 'Organize skills into logical domains (Frontend, Backend, Database, Cloud & DevOps, Tools). This dramatically enhances readability for both ATS scanners and human hiring managers.',
    improvedVersion: `Frontend: React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js, RESTful APIs, Python
Database: MySQL, PostgreSQL, MongoDB
Developer Tools & Practices: Git, GitHub, VS Code, Agile/Scrum, CI/CD, Postman`,
    specificSuggestions: [
      'Group related technologies into categorized tiers so recruiters can scan them in 3 seconds.',
      'Only list tools you can comfortably answer technical interview questions about.',
      'Pair frameworks with complementary skills (e.g. React.js with State Management and Testing).'
    ],
    actionVerbs: ['Specialized', 'Proficient', 'Certified', 'Practiced']
  };
}

router.post('/suggest', auth, async (req, res) => {
  const text = String(req.body.text || '').trim().slice(0, 7000);
  const section = String(req.body.section || 'resume').slice(0, 80);
  if (!text) return res.status(400).json({ message: 'Add some resume text first.' });

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `You are a high-level technical recruiter and executive resume coach.
Review the candidate's ${section} content below.
Provide a rigorous, professional, and actionable critique with a high-impact rewritten version.

Candidate's Current Content:
${text}

Respond strictly in JSON matching this schema:
{
  "critique": "<2-3 sentence honest, expert critique of what is weak and how to elevate it>",
  "improvedVersion": "<complete, polished, production-ready rewritten version using power action verbs and strong professional phrasing>",
  "specificSuggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"],
  "actionVerbs": ["Verb1", "Verb2", "Verb3", "Verb4"]
}`;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return res.json({
        ...parsed,
        suggestions: `${parsed.critique}\n\nRecommended Professional Rewrite:\n${parsed.improvedVersion}\n\nKey Improvement Points:\n${parsed.specificSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
        provider: 'gemini'
      });
    } catch (e) {
      console.error('Gemini suggest error, using professional engine:', e.message);
    }
  }

  // Professional built-in engine
  const critique = professionalSectionCritique(section, text);
  res.json({
    ...critique,
    suggestions: `${critique.critique}\n\nRecommended Professional Rewrite:\n${critique.improvedVersion}\n\nKey Improvement Points:\n${critique.specificSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    provider: 'professional-engine'
  });
});

router.post('/tailor', auth, async (req, res) => {
  const resume = req.body.resume || {};
  const jobTitle = String(req.body.jobTitle || '').trim().slice(0, 150);
  const jobDescription = String(req.body.jobDescription || '').trim().slice(0, 10000);

  if (!jobTitle && !jobDescription) {
    return res.status(400).json({ message: 'Please provide at least a Job Title or Job Description to tailor your resume.' });
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `You are a Principal Technical Recruiter and ATS Optimization Specialist.
Analyze the following resume against the Target Job Title and Job Description.
Provide deeply professional, realistic, and highly competitive suggestions.

Target Job Title: ${jobTitle}
Target Job Description:
${jobDescription}

Candidate Resume:
Role: ${resume.role || ''}
Summary: ${resume.summary || ''}
Skills: ${resume.skills || ''}
Experience: ${JSON.stringify(resume.experience || [])}
Projects: ${JSON.stringify(resume.projects || [])}
Education: ${JSON.stringify(resume.education || [])}

Respond with a JSON object conforming strictly to this schema:
{
  "matchScore": <integer between 30 and 96>,
  "matchLevel": "<Strong Match | Moderate Match | Needs Optimization>",
  "tailoredSummary": "<a compelling 3-4 sentence professional summary tailored specifically for this position using active language>",
  "alternativeSummaries": [
    { "title": "Technical Architecture Focused", "text": "..." },
    { "title": "Impact & Product Delivery Focused", "text": "..." }
  ],
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missing skill from JD not in resume that candidate should add if they have experience with it"],
  "experienceSuggestions": [
    "Specific rephrased bullet point for their experience or project using Google's X-Y-Z formula",
    "Concrete advice on framing responsibilities to match the JD"
  ],
  "keyRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "interviewPrepQuestions": [
    "Likely technical interview question 1 based on candidate gaps",
    "Likely technical interview question 2",
    "Likely technical interview question 3"
  ]
}`;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return res.json({ ...parsed, provider: 'gemini' });
    } catch (e) {
      console.error('Gemini tailor error, using professional engine fallback:', e.message);
    }
  }

  // Professional built-in engine
  const matchResult = professionalJobMatch(resume, jobTitle, jobDescription);
  res.json(matchResult);
});

module.exports = router;
