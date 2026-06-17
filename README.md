# Aatheria — High-Precision 3D Printing Service Portal

Aatheria is a modern, responsive, and secure full-stack web application designed for a state-of-the-art industrial 3D printing and additive manufacturing service. It features an interactive client landing page, a CAD print quote builder, and an operator dashboard for queue metrics management backed by a local SQLite database.

---

## 🚀 Key Features

1. **Diagnostic Preloader**: Web preloader displaying mock calibration diagnostic logs (thermistors, bed leveling, stepper driver calibration) before loading the main site.
2. **Slicer Pipeline Visualizer**: Interactive progress pipeline in the Hero section showing the G-code compile states (*Model Ingested -> Slicing G-Code -> Job Registered -> Printing Started*). Submitting a quote request reactively animates this pipeline.
3. **Interactive 3D Print Quote Builder**: Form fields to select material tiers (PLA, SLA Resin, SLS Titanium) and specify layer heights, density, and custom dimensions. Includes client-side and server-side validation.
4. **Hybrid Auth Portal**:
   - **Client Portal**: Users can sign up for new accounts or sign in.
   - **Operator Dashboard**: Locked to sign-in only, displaying default administrator credentials on screen and prefilling them for ease of testing.
5. **Print Operator Dashboard (Admin)**: Detailed admin panel querying the database to show computed KPIs:
   - **Total Revenue**: Live calculation representing completed print jobs.
   - **Volume Printed**: Dynamic sum of output volume in cubic centimeters (cc).
   - **Pending Queue**: Print runs awaiting slicing verification.
   - **Total Jobs**: Total files queued in the ledger.
6. **SQLite Raw Database Inspector**: Integrates a live database ledger on the operator screen displaying raw tables directly from SQLite.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Vanilla CSS (Glassmorphism & dark-neon styles) + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3` native drivers)
- **Tooling**: `concurrently` (concurrent client/server execution), `nodemon` (hot reloading)

---

## 📂 Project Structure

```text
pmwlf/
├── package.json         # Root scripts to orchestrate client & server
├── README.md            # Project documentation
├── render.yaml          # Render blueprint deployment file
├── client/              # React frontend
│   ├── package.json
│   ├── vite.config.js   # Proxy configuration pointing to Express port 5000
│   ├── index.html       # Fonts (Outfit/Inter) and SEO meta tags
│   └── src/
│       ├── main.jsx     # DOM entrypoint
│       ├── App.jsx      # Page component router and session persist control
│       ├── index.css    # Typography, global CSS variables, resets, and keyframes
│       └── components/  # Page components and stylesheets
│           ├── Navbar.jsx / Navbar.css
│           ├── Hero.jsx / Hero.css
│           ├── Features.jsx / Features.css
│           ├── Benefits.jsx / Benefits.css
│           ├── Pricing.jsx / Pricing.css
│           ├── Testimonials.jsx / Testimonials.css
│           ├── Faq.jsx / Faq.css
│           ├── LeadForm.jsx / LeadForm.css
│           └── Footer.jsx / Footer.css
└── server/              # Express backend
    ├── package.json
    ├── index.js         # REST endpoints, authentication and status controller
    ├── db.js            # SQLite database initialization & seeding
    ├── test-db.js       # Script to verify SQLite CRUD execution
    └── data/
        └── submissions.db # Generated SQLite database file
```

---

## 💾 Default Credentials

For convenience and direct verification, the system database is auto-seeded with the following default accounts:

- **Client Portal**:
  - **Username**: `client`
  - **Password**: `client123`
- **Operator Dashboard (Admin)**:
  - **Username**: `admin`
  - **Password**: `admin123`

---

## 🚀 Setup and Run Instructions

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your system.

### 1. Install Dependencies
Run the command below in the project root folder to install client and server packages:
```bash
npm run install-all
```

### 2. Run Database Diagnostics
To verify SQLite initialization and CRUD operations:
```bash
node server/test-db.js
```

### 3. Run Development Servers
Start both the React Vite dev server (port 5173) and the Express backend (port 5000) concurrently:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the portal. 

### 4. Build and Run Production Server
Compile the React frontend bundle and host it via the unified Express production backend:
```bash
# Build React client
npm run build

# Start server in production mode
npm start
```
Open [http://localhost:5000](http://localhost:5000) to access the production site.

---

## 🌐 Deployment Guidelines

This project includes a render.yaml blueprint file for easy deployment on Render.

1. Connect your fork of the repository to Render.
2. Render will automatically detect the blueprint file to create a Web Service named aatheria.
3. Set the environment variable PORT to specify the server port (defaults to 5000).
4. Note on SQLite Persistence: Since SQLite writes database records locally, any redeployment or restart will reset the data. For production persistence, map a Persistent Volume Mount to /server/data.

