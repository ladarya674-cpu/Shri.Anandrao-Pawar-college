require("dotenv").config()

/**
 * SAP College Notice Board — Express Backend
 * Handles PDF notice uploads, persistent storage, and REST API
 */

const express = require("express")

const multer = require("multer")

const cors = require("cors")

const crypto = require("crypto")

const path = require("path")

const { v4: uuidv4 } = require("uuid")

const { query } = require("./db")
const {
  uploadImage,
  uploadPdf,
  deleteImage,
  deletePdf,
  getCloudinaryUrl,
} = require("./cloudinary")

const app = express()

const PORT = Number(process.env.PORT) || 3001

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

const DATABASE_URL = process.env.DATABASE_URL
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

if (
  !ADMIN_USERNAME ||
  !ADMIN_PASSWORD ||
  !SESSION_SECRET ||
  !FRONTEND_ORIGIN ||
  !DATABASE_URL ||
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_API_SECRET
) {
  console.error("CRITICAL ERROR: Missing required environment variables.")
  console.error(
    "Please ensure all required authentication, database, and storage variables are set in your environment.",
  )
  process.exit(1)
}

const loginAttempts = new Map()

const enquiryAttempts = new Map()

const LOGIN_WINDOW_MS = 15 * 60 * 1000

const LOGIN_MAX_ATTEMPTS = 10

const ENQUIRY_WINDOW_MS = 60 * 60 * 1000

const ENQUIRY_MAX_ATTEMPTS = 20

// Cleanup old rate limit entries to prevent memory leaks

setInterval(
  () => {
    const now = Date.now()

    for (const [key, attempts] of loginAttempts.entries()) {
      const valid = attempts.filter((time) => now - time < LOGIN_WINDOW_MS)

      if (valid.length === 0) loginAttempts.delete(key)
      else loginAttempts.set(key, valid)
    }

    for (const [key, attempts] of enquiryAttempts.entries()) {
      const valid = attempts.filter((time) => now - time < ENQUIRY_WINDOW_MS)

      if (valid.length === 0) enquiryAttempts.delete(key)
      else enquiryAttempts.set(key, valid)
    }
  },
  5 * 60 * 1000,
)

// ─── Middleware ───────────────────────────────────────────────────────────────

app.disable("x-powered-by")

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")

  res.setHeader("X-Frame-Options", "DENY")

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  )

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    )
  }

  next()
})

app.use(cors({ origin: FRONTEND_ORIGIN }))

app.use(express.json({ limit: "100kb" }))

// Serve uploaded files via redirect to Object Storage
app.get("/api/uploads/gallery/:filename", (req, res) => {
  const { filename } = req.params
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).json({ error: "Invalid filename format." })
  }
  const publicId = `sap-college/gallery/${filename.split(".")[0]}`
  res.redirect(getCloudinaryUrl(publicId, "image"))
})
app.get("/api/uploads/:filename", (req, res) => {
  const { filename } = req.params
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).json({ error: "Invalid filename format." })
  }
  const publicId = `sap-college/notices/${filename.split(".")[0]}`
  res.redirect(getCloudinaryUrl(publicId, "raw"))
})

// ─── Multer — PDF Upload Config ───────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed."), false)
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
})

// ─── Multer — Gallery Upload Config ───────────────────────────────────────────

// ─── Multer — Gallery Upload Config ───────────────────────────────────────────

const galleryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowedMime = ["image/jpeg", "image/png", "image/webp"]
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

// Local JSON helpers removed in favor of PostgreSQL

function formatBytes(bytes) {
  if (!bytes) return null

  if (bytes < 1024) return `${bytes} B`

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({
      sub: ADMIN_USERNAME,

      exp: Date.now() + SESSION_DURATION_MS,
    }),
  ).toString("base64url")

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url")

  return `${payload}.${signature}`
}

