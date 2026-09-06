# Production Architecture & Deployment Guide

This document outlines the production architecture, environment configuration, and deployment procedures for the Shri Anandrao Pawar College website.

## Current Architecture

**Frontend:**
- **Framework:** React + Vite
- **Hosting:** Netlify
- **Routing:** Netlify SPA fallback routing configured via `netlify.toml` (`/* /index.html 200`)

**Backend:**
- **Framework:** Node.js + Express
- **Hosting:** Render
- **Port:** Render dynamically assigns the `$PORT`. The backend must bind to `process.env.PORT`.

**Database:**
- **Provider:** Neon PostgreSQL
- **Connection:** Standard `DATABASE_URL` string with native CA-verified TLS negotiation.

**Media & Object Storage:**
- **Provider:** Cloudinary
- **Implementation:** Backend Node.js SDK (Server-side authenticated). The backend uploads buffers directly to Cloudinary and stores only the `public_id` in PostgreSQL.

**DNS/Domain:**
- Currently operating on a Netlify subdomain demo.
- Cloudflare DNS will be utilized to connect a custom domain post-client approval.

---

## Environment Variables

### Security Warning
- **NEVER include real secret values in documentation or source control.**
- **The `.env` file must remain local and untracked.**
- **`.env.example` must contain placeholders ONLY.**
- **`DATABASE_URL`, Admin credentials, and `CLOUDINARY_API_SECRET` must remain strictly server-side and never exposed to the frontend.**

### Required Backend Variables

Ensure these are securely configured within your Render dashboard:

```text
PORT=3001
ADMIN_USERNAME=your_secure_admin_username
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_SESSION_SECRET=a_long_cryptographically_secure_random_string
FRONTEND_ORIGIN=https://your-netlify-site.netlify.app
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## Local Development vs. Production

### Local Development
- **Frontend Server:** Runs via Vite development server on `localhost:8443` (or similar).
- **Backend Server:** Runs locally via `node server.js` on `localhost:3001`.
- **Proxy:** Vite handles `/api` proxying to `localhost:3001` via `vite.config.ts`.

### Production
- **Frontend Build:** Built to static files via `npm run build` and published to Netlify from the `dist` directory.
- **Backend Hosting:** Deployed to Render.
- **Frontend/API Routing:** The `/api/*` production proxy is not yet configured on the frontend. It will be explicitly configured in the Netlify settings or via an edge function *only after* the final Render backend URL is provisioned.

---

## Commands

- **Backend Start Command:** `npm start` (Executes `node server.js`)
- **Frontend Build Command:** `npm run build`
- **Netlify Publish Directory:** `dist`

### Database Initialization & Migration

Before the application can accept traffic on production, the schema must be initialized:

1. Connect your local environment to the production Neon `DATABASE_URL`.
2. Run `node backend/db-init.js` to create the required tables.
3. If migrating legacy data, run `node backend/migrate-data.js` to seed the database and upload legacy images/PDFs to Cloudinary.

---

## Production Deployment Checklist

1. [ ] Provision a Neon PostgreSQL database and retrieve the `DATABASE_URL`.
2. [ ] Provision a Cloudinary account and retrieve the Cloud Name, API Key, and Secret.
3. [ ] Create a Render Web Service for the backend.
4. [ ] Populate the Render Environment Variables securely.
5. [ ] Run Database Initialization (`db-init.js`) targeting the Neon database.
6. [ ] Deploy the backend on Render and copy the public URL.
7. [ ] Deploy the frontend on Netlify.
8. [ ] Configure the Netlify frontend to correctly proxy `/api` requests to the new Render backend URL.

## Post-Deployment Smoke Tests

Once deployed, verify the live environment with these smoke tests:
- **Public API:** Navigate to `GET /api/notices` and ensure it responds with HTTP 200 and JSON data.
- **Frontend Routing:** Hard-refresh a secondary frontend route (e.g. `/gallery` or `/notices`) to confirm the Netlify SPA fallback serves `index.html` without yielding a 404.
- **Uploads/Storage:** Log in via the `/admin` portal. Upload a small test image to the Gallery and a PDF to Notices. Verify they appear in the UI and their assets resolve through the backend Cloudinary proxy redirect.
- **Deletions:** Delete the test assets to ensure the compensation logic successfully removes them from Cloudinary and Neon.