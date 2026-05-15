# SafeGuide MX

**Plataforma de orientación confidencial, recursos verificados y guía especializada con IA para personas que viven situaciones de violencia o injusticia en México.**

SafeGuide MX ofrece un espacio seguro donde cualquier persona puede interactuar con un asistente de IA entrenado en derechos humanos, encontrar recursos de apoyo en un mapa interactivo, y recibir orientación práctica — sin registro requerido, sin costo, disponible ahora.

> Proyecto de impacto social · Semana Dignidad 2026 · Tecnológico de Monterrey × Edumakers MX

---

## Demo en vivo

| | |
|---|---|
| **Frontend** | [safeguide-two.vercel.app](https://safeguide-two.vercel.app) |
| **Backend API** | [edumakers-safe-guide-production.up.railway.app/health](https://edumakers-safe-guide-production.up.railway.app/health) |

**Cuenta demo:**
```
Email:    santiago@safeguide.demo
Password: SafeGuide2026
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | TailwindCSS 3 |
| Animaciones | Framer Motion |
| Estado del servidor | TanStack Query v5 |
| Routing | React Router v6 |
| Mapas | React-Leaflet + Carto tiles |
| Iconos | Lucide React |
| Testing | Vitest + React Testing Library |
| Backend | FastAPI (Python 3.11+) |
| Base de datos | PostgreSQL (Railway) |
| ORM | SQLAlchemy 2 |
| Auth | JWT + bcrypt |
| IA local | Ollama + llama3 |
| IA en producción | Groq / OpenRouter |
| Deploy frontend | Vercel |
| Deploy backend | Railway |

---

## Características

### Asistente IA especializado
- Entrenado para orientación en violencia de género y derechos humanos en México
- Validación emocional antes de dar información — nunca minimiza la situación
- Detección automática de emergencias con banner prominente
- Conocimiento de la Ley General de Víctimas, CAVI, fiscalías y defensores públicos
- Funciona sin cuenta — modo anónimo completo
- Multi-proveedor: Ollama (local), Groq o OpenRouter según entorno

### Mapa interactivo de recursos
- 200+ recursos verificados en todo México
- Tiles Carto premium (light/dark responsive al tema)
- Filtros animados con layout animation de Framer Motion
- Panel flotante glassmorphism con detalle al seleccionar recurso
- Búsqueda por ciudad con flyTo animado

### Experiencia de chat
- Layout de 3 paneles: historial · chat · panel contextual de emergencia
- Historial agrupado por fecha (Hoy / Ayer / Esta semana)
- Prompts sugeridos scrollables en estado vacío
- Blur-reveal animation en cada mensaje entrante
- Typing dots animados (no spinner)
- Autoguardado configurable de sesiones

### Landing page
- Hero con chat preview animado + efecto 3D tilt con tracking del mouse (`useMotionValue` + `useSpring`)
- Secciones alternadas light/dark con ritmo visual editorial
- Showcase de conversación real y mapa vectorial SVG
- Motion system coherente: `whileInView`, stagger, spring transitions

### Accesibilidad
- Skip navigation link, landmarks semánticos completos
- `aria-pressed` en filtros, `aria-current` en nav, `role="alert"` en emergencias
- `prefers-reduced-motion` suprime todas las animaciones CSS
- Focus rings `focus-visible` en toda la app
- Tamaño de fuente configurable (normal / grande), persistido

---

## Setup local

### Prerequisitos
- Node.js 18+, Python 3.11+, [Ollama](https://ollama.com)

### Instalar

```bash
git clone https://github.com/tu-usuario/safeguide-mx
cd safeguide-mx

# Backend
cd backend
cp .env.example .env
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### Arrancar

```bash
# Terminal 1 — IA local
ollama serve
ollama pull llama3     # solo la primera vez

# Terminal 2 — App completa
cd frontend
npm run dev            # levanta backend (8000) y frontend (5173)
```

### Datos demo

```bash
cd backend
python seed_demo.py
# Crea usuario Santiago con 4 conversaciones de muestra

# Para apuntar a Railway:
DATABASE_URL=postgresql://user:pass@host:port/db python seed_demo.py
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./safeguide.db` | SQLite (local) · PostgreSQL (prod) |
| `SECRET_KEY` | _(inseguro)_ | Genera con `openssl rand -hex 32` |
| `AI_PROVIDER` | `ollama` | `ollama` · `groq` · `openrouter` |
| `GROQ_API_KEY` | — | Desde [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | |
| `OPENROUTER_API_KEY` | — | Desde [openrouter.ai](https://openrouter.ai) |
| `CORS_ORIGINS` | `http://localhost:5173` | URL(s) del frontend, separadas por coma |

### Frontend (`frontend/.env.local`)

```
VITE_API_URL=https://tu-backend.railway.app
```

Sin esta variable en producción, usa el proxy de Vite en desarrollo (`/api`).

---

## Testing

```bash
cd frontend
npm test                # ejecutar una vez
npm run test:watch      # modo watch
npm run test:coverage   # reporte de cobertura
```

**23 tests** que cubren:

| Suite | Qué verifica |
|-------|-------------|
| `ResourceFilters` | `aria-pressed`, deselección, `onChange` |
| `AuthModal` | Tabs, validación, login, errores, a11y |
| `useChat` | Mensajes, detección emergencia, errores, `clearChat` |
| `ProtectedRoute` | Render autenticado, redirect, estado loading |

---

## Deployment

### Vercel (frontend)

```
Framework:       Vite
Root Directory:  frontend
Build Command:   npm run build
```

Variable en Vercel:
```
VITE_API_URL = https://tu-backend.railway.app
```

### Railway (backend)

```
Root Directory:  backend
Start Command:   uvicorn main:app --host 0.0.0.0 --port $PORT
```

Variables en Railway:
```
DATABASE_URL  = (inyectado automáticamente por el plugin PostgreSQL)
SECRET_KEY    = (openssl rand -hex 32)
AI_PROVIDER   = groq
GROQ_API_KEY  = gsk_...
GROQ_MODEL    = llama-3.1-8b-instant
CORS_ORIGINS  = https://tu-frontend.vercel.app
```

---

## Decisiones de ingeniería

### TanStack Query v5
Reemplazó los patrones `useEffect + useState` que acumulaban boilerplate y tenían edge cases de datos obsoletos. Las query keys centralizadas en `src/api/keys.js` hacen toda la invalidación explícita. La eliminación de conversaciones usa optimistic updates — el sidebar se actualiza antes de que la API confirme.

### Auth con JWT
Token en `localStorage`, validado contra `/auth/me` en cada sesión via `useQuery`. Un interceptor de Axios limpia el token en 401. Login/registro usan `useMutation` con `onSuccess` que puebla el cache directamente — sin fetch redundante post-auth.

### IA multi-proveedor
`/chat/message` funciona igual independientemente del proveedor. `AI_PROVIDER` en env var controla si usa Ollama (local, sin costo), Groq (producción, ~200ms) u OpenRouter (múltiples modelos gratuitos). El system prompt vive en un solo lugar y es compatible con el formato `messages` de los tres.

### Motion system
Efecto 3D tilt con `useMotionValue + useSpring` (spring: stiffness 320, damping 28), ±12° de rotación, `useMotionTemplate` para glow dinámico que sigue el cursor. Secciones de landing con `whileInView + stagger`. Paneles con spring physics (`stiffness: 420, damping: 38`). `AnimatePresence` en ResourcePanel, EmergencyBanner y filtros activos.

### Accesibilidad como requisito del producto
SafeGuide sirve a personas vulnerables — accesibilidad es funcional, no decorativa. Skip link como primer elemento focusable. `aria-pressed` en filtros (toggle buttons). `role="alert"` en emergencias para anuncio inmediato. `prefers-reduced-motion` suprime todas las animaciones en CSS. `role="switch" + aria-checked` en toggles.

### PostgreSQL vs SQLite
SQLite en desarrollo (sin configuración extra). PostgreSQL en producción via Railway. `database.py` detecta el dialecto de `DATABASE_URL` y ajusta `connect_args` automáticamente — mismo código, ambos entornos.

---

## Estructura

```
dignidad/
├── backend/
│   ├── data/resources.json          # recursos verificados
│   ├── routes/                      # auth, chat, resources
│   ├── services/
│   │   ├── auth_service.py          # JWT + bcrypt
│   │   └── claude_service.py        # multi-provider AI
│   ├── database.py                  # SQLAlchemy models
│   ├── main.py                      # FastAPI + CORS
│   ├── seed_demo.py                 # datos de demostración
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/                     # client, keys, auth, chat, resources
    │   ├── components/
    │   │   ├── chat/                # ChatWindow, Sidebar, ContextPanel, EmergencyBanner
    │   │   ├── landing/             # Hero, StatsBand, HowItWorks, FeatureShowcase, PrivacySection, FinalCTA
    │   │   ├── layout/              # Navbar, BottomNav, Footer
    │   │   ├── map/                 # ResourceMap, ResourceFilters, ResourcePanel
    │   │   ├── profile/             # AuthModal, ConversationHistory
    │   │   ├── router/              # ProtectedRoute
    │   │   └── ui/                  # TiltCard, Skeleton, ErrorBoundary, EmptyState
    │   ├── context/                 # AuthContext, ThemeContext
    │   ├── hooks/                   # useChat
    │   ├── pages/                   # Landing, Chat, MapPage, Profile, AcercaDe
    │   └── tests/                   # 23 tests (Vitest + RTL)
    ├── vercel.json
    └── vite.config.js
```

---

## Créditos

- **Tecnológico de Monterrey** — Semana Dignidad 2026
- **Edumakers MX** — [edumakerstec@gmail.com](mailto:edumakerstec@gmail.com)
- Líneas de crisis: LÍNEA VIDA 800 911 2000 · CNDH 800 715 2000 · 911

---

*Construido por **Santiago Arias** — [taek1701@gmail.com](mailto:taek1701@gmail.com)*