function requireAdmin(req, res, next) {
  res.setHeader("Cache-Control", "no-store")

  const authorization = req.get("authorization") || ""

  const [scheme, token] = authorization.split(" ")

  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ error: "Admin authentication required." })

  const [payload, signature] = token.split(".")

  if (!payload || !signature)
    return res.status(401).json({ error: "Invalid admin session." })

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url")

  const signaturesMatch =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(
      Buffer.from(signature),

      Buffer.from(expectedSignature),
    )

  if (!signaturesMatch)
    return res.status(401).json({ error: "Invalid admin session." })

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    )

    if (
      session.sub !== ADMIN_USERNAME ||
      typeof session.exp !== "number" ||
      session.exp <= Date.now()
    ) {
      return res.status(401).json({ error: "Admin session expired." })
    }

    req.admin = session.sub

    next()
  } catch {
    return res.status(401).json({ error: "Invalid admin session." })
  }
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false

  const leftBuffer = Buffer.from(left)

  const rightBuffer = Buffer.from(right)

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  )
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.post("/api/admin/login", (req, res) => {
  const clientKey = req.ip || req.socket.remoteAddress || "unknown"

  const now = Date.now()

  const recentAttempts = (loginAttempts.get(clientKey) || []).filter(
    (time) => now - time < LOGIN_WINDOW_MS,
  )

  if (recentAttempts.length >= LOGIN_MAX_ATTEMPTS) {
    res.setHeader(
      "Retry-After",
      Math.ceil((LOGIN_WINDOW_MS - (now - recentAttempts[0])) / 1000),
    )

    return res
      .status(429)
      .json({ error: "Too many login attempts. Try again later." })
  }

  recentAttempts.push(now)

  loginAttempts.set(clientKey, recentAttempts)

  const { username, password } = req.body || {}

  if (
    !safeEqual(username, ADMIN_USERNAME) ||
    !safeEqual(password, ADMIN_PASSWORD)
  ) {
    return res.status(401).json({ error: "Invalid username or password." })
  }

  loginAttempts.delete(clientKey)

  res.json({ token: createAdminToken(), expiresIn: SESSION_DURATION_MS })
})

/**
 * GET /api/notices
 * Returns all notices sorted newest-first
 */

app.get("/api/notices", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM notices ORDER BY created_at DESC",
    )
    // Map database snake_case fields back to frontend expected camelCase
    const notices = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      important: r.important,
      content: r.content || "",
      filename: r.pdf_key
        ? r.pdf_key.replace("sap-college/notices/", "")
        : null,
      uploadedAt: r.created_at,
    }))
    res.json(notices)
  } catch (err) {
    console.error("Error fetching notices:", err)
    res.status(500).json({ error: "Failed to fetch notices" })
  }
})

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

