const { Pool } = require("pg")

// Initialize the database connection pool using DATABASE_URL
// The pool automatically manages concurrent connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Centralized error handling for unexpected pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err)
  process.exit(-1)
})

/**
 * A simple query wrapper that acts identically to pool.query
 */
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params)
    return res
  } catch (error) {
    // Log the error internally but do not leak SQL statements or credentials
    console.error("Database query error:", error.message)
    throw error
  }
}

module.exports = {
  query,
  pool,
}
