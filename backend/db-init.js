require("dotenv").config()
const { query } = require("./db")

async function initDB() {
  console.log("Checking and initializing database tables...")

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS notices (
        id UUID PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(50) NOT NULL,
        content TEXT,
        important BOOLEAN NOT NULL DEFAULT false,
        pdf_key TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
    console.log("✅ Table 'notices' is ready.")

    await query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id UUID PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(10),
        subject VARCHAR(255),
        message VARCHAR(2000) NOT NULL,
        read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
    console.log("✅ Table 'enquiries' is ready.")

    await query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image_key TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
    console.log("✅ Table 'gallery' is ready.")

    // Adding useful indexes for sorting/filtering
    await query(
      `CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices (created_at DESC);`,
    )
    await query(
      `CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);`,
    )
    await query(
      `CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery (created_at DESC);`,
    )
    console.log("✅ Indexes are ready.")

    console.log("\nDatabase initialization complete.")
    process.exit(0)
  } catch (err) {
    console.error("❌ Failed to initialize database:")
    console.error(err)
    process.exit(1)
  }
}

initDB()