app.post(
  "/api/notices",
  requireAdmin,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { title, category, important, content } = req.body

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title is required." })
      }

      if (title.trim().length > 200) {
        return res.status(400).json({ error: "Title is too long." })
      }

      if (!category || typeof category !== "string" || !category.trim()) {
        return res.status(400).json({ error: "Category is required." })
      }

      if (category.trim().length > 50) {
        return res.status(400).json({ error: "Category is too long." })
      }

      if (
        content &&
        typeof content === "string" &&
        content.trim().length > 5000
      ) {
        return res.status(400).json({ error: "Content is too long." })
      }

      const id = uuidv4()
      let pdfKey = null

      if (req.file) {
        const buffer = req.file.buffer
        if (buffer.length < 5 || buffer.toString("utf-8", 0, 5) !== "%PDF-") {
          return res
            .status(400)
            .json({ error: "Uploaded file is not a valid PDF." })
        }

        // Use UUID as public_id for Cloudinary
        pdfKey = `sap-college/notices/${id}`
        await uploadPdf(buffer, pdfKey)
      }

      const now = new Date().toISOString()
      const isImportant = important === "true" || important === true

      try {
        await query(
          `
        INSERT INTO notices (id, title, category, content, important, pdf_key, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
          [
            id,
            title.trim(),
            category.trim(),
            content ? content.trim() : null,
            isImportant,
            pdfKey,
            now,
          ],
        )
      } catch (dbErr) {
        console.error("Database insert error:", dbErr.message)
        if (pdfKey) {
          try {
            await deletePdf(pdfKey)
            console.log(`Cleaned up orphaned Cloudinary object: ${pdfKey}`)
          } catch (cleanupErr) {
            console.error(
              "Failed to clean up orphaned Cloudinary object:",
              cleanupErr.message,
            )
          }
        }
        return res.status(500).json({ error: "Failed to create notice." })
      }

      const notice = {
        id,
        title: title.trim(),
        category: category.trim(),
        important: isImportant,
        content: content ? content.trim() : "",
        filename: pdfKey ? pdfKey.replace("sap-college/notices/", "") : null,
        uploadedAt: now,
      }

      console.log(
        `[${now}] Notice created: "${notice.title}" | PDF: ${pdfKey || "none"}`,
      )

      res.status(201).json(notice)
    } catch (err) {
      console.error("Error creating notice:", err)
      res.status(500).json({ error: "Failed to create notice." })
    }
  },
)

/**
 * DELETE /api/notices/:id
 * Delete a notice and its associated PDF file
 */

app.delete("/api/notices/:id", requireAdmin, async (req, res) => {
  const { id } = req.params

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rows } = await query(
      "SELECT pdf_key, title FROM notices WHERE id = $1",
      [id],
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: "Notice not found." })
    }

    const deleted = rows[0]

    // Delete PDF file from Cloudinary if it exists
    if (deleted.pdf_key) {
      await deletePdf(deleted.pdf_key)
      console.log(
        `[${new Date().toISOString()}] PDF deleted from Cloudinary: ${deleted.pdf_key}`,
      )
    }

    await query("DELETE FROM notices WHERE id = $1", [id])

    console.log(
      `[${new Date().toISOString()}] Notice deleted: "${deleted.title}"`,
    )

    res.json({ success: true })
  } catch (err) {
    console.error("Error deleting notice:", err)
    res.status(500).json({ error: "Failed to delete notice." })
  }
})

/**
 * GET /api/notices/:id
 * Get a single notice by ID
 */

app.get("/api/notices/:id", async (req, res) => {
  const { id } = req.params

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rows } = await query("SELECT * FROM notices WHERE id = $1", [id])
    if (rows.length === 0)
      return res.status(404).json({ error: "Notice not found." })

    const r = rows[0]
    res.json({
      id: r.id,
      title: r.title,
      category: r.category,
      important: r.important,
      content: r.content || "",
      filename: r.pdf_key
        ? r.pdf_key.replace("sap-college/notices/", "")
        : null,
      uploadedAt: r.created_at,
    })
  } catch (err) {
    console.error("Error fetching notice:", err)
    res.status(500).json({ error: "Failed to fetch notice." })
  }
})

// Legacy file system logic removed

// ─── Enquiry Routes ───────────────────────────────────────────────────────────

/**
 * GET /api/enquiries
 * Returns all enquiries sorted newest-first
 */

app.get("/api/enquiries", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM enquiries ORDER BY created_at DESC",
    )
    const enquiries = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || "",
      subject: r.subject || "",
      message: r.message,
      read: r.read,
      submittedAt: r.created_at,
    }))
    res.json(enquiries)
  } catch (err) {
    console.error("Error fetching enquiries:", err)
    res.status(500).json({ error: "Failed to fetch enquiries." })
  }
})

/**
 * POST /api/enquiries
 * Submit a new student enquiry (Gmail only)
 * Body (JSON): { name, email, phone, subject, message }
 */

app.post("/api/enquiries", async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  const clientKey = req.ip || req.socket.remoteAddress || "unknown"

  const now = Date.now()

  const recentSubmissions = (enquiryAttempts.get(clientKey) || []).filter(
    (time) => now - time < ENQUIRY_WINDOW_MS,
  )

  if (recentSubmissions.length >= ENQUIRY_MAX_ATTEMPTS) {
    res.setHeader(
      "Retry-After",
      Math.ceil((ENQUIRY_WINDOW_MS - (now - recentSubmissions[0])) / 1000),
    )

    return res
      .status(429)
      .json({ error: "Too many enquiries submitted. Please try again later." })
  }

  enquiryAttempts.set(clientKey, recentSubmissions)

  // Validate required fields

  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ error: "Name is required." })

  if (typeof email !== "string" || !email.trim())
    return res.status(400).json({ error: "Email is required." })

  if (typeof message !== "string" || !message.trim())
    return res.status(400).json({ error: "Message is required." })

  if (typeof name !== "string" || !/^[A-Za-z ]+$/.test(name.trim())) {
    return res
      .status(400)
      .json({ error: "Name must contain letters and spaces only." })
  }

  if (name.trim().length > 80)
    return res.status(400).json({ error: "Name is too long." })

  if (email.trim().length > 120)
    return res.status(400).json({ error: "Email is too long." })

  if (message.trim().length > 2000)
    return res.status(400).json({ error: "Message is too long." })

  // Phone is optional, but a supplied number must contain exactly 10 digits.

  if (phone && (typeof phone !== "string" || !/^\d{10}$/.test(phone.trim()))) {
    return res
      .status(400)
      .json({ error: "Phone number must contain exactly 10 digits." })
  }

  // Gmail-only validation

  const gmailRegex = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i

  if (!gmailRegex.test(email.trim())) {
    return res
      .status(400)
      .json({ error: "Only Gmail addresses (@gmail.com) are accepted." })
  }

  try {
    const id = uuidv4()
    const nowIso = new Date().toISOString()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone ? phone.trim() : null
    const cleanSubject = subject || "General"
    const cleanMessage = message.trim()

    await query(
      `
      INSERT INTO enquiries (id, name, email, phone, subject, message, read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        id,
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanSubject,
        cleanMessage,
        false,
        nowIso,
      ],
    )

    recentSubmissions.push(now)
    enquiryAttempts.set(clientKey, recentSubmissions)

    console.log(
      `[${nowIso}] New enquiry from: ${cleanName} <${cleanEmail}> — ${cleanSubject}`,
    )

    const enquiry = {
      id,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || "",
      subject: cleanSubject,
      message: cleanMessage,
      submittedAt: nowIso,
      read: false,
    }

    res.status(201).json({ success: true, enquiry })
  } catch (err) {
    console.error("Error creating enquiry:", err)
    res.status(500).json({ error: "Failed to submit enquiry." })
  }
})

