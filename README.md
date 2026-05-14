# SafeGuide MX

**An accessible orientation and resource platform for people navigating gender-based violence and human rights situations in Mexico.**

SafeGuide MX provides a confidential space where users can interact with a specialized AI assistant, find nearby support resources on an interactive map, and access practical guidance — all without mandatory registration.

> Built as a Semana de la Dignidad project at Tecnológico de Monterrey.

---

## Live Demo

> _Deploy links go here once hosted on Vercel (frontend) and Railway (backend)_

---

## Screenshots

| Landing | Chat | Resource Map |
|---------|------|--------------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| State / Data fetching | TanStack Query v5 |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Maps | Leaflet + react-leaflet |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |
| Backend | FastAPI (Python 3.11+) |
| Auth | JWT (python-jose) + bcrypt |
| Database | SQLite (dev) → PostgreSQL (prod) |
| AI — local | Ollama + llama3 |
| AI — hosted | Groq / OpenRouter (configurable) |

---

## Features

- **Confidential AI chat** — Specialized assistant (SafeGuide) trained to validate emotions, detect emergencies, and provide practical orientation on legal, psychological, and shelter resources
- **Emergency detection** — Automatic detection of immediate danger phrases; triggers prominent safety banner with hotline links
- **Interactive resource map** — Leaflet map of verified support organizations across Mexico, filterable by type (refugio, legal, psicológico, denuncia, salud)
- **Session management** — Save, load, and delete conversation history (authenticated users)
- **Anonymous mode** — Chat and map work without creating an account
- **Accessibility-first** — Skip navigation, semantic HTML landmarks, ARIA labels, keyboard navigation, `prefers-reduced-motion` support, font-size toggle
- **Dark mode** — Full dark theme, persisted to localStorage
- **Multi-provider AI** — Switch between Ollama (local), Groq, or OpenRouter via environment variable

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- [Ollama](https://ollama.com) (for local AI)

### 1. Clone and install

```bash
git clone https://github.com/your-username/safeguide-mx
cd safeguide-mx
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # edit as needed
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. Start Ollama (local AI)

```bash
ollama serve                  # terminal 1
ollama pull llama3            # first time only
```

### 5. Run everything

```bash
cd frontend
npm run dev                   # starts both backend (port 8000) and frontend (port 5173)
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./safeguide.db` | SQLite or PostgreSQL connection string |
| `SECRET_KEY` | _(insecure default)_ | JWT signing key — **change in production** |
| `AI_PROVIDER` | `ollama` | `ollama` \| `groq` \| `openrouter` |
| `OLLAMA_MODEL` | `llama3` | Model name for Ollama |
| `GROQ_API_KEY` | — | Required when `AI_PROVIDER=groq` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Groq model name |
| `OPENROUTER_API_KEY` | — | Required when `AI_PROVIDER=openrouter` |
| `OPENROUTER_MODEL` | `meta-llama/llama-3.1-8b-instruct:free` | OpenRouter model |
| `CORS_ORIGINS` | `http://localhost:5173,...` | Comma-separated allowed origins |
| `APP_URL` | `http://localhost:5173` | Frontend URL (used by OpenRouter referer) |

### Frontend (`frontend/.env.local`)

```
VITE_API_URL=/api   # proxied locally, set to your Railway URL in production
```

---

## Testing

```bash
cd frontend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

Tests cover:
- `ResourceFilters` — filter button state, ARIA `aria-pressed`, keyboard interaction, deselect behavior
- `AuthModal` — tab switching, form validation, login/error flows, accessibility labels
- `useChat` hook — message state, emergency detection, error handling, clearChat
- `ProtectedRoute` — authenticated render, unauthenticated redirect, loading state

---

## Deployment

### Frontend → Vercel

1. Push to GitHub, import project in Vercel
2. Set **Framework Preset** to `Vite`
3. Set **Root Directory** to `frontend`
4. Add env var: `VITE_API_URL=https://your-railway-backend.up.railway.app`
5. The included `vercel.json` handles SPA client-side routing

### Backend → Railway

1. Create a new Railway project, add a **Python** service pointing to `backend/`
2. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
3. Set all required env vars (see table above), especially:
   - `AI_PROVIDER=groq` (or `openrouter`)
   - `GROQ_API_KEY` / `OPENROUTER_API_KEY`
   - `SECRET_KEY` (generate with `openssl rand -hex 32`)
   - `CORS_ORIGINS=https://your-frontend.vercel.app`
4. Railway uses the included `Procfile` for the start command

---

## Engineering Decisions

### Why TanStack Query?

The app has several async data domains that needed proper caching, loading states, and invalidation: auth session, chat sessions, and resource data. `useEffect` + `useState` patterns were accumulating boilerplate and had stale-data edge cases (e.g., sidebar not reflecting a freshly saved session).

TanStack Query provides:
- **Automatic caching** — resource data never re-fetches unless stale; chat sessions refetch only on invalidation
- **Optimistic updates** — session delete is reflected instantly in the sidebar before the API confirms
- **Centralized query keys** — a single `keys.js` file makes cache invalidation explicit and traceable
- **Loading/error states** as first-class citizens — no manual `setLoading(true/false)` in every handler

### Auth Architecture

JWT tokens are stored in `localStorage` with a 7-day expiry. On startup, `AuthContext` runs a `useQuery` for `/auth/me` (only if a token exists), so the token is validated server-side on every session. A 401 response clears the token via an Axios interceptor and marks the auth query as failed.

Login/register use `useMutation` with `onSuccess` populating the query cache directly — no redundant `/me` fetch after auth.

### AI Integration Approach

The backend exposes a single `/chat/message` endpoint regardless of which AI provider is active. Provider selection (`ollama`, `groq`, `openrouter`) is controlled via the `AI_PROVIDER` environment variable, with no frontend changes needed. This allows the project to run locally with Ollama (zero cost, full privacy) and be deployed publicly with Groq or OpenRouter without touching any application code.

The system prompt is kept in one place (`claude_service.py`) and is provider-agnostic — it uses the standard `messages` format compatible with all three providers.

### Accessibility Considerations

This platform serves people in potentially vulnerable situations. Accessibility is not an afterthought:

- **Skip navigation link** — first focusable element sends keyboard users directly to main content, bypassing the navbar
- **Semantic landmarks** — `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` are used correctly throughout
- **ARIA labels** — all icon-only buttons have `aria-label`; filter buttons use `aria-pressed`; tabs use `role="tab"` + `aria-selected`
- **`prefers-reduced-motion`** — all CSS transitions and animations are suppressed for users who request it
- **Focus management** — `focus-visible` rings are always present; mobile menu closes on outside click or route change
- **Font size toggle** — users can switch to larger text (18px base) via preferences; persisted across sessions
- **Emergency banner** — uses `role="alert"` so screen readers announce it immediately when triggered

### Deployment Tradeoffs

| Option | Pros | Cons |
|--------|------|------|
| Ollama (local only) | Full privacy, zero API cost | Can't deploy publicly |
| Groq | Fast, generous free tier | Data leaves device |
| OpenRouter | Access to many models, free tier available | Adds a dependency |

The chosen approach (env-var switchable) means the same codebase works in all three scenarios. Local development uses Ollama by default; production deployment uses Groq or OpenRouter.

SQLite is kept for local development because it requires no setup. PostgreSQL is used in production via Railway's managed database. The `database.py` change (`connect_args` only applied for SQLite) ensures the same code works with both engines.

### State Management Strategy

The app uses three layers deliberately:

| Layer | Tool | What goes here |
|-------|------|----------------|
| Server state | TanStack Query | Auth session, chat sessions, resources |
| UI/local state | React `useState` | Form inputs, sidebar open, current session ID |
| Preferences | `localStorage` | Theme, font size, auto-save, map city |

There is no global client state manager (Redux, Zustand, etc.) — the problem doesn't warrant it. TanStack Query handles everything async; `useState` handles everything ephemeral.

---

## Project Structure

```
dignidad/
├── backend/
│   ├── data/              # resources.json
│   ├── models/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   └── resources.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── claude_service.py  # multi-provider AI
│   ├── database.py
│   ├── main.py
│   ├── .env.example
│   ├── Procfile             # Railway deploy
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/             # axios client, query keys, typed API fns
    │   ├── components/
    │   │   ├── chat/
    │   │   ├── landing/
    │   │   ├── layout/
    │   │   ├── map/
    │   │   ├── profile/
    │   │   ├── router/      # ProtectedRoute
    │   │   └── ui/          # Skeleton, ErrorBoundary, EmptyState
    │   ├── context/         # AuthContext (TanStack Query), ThemeContext
    │   ├── hooks/           # useChat (useMutation)
    │   ├── pages/
    │   └── tests/           # Vitest + RTL
    ├── vercel.json          # SPA routing
    └── vite.config.js       # includes Vitest config
```

---

## Acknowledgements

- Tecnológico de Monterrey — Semana de la Dignidad
- Edumakers MX
- Emergency numbers: LÍNEA VIDA 800 911 2000 · CNDH 800 715 2000 · 911

---

_Built with care by Santiago Arias · [taek1701@gmail.com](mailto:taek1701@gmail.com)_
