/**
 * SAP College Notice Board — Express Backend
 * Handles PDF notice uploads, persistent storage, and REST API
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sapcollege2026';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8443';
const loginAttempts = new Map();
const enquiryAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const ENQUIRY_WINDOW_MS = 60 * 60 * 1000;
const ENQUIRY_MAX_ATTEMPTS = 20;

if (process.env.NODE_ENV === 'production') {
  const requiredProductionVariables = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET', 'FRONTEND_ORIGIN'];
  const missingVariables = requiredProductionVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) {
    throw new Error(`Missing production environment variables: ${missingVariables.join(', ')}`);
  }
}

// ─── Paths ────────────────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'data', 'notices.json');
const ENQUIRIES_FILE = path.join(__dirname, 'data', 'enquiries.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Ensure enquiries file exists
if (!fs.existsSync(ENQUIRIES_FILE)) {
  fs.writeFileSync(ENQUIRIES_FILE, '[]', 'utf-8');
}


// ─── Middleware ───────────────────────────────────────────────────────────────
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

// Serve uploaded PDFs statically
app.use('/api/uploads', express.static(UPLOADS_DIR));

// ─── Multer — PDF Upload Config ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    // Sanitize and generate unique filename: <uuid>-<original>.pdf
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    cb(null, `${uuidv4()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

// ─── Helpers — JSON Database ──────────────────────────────────────────────────
function readNotices() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeNotices(notices) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notices, null, 2), 'utf-8');
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({
    sub: ADMIN_USERNAME,
    exp: Date.now() + SESSION_DURATION_MS,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function requireAdmin(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Admin authentication required.' });

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return res.status(401).json({ error: 'Invalid admin session.' });

  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const signaturesMatch = signature.length === expectedSignature.length && crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
  if (!signaturesMatch) return res.status(401).json({ error: 'Invalid admin session.' });

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (session.sub !== ADMIN_USERNAME || typeof session.exp !== 'number' || session.exp <= Date.now()) {
      return res.status(401).json({ error: 'Admin session expired.' });
    }
    req.admin = session.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid admin session.' });
  }
}

function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.post('/api/admin/login', (req, res) => {
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recentAttempts = (loginAttempts.get(clientKey) || []).filter((time) => now - time < LOGIN_WINDOW_MS);
  if (recentAttempts.length >= LOGIN_MAX_ATTEMPTS) {
    res.setHeader('Retry-After', Math.ceil((LOGIN_WINDOW_MS - (now - recentAttempts[0])) / 1000));
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }

  recentAttempts.push(now);
  loginAttempts.set(clientKey, recentAttempts);
  const { username, password } = req.body || {};
  if (!safeEqual(username, ADMIN_USERNAME) || !safeEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  loginAttempts.delete(clientKey);
  res.json({ token: createAdminToken(), expiresIn: SESSION_DURATION_MS });
});

/**
 * GET /api/notices
 * Returns all notices sorted newest-first
 */
app.get('/api/notices', (_req, res) => {
  const notices = readNotices();
  const sorted = [...notices].sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );
  res.json(sorted);
});

/**
 * POST /api/notices
 * Create a new notice (with optional PDF upload)
 * Body (multipart/form-data):
 *   - title       (string, required)
 *   - category    (string, required)
 *   - important   (boolean string: "true" | "false")
 *   - content     (string, optional)
 *   - pdf         (file, optional — must be PDF)
 */
app.post('/api/notices', requireAdmin, upload.single('pdf'), (req, res) => {
  try {
    const { title, category, important, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required.' });
    }

    const now = new Date().toISOString();
    const id = uuidv4();

    const notice = {
      id,
      title: title.trim(),
      category: category.trim(),
      important: important === 'true' || important === true,
      content: content ? content.trim() : '',
      filename: req.file ? req.file.filename : null,
      originalName: req.file ? req.file.originalname : null,
      fileSize: req.file ? formatBytes(req.file.size) : null,
      uploadedAt: now,
    };

    const notices = readNotices();
    notices.unshift(notice); // Add to beginning
    writeNotices(notices);

    console.log(`[${now}] Notice created: "${notice.title}" | PDF: ${notice.filename || 'none'}`);
    res.status(201).json(notice);
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ error: 'Failed to create notice.' });
  }
});

/**
 * DELETE /api/notices/:id
 * Delete a notice and its associated PDF file
 */
