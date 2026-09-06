require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { query, pool } = require("./db")
const { uploadImage, uploadPdf } = require("./cloudinary")

const DATA_DIR = path.join(__dirname, "data")
const UPLOADS_DIR = path.join(__dirname, "uploads")
const GALLERY_UPLOADS_DIR = path.join(__dirname, "uploads", "gallery")

async function migrateNotices() {
  const noticesFile = path.join(DATA_DIR, "notices.json")
  if (!fs.existsSync(noticesFile))
    return console.log("No notices.json found. Skipping.")

  const notices = JSON.parse(fs.readFileSync(noticesFile, "utf-8"))
  for (const notice of notices) {
    // Check if notice already exists
    const res = await query("SELECT id FROM notices WHERE id = $1", [notice.id])
    if (res.rows.length > 0) {
      console.log(`Notice ${notice.id} already migrated.`)
      continue
    }

    let pdfKey = null
    if (notice.filename) {
      const filePath = path.join(UPLOADS_DIR, notice.filename)
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        // Cloudinary expects just the public_id, without extensions
        pdfKey = `sap-college/notices/${notice.id}`
        console.log(`Uploading ${pdfKey} to Cloudinary...`)
        try {
          await uploadPdf(buffer, pdfKey)
        } catch (err) {
          console.error(`Failed to upload ${pdfKey}:`, err.message)
          continue // skip migration for this record if upload fails
        }
      }
    }

    await query(
      `
      INSERT INTO notices (id, title, category, content, important, pdf_key, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        notice.id,
        notice.title,
        notice.category,
        notice.content || null,
        notice.important || false,
        pdfKey,
        notice.uploadedAt || new Date().toISOString(),
      ],
    )
    console.log(`Migrated notice: ${notice.title}`)
  }
}

async function migrateEnquiries() {
  const enquiriesFile = path.join(DATA_DIR, "enquiries.json")
  if (!fs.existsSync(enquiriesFile))
    return console.log("No enquiries.json found. Skipping.")

  const enquiries = JSON.parse(fs.readFileSync(enquiriesFile, "utf-8"))
  for (const enq of enquiries) {
    const res = await query("SELECT id FROM enquiries WHERE id = $1", [enq.id])
    if (res.rows.length > 0) continue

    await query(
      `
      INSERT INTO enquiries (id, name, email, phone, subject, message, read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        enq.id,
        enq.name,
        enq.email,
        enq.phone || null,
        enq.subject || null,
        enq.message,
        enq.read || false,
        enq.submittedAt || new Date().toISOString(),
      ],
    )
    console.log(`Migrated enquiry from: ${enq.name}`)
  }
}

async function migrateGallery() {
  const galleryFile = path.join(DATA_DIR, "gallery.json")
  if (!fs.existsSync(galleryFile))
    return console.log("No gallery.json found. Skipping.")

  const gallery = JSON.parse(fs.readFileSync(galleryFile, "utf-8"))
  for (const item of gallery) {
    const res = await query("SELECT id FROM gallery WHERE id = $1", [item.id])
    if (res.rows.length > 0) continue

    let imageKey = null
    if (item.filename) {
      const filePath = path.join(GALLERY_UPLOADS_DIR, item.filename)
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        imageKey = `sap-college/gallery/${item.id}`
        console.log(`Uploading ${imageKey} to Cloudinary...`)
        try {
          await uploadImage(buffer, imageKey)
        } catch (err) {
          console.error(`Failed to upload ${imageKey}:`, err.message)
          continue
        }
      } else {
        console.log(
          `Local file missing for gallery item ${item.id}, skipping Cloudinary upload.`,
        )
        continue // Gallery items must have an image
      }
    } else {
      continue // skip if no image
    }

    await query(
      `
      INSERT INTO gallery (id, title, description, image_key, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [
        item.id,
        item.title,
        item.description || null,
        imageKey,
        item.uploadedAt || new Date().toISOString(),
      ],
    )
    console.log(`Migrated gallery item: ${item.title}`)
  }
}

async function runMigration() {
  console.log("Starting data migration to PostgreSQL and Cloudinary...")
  try {
    await migrateNotices()
    await migrateEnquiries()
    await migrateGallery()
    console.log("✅ Migration completed successfully.")
  } catch (err) {
    console.error("❌ Migration failed:")
    console.error(err)
  } finally {
    pool.end()
  }
}

runMigration()