/**
 * PATCH /api/enquiries/:id/read
 * Mark an enquiry as read by admin
 */

app.patch("/api/enquiries/:id/read", requireAdmin, async (req, res) => {
  const { id } = req.params

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rowCount } = await query(
      "UPDATE enquiries SET read = true WHERE id = $1",
      [id],
    )
    if (rowCount === 0)
      return res.status(404).json({ error: "Enquiry not found." })
    res.json({ success: true })
  } catch (err) {
    console.error("Error updating enquiry:", err)
    res.status(500).json({ error: "Failed to update enquiry." })
  }
})

/**
 * DELETE /api/enquiries/:id
 * Delete an enquiry
 */

app.delete("/api/enquiries/:id", requireAdmin, async (req, res) => {
  const { id } = req.params

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rows } = await query(
      "DELETE FROM enquiries WHERE id = $1 RETURNING name",
      [id],
    )
    if (rows.length === 0)
      return res.status(404).json({ error: "Enquiry not found." })

    console.log(
      `[${new Date().toISOString()}] Enquiry deleted from: ${rows[0].name}`,
    )

    res.json({ success: true, deleted: rows[0] })
  } catch (err) {
    console.error("Error deleting enquiry:", err)
    res.status(500).json({ error: "Failed to delete enquiry." })
  }
})

// ─── Gallery Routes ───────────────────────────────────────────────────────────

app.get("/api/gallery", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM gallery ORDER BY created_at DESC",
    )
    const gallery = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description || "",
      filename: r.image_key
        ? r.image_key.replace("sap-college/gallery/", "")
        : null,
      uploadedAt: r.created_at,
    }))
    res.json(gallery)
  } catch (err) {
    console.error("Error fetching gallery:", err)
    res.status(500).json({ error: "Failed to fetch gallery." })
  }
})

app.get("/api/gallery/:id", async (req, res) => {
  const { id } = req.params
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rows } = await query("SELECT * FROM gallery WHERE id = $1", [id])
    if (rows.length === 0)
      return res.status(404).json({ error: "Gallery item not found." })

    const r = rows[0]
    res.json({
      id: r.id,
      title: r.title,
      description: r.description || "",
      filename: r.image_key
        ? r.image_key.replace("sap-college/gallery/", "")
        : null,
      uploadedAt: r.created_at,
    })
  } catch (err) {
    console.error("Error fetching gallery item:", err)
    res.status(500).json({ error: "Failed to fetch gallery item." })
  }
})

