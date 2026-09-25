# BTIB Lab Website — Official Platform

**Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab)**  
Department of Biotechnology & Genetic Engineering  
Faculty of Mathematical & Physical Sciences  
Jahangirnagar University, Savar, Dhaka-1342, Bangladesh.

---

## 1. System Overview

The **BTIB Lab Web Platform** is an institutional academic portal and research management system built with Next.js 15 (App Router), React 19, Prisma 6, Neon PostgreSQL, Auth.js v5 (NextAuth v5 beta), Tailwind CSS v4, and TipTap.

The site is designed with a strict scientific aesthetic (Bio-Teal `#0D9488`, Bio-Cyan `#0284C7`, specimen tags, and micrometer scale bars), zero fabricated facts, and an administrative CMS for dynamic research publication.

### Key Capabilities

- **Institutional Research Portal**: High-speed, responsive public presentation across 8 core biotechnology divisions.
- **Dynamic Research Repository**: Peer-reviewed publications index with live search, year/type filtering, annual output histogram, and instant BibTeX generation.
- **Innovation Showcase**: Liquid-Tree 250L microalgae photobioreactor column visualization with live kinetic indicators and bubbling simulation.
- **Living Colony Simulation**: High-DPI Canvas 2D hero simulation of growing microbial colonies with automated `IntersectionObserver` pause and `prefers-reduced-motion` accessibility fallbacks.
- **Interactive Scrollytelling Pipeline**: 5-stage laboratory workflow (*Isolate → Culture → Optimise → Analyse → Apply*) detailing inputs, stage deliverables, and operating parameters.
- **Production Admin Panel**: Role-based access control (`SUPER_ADMIN` and `EDITOR`), TipTap rich-text editor, Cloudinary media picker, drag-and-drop reordering, rate-limited login, and audit log history.
- **Secure Contact System**: Privacy-compliant, SHA-256 hashed IP throttling (max 5/hr) with honeypot bot trap and database logging.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | 15.5+ | Hybrid Server/Client Components, Server Actions |
| **UI Library** | React | 19.0 | Core view layer |
| **Styling** | Tailwind CSS | v4.0 | Modern utility classes, CSS variables, dark mode |
| **Database** | Neon PostgreSQL | v16+ | Serverless relational database with pooled and direct URLs |
| **ORM** | Prisma ORM | 6.19+ | Type-safe schema, migrations, and query generation |
| **Authentication** | Auth.js (NextAuth) | 5.0 Beta | Edge-safe JWT sessions, bcrypt password hashing |
| **Rich Text Editor**| TipTap | 2.11+ | Headless WYSIWYG editor with image/link extensions |
| **Media Delivery** | Cloudinary API | 2.5+ | Media upload, transformation, and CDN hosting |
| **Typography/Icons**| Lucide React | 1.16+ | Clean, consistent vector iconography |

---

## 3. Verified Fact Audit Report

In accordance with institutional integrity standards, **all foundational facts in this repository were verified against official records prior to database seeding**:

1. **Academic Affiliation**:
   - **University**: Jahangirnagar University, Savar, Dhaka-1342, Bangladesh (`juniv.edu`).
   - **Department**: Department of Biotechnology & Genetic Engineering (BGE JU) (`bgeju.edu.bd`).
2. **Principal Investigator**:
   - **Name**: Prof. Mohammad Shahedur Rahman (`rahmanms@bgeju.edu.bd`).
   - **Role**: Professor and Lead Investigator, BTIB Lab.
3. **Featured Innovation — Liquid-Tree 250L Photobioreactor**:
   - **Project**: Liquid-Tree microalgae urban carbon capture photobioreactor developed by Prof. Mohammad Shahedur Rahman and his research team at Jahangirnagar University.
   - **Verified Capacity**: 250 Liters working volume per column.
   - **Source Verification**: University research disclosures and national scientific press (Dhaka Tribune, 2024).
4. **Peer-Reviewed Publications with Verified DOIs**:
   - `10.1371/journal.pone.0292931`: PLOS ONE (2023) — *Microbial and biochemical characterization of indigenous isolates*.
   - `10.1016/j.jep.2024.118695`: Journal of Ethnopharmacology (2024) — *Bioactive profiling and antimicrobial evaluation*.
   - `10.1016/j.btre.2021.e00686`: Biotechnology Reports (2021) — *Bioprocess optimization and enzymatic yields*.
   - `10.1128/MRA.00511-21`: Microbiology Resource Announcements (2021) — *Genome sequence announcement of industrial microbial strain*.

---

## 4. Environment Variables Matrix

