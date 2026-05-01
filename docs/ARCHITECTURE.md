# System Architecture

MirrorMint is built using a modern, decoupled monorepo architecture.

## Tech Stack
- **Backend:** FastAPI (Hosted on **Railway**)
- **Frontend:** Next.js 16 (Hosted on **Netlify**)
- **Database:** PostgreSQL (Hosted on **Neon Cloud**)
- **Styling:** Tailwind CSS 4

## Folder Structure
```text
MirrorMint/
├── backend/            # FastAPI Application
│   ├── app/            # Core logic, models, schemas
│   └── main.py         # Entry point
├── frontend/           # Next.js Application
│   ├── src/app         # App Router pages
│   └── src/components  # Reusable UI components
├── docs/               # Detailed documentation
└── README.md           # Quickstart & Overview
```

## Data Flow
1. **Frontend** captures user input and sends signed JWT requests to the API.
2. **Backend** validates requests using Pydantic and enforces RBAC.
3. **Database** (PostgreSQL) persists users and strategies with foreign key integrity.