app.post(
  "/api/gallery",
  requireAdmin,
  galleryUpload.single("image"),
  async (req, res) => {
    try {
      const { title, description } = req.body

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title is required." })
      }
      if (title.trim().length > 200) {
        return res.status(400).json({ error: "Title is too long." })
      }

      if (
        description &&
        (typeof description !== "string" || description.trim().length > 2000)
      ) {
        return res.status(400).json({ error: "Description is too long." })
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required." })
      }

      const buffer = req.file.buffer
      if (buffer.length < 12) {
        return res
          .status(400)
          .json({ error: "Uploaded file is too small to be a valid image." })
      }

      const hex = buffer.toString("hex", 0, 12).toUpperCase()
      let isValidImage = false
      if (hex.startsWith("FFD8FF")) isValidImage = true // JPEG
      if (hex.startsWith("89504E47")) isValidImage = true // PNG
      if (hex.startsWith("52494646") && hex.substring(16, 24) === "57454250")
        isValidImage = true // WEBP (RIFF...WEBP)

      if (!isValidImage) {
        return res
          .status(400)
          .json({ error: "Uploaded file is not a valid image format." })
      }

      const now = new Date().toISOString()
      const id = uuidv4()

      // Use UUID as public_id for Cloudinary
      const imageKey = `sap-college/gallery/${id}`

      await uploadImage(buffer, imageKey)

      try {
        await query(
          `
          INSERT INTO gallery (id, title, description, image_key, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [
            id,
            title.trim(),
            description ? description.trim() : null,
            imageKey,
            now,
          ],
        )
      } catch (dbErr) {
        console.error("Database insert error:", dbErr.message)
        try {
          await deleteImage(imageKey)
          console.log(`Cleaned up orphaned Cloudinary object: ${imageKey}`)
        } catch (cleanupErr) {
          console.error(
            "Failed to clean up orphaned Cloudinary object:",
            cleanupErr.message,
          )
        }
        return res.status(500).json({ error: "Failed to create gallery item." })
      }

      const galleryItem = {
        id,
        title: title.trim(),
        description: description ? description.trim() : "",
        filename: imageKey.replace("sap-college/gallery/", ""),
        uploadedAt: now,
      }

      console.log(
        `[${now}] Gallery item created: "${galleryItem.title}" | Image: ${imageKey}`,
      )
      res.status(201).json(galleryItem)
    } catch (err) {
      console.error("Error creating gallery item:", err)
      res.status(500).json({ error: "Failed to create gallery item." })
    }
  },
)

app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
  const { id } = req.params
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id))
    return res.status(400).json({ error: "Invalid ID format." })

  try {
    const { rows } = await query(
      "SELECT image_key, title FROM gallery WHERE id = $1",
      [id],
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found." })
    }

    const deleted = rows[0]

    if (deleted.image_key) {
      await deleteImage(deleted.image_key)
      console.log(
        `[${new Date().toISOString()}] Gallery image deleted from Cloudinary: ${deleted.image_key}`,
      )
    }

    await query("DELETE FROM gallery WHERE id = $1", [id])

    console.log(
      `[${new Date().toISOString()}] Gallery item deleted: "${deleted.title}"`,
    )
    res.json({ success: true })
  } catch (err) {
    console.error("Error deleting gallery item:", err)
    res.status(500).json({ error: "Failed to delete gallery item." })
  }
})

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      if (err.field === "image") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 5 MB." })
      }
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 20 MB." })
    }
  }

  console.error("Server error:", err.message)

  res
    .status(400)
    .json({ error: err.message || "An unexpected error occurred." })
})

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🎓 SAP College Notice Board Backend`)

  console.log(`   Running on http://localhost:${PORT}`)

  console.log(`   Notices API:   http://localhost:${PORT}/api/notices`)

  console.log(`   Enquiries API: http://localhost:${PORT}/api/enquiries`)
  console.log(`   Gallery API:   http://localhost:${PORT}/api/gallery`)

  console.log(
    `   Uploads:       http://localhost:${PORT}/api/uploads/<filename>`,
  )

  console.log(`\n   Ready!\n`)
})
