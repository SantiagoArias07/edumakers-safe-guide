# SafeGuide

Confidential AI guidance, a verified resource map, and a specialist assistant for people navigating human rights, gender-based violence, and access to justice in Mexico — built for EduMakers × Tec de Monterrey.

**Live site → [safeguide-two.vercel.app](https://safeguide-two.vercel.app)**

---

## Preview

> Screenshots — Landing · Chat · Resource Map

---

## The Project

**EduMakers** is a student-led initiative at Tecnológico de Monterrey that designs accessible educational materials and tools for people with disabilities. During *Semana Tec con Sentido Humano* — a week of applied social impact projects — EduMakers presented a concrete problem: in Mexico, people facing systemic barriers (disability, gender-based violence, social exclusion) often have no reliable, single place to find orientation on their rights, access legal support, or locate nearby services. They know help exists — they just don't know where to look.

SafeGuide was built as a direct response to that need: a platform that centralizes confidential guidance, verified resource data, and a trained AI assistant in one accessible, no-registration-required interface. It started as a prototype for *Semana Dignidad Humana* and grew into a fully deployed product.

The result was an end-to-end full-stack application — FastAPI backend on Railway, React frontend on Vercel, PostgreSQL database, multi-provider AI — built from scratch with no templates. EduMakers plans to continue using and expanding it.

---

## What it does

**AI assistant (SafeGuide)**
Trained specifically for human rights, gender-based violence, and dignity-related guidance in Mexico. Validates emotionally before providing information. Detects emergency situations and surfaces a crisis banner with hotline numbers. Aware of the Ley General de Víctimas, CAVI, public defenders, and state-level processes. Works fully anonymous — no account required.

**Interactive resource map**
200+ verified resources across Mexico: shelters, legal aid, psychological support, reporting centers, and health services. Premium Carto tiles (light/dark responsive). Animated filter pills with Framer Motion layout transitions. Floating glassmorphism panel on resource selection. City search with smooth flyTo.

**Chat experience**
Three-panel layout: session history · main chat · contextual emergency panel. Conversation history grouped by date. Suggested prompts on empty state. Blur-reveal message animation. Grouped sessions saved to PostgreSQL per user. Auto-save preference configurable.

**Landing page**
Hero with live-animated chat preview and a 3D tilt effect driven by mouse tracking (`useMotionValue + useSpring`). Alternating editorial light/dark sections. AI showcase and SVG map preview with resource card overlay. Privacy section with bold typographic statement. Emotional final CTA with emergency strip.

**Accessibility**
Skip navigation link. Full semantic landmarks. `aria-pressed` on filter buttons. `role="alert"` on emergency banners. `role="switch" + aria-checked` on toggles. `prefers-reduced-motion` suppresses all CSS animations. Configurable font size (normal / large). Every icon-only button has `aria-label`.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend framework | React 18 + Vite | Fast HMR, ESM-native |
| Styling | TailwindCSS 3 | Utility-first, dark mode via class strategy |
| Animation | Framer Motion | Spring physics, layout animations, `AnimatePresence` |
| Server state | TanStack Query v5 | Caching, optimistic updates, no Redux |
| Routing | React Router v6 | Declarative, nested routes |
| Maps | React-Leaflet + Carto tiles | Lightweight, premium tile aesthetics |
| Icons | Lucide React | Consistent, tree-shakable |
| Testing | Vitest + React Testing Library | Fast, co-located with Vite |
| Backend | FastAPI (Python 3.11+) | Async, typed, auto-docs |
| Database | PostgreSQL via Railway | Managed, auto-injected `DATABASE_URL` |
| ORM | SQLAlchemy 2 | Works with SQLite locally, PostgreSQL in prod |
| Auth | JWT (python-jose) + bcrypt | Stateless, 7-day tokens |
| AI — local | Ollama + llama3 | Zero cost, full privacy in development |
| AI — production | Groq (`llama-3.1-8b-instant`) | ~200ms latency, generous free tier |
| Deploy frontend | Vercel | Edge CDN, automatic from `main` |
| Deploy backend | Railway | Auto-detect Python, managed Postgres |

---

## Design System

All brand tokens are defined in `tailwind.config.js` and referenced consistently across every component.

| Token | Value | Role |
|-------|-------|------|
| `purple-soft` | `#7C5CBF` | Primary brand — buttons, active states, AI identity |
| `purple-dark` | `#5A3F9B` | Hover state for primary |
| `purple-light` | `#9B7FD4` | Light-on-dark contexts |
| `coral` | `#E8705A` | Warm CTA accent — links, secondary actions |
| `cream` | `#F5F0EB` | Body text on dark backgrounds |
| `bg-dark` | `#0A0A14` | Deep dark page background |
| `ink` | `#07070F` | Section dark backgrounds (landing alternating) |

Typography is set in two families: **Plus Jakarta Sans** (display headlines, `font-extrabold`, `tracking-tighter`) and **Inter** (body, UI). Both self-hosted via Google Fonts with `display=swap`.

Motion uses a consistent spring system: `stiffness: 420, damping: 38` for panels; `stiffness: 320, damping: 28` for the 3D tilt effect. Section reveals use `whileInView` with 0.1s stagger between children.

---

## Architecture

```
dignidad/
├── backend/
│   ├── data/
│   │   └── resources.json          # 200+ verified resources
│   ├── routes/
│   │   ├── auth.py                 # register, login, /me, update
│   │   ├── chat.py                 # AI message endpoint + session CRUD
│   │   └── resources.py            # resource directory with city/type filters
│   ├── services/
│   │   ├── auth_service.py         # JWT creation/decoding, bcrypt
│   │   └── claude_service.py       # multi-provider AI (Ollama / Groq / OpenRouter)
│   ├── database.py                 # SQLAlchemy models — User, Conversation
│   ├── main.py                     # FastAPI app + CORS middleware
│   ├── seed_demo.py                # creates demo user with 4 sample conversations
│   ├── .env.example
│   ├── Procfile                    # Railway: uvicorn main:app --host 0.0.0.0 --port $PORT
│   └── requirements.txt
└── frontend/
    ├── public/
    │   └── shield.svg              # favicon — purple shield matching navbar
    ├── src/
    │   ├── api/
    │   │   ├── client.js           # axios instance, JWT interceptor, VITE_API_URL
    │   │   ├── keys.js             # centralized TanStack Query key factory
    │   │   ├── auth.js             # typed auth API functions
    │   │   ├── chat.js             # typed chat API functions
    │   │   └── resources.js        # typed resources API function
    │   ├── components/
    │   │   ├── chat/
    │   │   │   ├── ChatWindow.jsx          # main chat area, input, prompts
    │   │   │   ├── ChatSidebar.jsx         # session list grouped by date
    │   │   │   ├── ChatContextPanel.jsx    # emergency numbers + quick starters
    │   │   │   ├── ChatMessage.jsx         # bubble with blur-reveal animation
    │   │   │   └── EmergencyBanner.jsx     # crisis alert with hotlines
    │   │   ├── landing/
    │   │   │   ├── Hero.jsx                # 3D tilt chat preview + CTAs
    │   │   │   ├── StatsBand.jsx           # dark numbers band
    │   │   │   ├── HowItWorks.jsx          # three-step editorial section
    │   │   │   ├── FeatureShowcase.jsx     # AI convo + SVG map preview
    │   │   │   ├── PrivacySection.jsx      # typographic dark privacy statement
    │   │   │   └── FinalCTA.jsx            # emotional close + emergency strip
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx              # desktop nav, theme toggle, user avatar
    │   │   │   ├── BottomNav.jsx           # mobile bottom tab bar
    │   │   │   └── Footer.jsx              # links + emergency numbers
    │   │   ├── map/
    │   │   │   ├── ResourceMap.jsx         # Leaflet with Carto tiles + CircleMarker
    │   │   │   ├── ResourceFilters.jsx     # animated pill filters with layoutId
    │   │   │   └── ResourcePanel.jsx       # floating glassmorphism detail panel
    │   │   ├── profile/
    │   │   │   ├── AuthModal.jsx           # tabbed login/register with ARIA
    │   │   │   └── ConversationHistory.jsx # session list with expand/delete
    │   │   ├── router/
    │   │   │   └── ProtectedRoute.jsx      # redirect to /perfil if not authed
    │   │   └── ui/
    │   │       ├── TiltCard.jsx            # 3D mouse-tracking card with spring physics
    │   │       ├── Skeleton.jsx            # loading placeholder components
    │   │       ├── ErrorBoundary.jsx       # React error boundary with retry
    │   │       └── EmptyState.jsx          # empty state with icon + CTA
    │   ├── context/
    │   │   ├── AuthContext.jsx    # useQuery for session, useMutation for auth
    │   │   └── ThemeContext.jsx   # dark/light toggle, persisted to localStorage
    │   ├── hooks/
    │   │   └── useChat.js         # useMutation for AI messages, local message state
    │   ├── pages/
    │   │   ├── Landing.jsx        # composes all landing sections
    │   │   ├── Chat.jsx           # 3-panel layout manager, session logic
    │   │   ├── MapPage.jsx        # full-viewport map with floating UI
    │   │   ├── Profile.jsx        # auth, preferences, trusted contacts, history
    │   │   └── AcercaDe.jsx       # about, partners, contact, events calendar
    │   └── tests/
    │       ├── components/        # ResourceFilters, AuthModal
    │       ├── hooks/             # useChat
    │       └── pages/             # ProtectedRoute
    ├── vercel.json                # SPA rewrite rule
    └── vite.config.js             # dev proxy + Vitest config
```

---

## Running locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- [Ollama](https://ollama.com) for local AI

### Install

```bash
git clone https://github.com/SantiagoArias07/safeguide
cd safeguide

# Backend
cd backend
cp .env.example .env
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### Start

```bash
# Terminal 1 — local AI model
ollama serve
ollama pull llama3        # first time only

# Terminal 2 — full app
cd frontend
npm run dev               # starts backend :8000 and frontend :5173 concurrently
```

Open [http://localhost:5173](http://localhost:5173)

### Seed demo data

```bash
cd backend
python seed_demo.py
# → creates user "Santiago" with 4 sample conversations

# point to Railway instead of local SQLite:
DATABASE_URL=postgresql://user:pass@host:port/db python seed_demo.py
```

Demo credentials: `santiago@safeguide.demo` / `SafeGuide2026`

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./safeguide.db` | SQLite locally · PostgreSQL in production |
| `SECRET_KEY` | _(insecure)_ | JWT signing key — generate with `openssl rand -hex 32` |
| `AI_PROVIDER` | `ollama` | `ollama` · `groq` · `openrouter` |
| `OLLAMA_MODEL` | `llama3` | Model name for Ollama |
| `GROQ_API_KEY` | — | From [console.groq.com](https://console.groq.com) — required when `AI_PROVIDER=groq` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | |
| `OPENROUTER_API_KEY` | — | From [openrouter.ai](https://openrouter.ai) — required when `AI_PROVIDER=openrouter` |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Production backend URL (e.g. `https://your-backend.railway.app`). Omit locally — Vite proxy handles `/api → :8000`. |

---

## Deployment

### Frontend → Vercel

```
Framework:       Vite
Root Directory:  frontend
Build Command:   npm run build
Output:          dist
```

Set `VITE_API_URL` in Vercel environment variables to your Railway backend URL.
The included `vercel.json` handles SPA client-side routing automatically.

### Backend → Railway

```
Root Directory:  backend
Start Command:   uvicorn main:app --host 0.0.0.0 --port $PORT
```

Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically.
Required variables: `SECRET_KEY`, `AI_PROVIDER`, `GROQ_API_KEY`, `GROQ_MODEL`, `CORS_ORIGINS`.

---

## Testing

```bash
cd frontend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

**23 tests** across four suites:

| Suite | What it covers |
|-------|---------------|
| `ResourceFilters` | `aria-pressed` state, deselection, `onChange` callbacks |
| `AuthModal` | Tab switching, form validation, login flow, error display, accessibility labels |
| `useChat` | Message state, emergency detection, error handling, `clearChat` |
| `ProtectedRoute` | Authenticated render, unauthenticated redirect, loading state |

---

## Engineering decisions

**TanStack Query v5** — Replaced `useEffect + setState` chains that accumulated stale-data edge cases. Centralized query keys in `src/api/keys.js` make every cache invalidation explicit. Session deletion uses optimistic updates — the sidebar reflects the change before the API confirms.

**Multi-provider AI** — The `/chat/message` endpoint behaves identically regardless of which AI provider is active. `AI_PROVIDER` in the environment controls the switch between Ollama (local, zero cost), Groq (production, ~200ms), and OpenRouter (free model access). Same codebase, three deployment contexts.

**3D tilt effect** — `useMotionValue + useSpring` tracks mouse position within the card container, applying `rotateX`/`rotateY` up to ±12°. `useMotionTemplate` generates a radial glow that follows the cursor dynamically. Spring config: `stiffness: 320, damping: 28`. Gracefully degrades to no effect on touch devices.

**Accessibility as product requirement** — SafeGuide serves people in vulnerable situations. Skip link as the first focusable element. `role="alert"` on the emergency banner ensures screen readers announce it immediately. `prefers-reduced-motion` is implemented in CSS (not just JS) so it applies to transitions set in `@apply` blocks too. Every form field has a visually-associated `<label>` with correct `autoComplete` attributes.

**SQLite → PostgreSQL** — Same `database.py` code works with both. `connect_args={"check_same_thread": False}` is only applied when the dialect is SQLite. Zero code changes between environments.

---

## About EduMakers

**EduMakers** is a student-led initiative at Tecnológico de Monterrey focused on designing and prototyping accessible learning materials and tools for people with disabilities across all educational levels. Their work addresses a concrete gap in the Mexican education system: materials, evaluation processes, and institutional support are rarely designed with disability in mind, leaving many students behind before they have the chance to begin.

SafeGuide was developed in partnership with EduMakers as part of *Semana Tec con Sentido Humano*, aligned with UN Sustainable Development Goal 10 — Reduced Inequalities.

[edumakerstec@gmail.com](mailto:edumakerstec@gmail.com)

---

## License

MIT — see LICENSE for details.