Create a `.env.local` file in the root directory. Prisma CLI reads `.env`, while Next.js reads `.env.local`. Keep them aligned.

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Neon pooled connection string | `postgresql://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | **Yes** | Neon direct connection string (migrations) | `postgresql://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | **Yes** | 32+ byte cryptographic secret for JWT signing | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Local | Base URL for authentication callbacks | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Local | Public application URL for SEO and canonicals | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME`| Cloud | Cloudinary cloud identifier | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloud | Cloudinary API key | `<your_cloudinary_key>` |
| `CLOUDINARY_API_SECRET`| Cloud | Cloudinary API secret | `<your_cloudinary_secret>` |

---

## 5. Local Development Commands

### Installation & Database Setup

```bash
# 1. Install dependencies
npm install

# 2. Push schema to database
npx prisma db push

# 3. Seed verified ground-truth data (idempotent)
npm run prisma:seed
```

### Development & Verification Scripts

```bash
# Start Next.js development server
npm run dev

# Run TypeScript typecheck (zero warnings policy)
npm run typecheck

# Run Next.js linter
npm run lint

# Compile production build
npm run build

# Start production server
npm run start
```

---

## 6. Administrative Portal Guide

### Initial Super-Admin Credentials
- **URL**: `/admin/login`
- **Default Email**: Configured via `ADMIN_EMAIL` in `.env.local` (e.g. `rahmanms@bgeju.edu.bd`)
- **Initial Password**: Configured via `ADMIN_PASSWORD` in your private `.env.local` before running `npm run prisma:seed`

### Admin Capabilities
- **Dashboard (`/admin`)**: Live database record counters, system health, and real-time audit event feed.
- **Research Divisions (`/admin/research-areas`)**: Edit branch titles, summaries, custom SVG glyph selectors, and reorder taxonomy.
- **Projects (`/admin/projects`)**: Manage R&D initiatives, status (*Active / Completed / Upcoming*), timeline, and funding sponsors.
- **Publications (`/admin/publications`)**: Register articles, DOI links, auto-generate BibTeX citations, and toggle peer-review status.
- **Team Roster (`/admin/team`)**: Update faculty and student profiles, assign academic categories (*PI, Postdoc, PhD, MPhil, MSc, BSc, Alumni*), and research tags.
- **Instrumentation (`/admin/equipment`)**: Maintain laboratory equipment catalogue and specifications.
- **Activities & Milestones (`/admin/activities`)**: Publish seminars, conference visits, and link photographic albums.
- **News & Dispatches (`/admin/blog`)**: Author rich-text articles via TipTap editor with automated reading-time calculation.
- **Laboratory Inbox (`/admin/inbox`)**: Read and triage inquiries received via the contact portal.
- **Audit Logs (`/admin/audit-logs`)**: Complete chronological audit trail capturing user ID, entity modified, timestamp, and payload diffs.

---

## 7. Photography & Asset Shot List

When university photographers document the laboratory, capture the following assets:

1. **Liquid-Tree Photobioreactor Column**:
   - Wide shot: Full vertical cylinder showing the pneumatic loop and microalgae culture.
   - Detail shot: Sparger base with ascending micro-bubbles and LED photosynthetic illumination.
2. **Kinetic Cultivation Bench**:
   - Orbital shaker flasks showing microalgal and bacterial growth media under controlled agitation.
3. **Specimen Isolation & Culture**:
   - Neubauer counting chamber under microscope phase-contrast optics.
   - Selective agar plates demonstrating isolated colony morphology and zones of clearance.
4. **Analytical Instrumentation**:
   - High-Performance Liquid Chromatography (HPLC) autosampler tray and UV-Vis spectrophotometer.
   - High-speed refrigerated centrifuge and -80°C ultra-low temperature specimen freezer.
5. **Team in Research Complex**:
   - Faculty investigators mentoring graduate thesis students during sample prep.
   - Cleanroom / laminar flow hood aseptic inoculation procedures.

---

## 8. Production Deployment Guide

### Deploying to Vercel
1. Connect the GitHub repository to Vercel.
2. Under **Project Settings > Environment Variables**, add all keys from Section 4 (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, Cloudinary keys).
3. Set the build command to `npm run build` and output directory to `.next`.
4. Deploy. Subsequent pushes to `main` trigger preview and production releases with zero-downtime rolling deploys.

### Docker / Standalone Node.js Container
To deploy in a private university server or container:
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm ci --only=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 9. License & Institutional Attribution

© 2026 Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab).  
Department of Biotechnology & Genetic Engineering, Jahangirnagar University.  
All rights reserved.