app.delete('/api/notices/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const notices = readNotices();
  const index = notices.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Notice not found.' });
  }

  const [deleted] = notices.splice(index, 1);

  // Delete PDF file from disk if it exists
  if (deleted.filename) {
    const filePath = path.join(UPLOADS_DIR, deleted.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[${new Date().toISOString()}] PDF deleted: ${deleted.filename}`);
    }
  }

  writeNotices(notices);
  console.log(`[${new Date().toISOString()}] Notice deleted: "${deleted.title}"`);
  res.json({ success: true, deleted });
});

/**
 * GET /api/notices/:id
 * Get a single notice by ID
 */
app.get('/api/notices/:id', (req, res) => {
  const notices = readNotices();
  const notice = notices.find((n) => n.id === req.params.id);
  if (!notice) return res.status(404).json({ error: 'Notice not found.' });
  res.json(notice);
});

// ─── Enquiries Helpers ────────────────────────────────────────────────────────
function readEnquiries() {
  try {
    return JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeEnquiries(data) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Enquiry Routes ───────────────────────────────────────────────────────────

/**
 * GET /api/enquiries
 * Returns all enquiries sorted newest-first
 */
app.get('/api/enquiries', requireAdmin, (_req, res) => {
  const enquiries = readEnquiries();
  const sorted = [...enquiries].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );
  res.json(sorted);
});

/**
 * POST /api/enquiries
 * Submit a new student enquiry (Gmail only)
 * Body (JSON): { name, email, phone, subject, message }
 */
app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recentSubmissions = (enquiryAttempts.get(clientKey) || []).filter((time) => now - time < ENQUIRY_WINDOW_MS);
  if (recentSubmissions.length >= ENQUIRY_MAX_ATTEMPTS) {
    res.setHeader('Retry-After', Math.ceil((ENQUIRY_WINDOW_MS - (now - recentSubmissions[0])) / 1000));
    return res.status(429).json({ error: 'Too many enquiries submitted. Please try again later.' });
  }

  enquiryAttempts.set(clientKey, recentSubmissions);

  // Validate required fields
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
  if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required.' });
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required.' });

  if (typeof name !== 'string' || !/^[A-Za-z ]+$/.test(name.trim())) {
    return res.status(400).json({ error: 'Name must contain letters and spaces only.' });
  }
  if (name.trim().length > 80) return res.status(400).json({ error: 'Name is too long.' });
  if (email.trim().length > 120) return res.status(400).json({ error: 'Email is too long.' });
  if (message.trim().length > 2000) return res.status(400).json({ error: 'Message is too long.' });

  // Phone is optional, but a supplied number must contain exactly 10 digits.
  if (phone && (typeof phone !== 'string' || !/^\d{10}$/.test(phone.trim()))) {
    return res.status(400).json({ error: 'Phone number must contain exactly 10 digits.' });
  }

  // Gmail-only validation
  const gmailRegex = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i;
  if (!gmailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Only Gmail addresses (@gmail.com) are accepted.' });
  }

  const enquiry = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '',
    subject: subject || 'General',
    message: message.trim(),
    submittedAt: new Date().toISOString(),
    read: false,
  };

  const enquiries = readEnquiries();
  enquiries.unshift(enquiry);
  writeEnquiries(enquiries);
  recentSubmissions.push(now);
  enquiryAttempts.set(clientKey, recentSubmissions);

  console.log(`[${enquiry.submittedAt}] New enquiry from: ${enquiry.name} <${enquiry.email}> — ${enquiry.subject}`);
  res.status(201).json({ success: true, enquiry });
});

/**
 * PATCH /api/enquiries/:id/read
 * Mark an enquiry as read by admin
 */
app.patch('/api/enquiries/:id/read', requireAdmin, (req, res) => {
  const enquiries = readEnquiries();
  const item = enquiries.find((e) => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Enquiry not found.' });
  item.read = true;
  writeEnquiries(enquiries);
  res.json({ success: true });
});

/**
 * DELETE /api/enquiries/:id
 * Delete an enquiry
 */
app.delete('/api/enquiries/:id', requireAdmin, (req, res) => {
  const enquiries = readEnquiries();
  const index = enquiries.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Enquiry not found.' });
  const [deleted] = enquiries.splice(index, 1);
  writeEnquiries(enquiries);
  console.log(`[${new Date().toISOString()}] Enquiry deleted from: ${deleted.name}`);
  res.json({ success: true, deleted });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 20 MB.' });
    }
  }
  console.error('Server error:', err.message);
  res.status(400).json({ error: err.message || 'An unexpected error occurred.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎓 SAP College Notice Board Backend`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Notices API:   http://localhost:${PORT}/api/notices`);
  console.log(`   Enquiries API: http://localhost:${PORT}/api/enquiries`);
  console.log(`   Uploads:       http://localhost:${PORT}/api/uploads/<filename>`);
  console.log(`\n   Ready!\n`);
});

