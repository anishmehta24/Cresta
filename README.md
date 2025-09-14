# Cresta Mobility Platform

Unified ride booking and car rental application with a monochrome, high‑contrast UI, real data integration, and extensible service architecture.

## Features
- On‑demand ride booking & multi‑day car rentals
- Monochrome design system (high contrast, Sora font)
- Auth flow with protected routes and token handling
- INR currency formatting across all monetary values
- Rebook flow (Book Again from history → prefilled booking forms)
- Recent locations memory (localStorage aided suggestions)
- Toast notification system (no native alerts)
- Dashboard metrics & histories (rides, rentals)
- Payments history (user payments list)
- Responsive, accessible Tailwind-based components

## Tech Stack
- Frontend: React 19 + Vite 7, React Router, Tailwind CSS 4
- Backend: Node.js (Express 5), Mongoose (MongoDB)
- Auth: JWT (middleware protected routes)
- Validation: express-validator
- Tooling: ESLint 9, Nodemon (dev), Intl f.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  font-weight: 600;
  border: 1px solid var(--mono-border);
  padding: .85rem 1.35rem;
  border-radius: .75rem;
  background: var(--mono-bg-2);
  color: var(--mono-text-high);
  transition: .18s background, .18s border-color, .18s color;
}

.btn:hover {
  background: var(--mono-bg-3);
  border-color: var(--mono-border-light);
  color: var(--mono-text-high); /* keep dark text on hover */
}

/* Primary - Dark Background */
.btn-primary {
  background: var(--mono-text-high);
  color: #fff !important; /* enforce light text */
  border-color: #fff;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  transition: background .18s, border-color .18s, box-shadow .18s, color .18s;
}

.btn-primary:hover {
  background: #000; /* darker background on hover */
  border-color: #333;
  color: #fff !important; /* always light text */
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
}

/* Accessibility for disabled */
button, .btn, [role="button"], .nav-link, a.btn, input[type=submit], input[type=button] {
  cursor: pointer;
}

button:disabled,
.btn:disabled,
[aria-disabled="true"],
button[disabled] {
  cursor: not-allowed;
  opacity: .55;
}
or currency formatting

## Repository Structure
```
client/        # React SPA (UI, components, context, pages, services)
server/        # Express API (routes, controllers, models, services)
README.md      # (This file)
```

## Prerequisites
- Node.js 18+ (recommended LTS)
- MongoDB instance (local or cloud)
- PowerShell / bash terminal

## Environment Variables
Create `server/.env` with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cresta
JWT_SECRET=replace_with_secure_secret
```
(Optional) Additional vars as features expand (payments, logging, etc.).

## Installation
From repo root:
```powershell
# Install server deps
cd server; npm install; cd ..
# Install client deps
cd client; npm install; cd ..
```

## Development
Run API and client in separate terminals.
```powershell
# Terminal 1 - API
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```
Frontend dev server defaults to: http://localhost:5173
Backend defaults to: http://localhost:5000

Adjust CORS or proxy if deploying separately.

## Build (Client)
```powershell
cd client
npm run build
```
Build output: `client/dist/` (configure static hosting or reverse proxy to serve).

## Production Start (Server)
```powershell
cd server
npm start
```

## Key Frontend Paths
- `src/context/AuthContext.jsx` – auth state & token management
- `src/services/` – API abstraction (rides, rentals, payments, etc.)
- `src/pages/` – primary route views (Landing, Booking, Rentals, History, Payments, Profile)
- `src/components/` – UI primitives (Navbar, Tabs, StatCard, Skeleton, Toasts)
- `src/utils/currency.js` – INR formatter helper

## Key Backend Paths
- `routes/` – Express route definitions
- `controllers/` – HTTP layer logic & response shaping
- `services/` – Business logic (DB queries, validation)
- `models/` – Mongoose schemas (User, Booking, Payment, Car, Driver)
- `middleware/auth.middleware.js` – JWT validation + role guard
- `db/db.js` – Mongo connection bootstrap

## Payments Module
Endpoints (protected):
- `POST /api/payments` – create payment for booking
- `GET /api/payments/:id` – retrieve payment
- `GET /api/payments/user/:userId` – list user payments
- `PUT /api/payments/:id/status` – update status (admin)
UI page: `/payments` shows list with status chips.

## Design System Notes
- Monochrome tokens in `theme-mono.css`
- Reusable components: `StatCard`, `StatusBadge`, `Tabs`, `EmptyState`, `Skeleton`, `FormInput`
- High contrast buttons & pill tabs

## Adding a New Service (Pattern)
1. Create function in `server/services/*.service.js`
2. Expose via controller + route file
3. Consume from `client/src/services/*.js` using shared `apiClient`
4. Integrate into page/component w/ loading + error states + toasts

## Common Scripts
| Area    | Script            | Purpose                    |
|---------|-------------------|----------------------------|
| Client  | `npm run dev`     | Vite dev server            |
| Client  | `npm run build`   | Production bundle          |
| Client  | `npm run preview` | Preview production build   |
| Server  | `npm run dev`     | Nodemon reload API         |
| Server  | `npm start`       | Start API (prod mode)      |

## Testing (Future Roadmap)
- Add Jest + React Testing Library for UI
- Add supertest for API endpoints
- Integrate GitHub Actions for CI

## Roadmap Ideas
- Real payment provider integration (UPI / gateway)
- Driver assignment UI & live tracking
- Push notifications / WebSockets for status updates
- Profile edit persistence endpoint
- Advanced filters & export for histories
- Multi-language + dark/high-contrast accessibility audit

## Contributing
1. Fork & branch: `feat/short-description`
2. Commit using conventional style (optional)
3. Open PR with clear before/after context & screenshots for UI

## License
Proprietary (update if you decide to open-source). Add a LICENSE file if needed.

---
Questions or need enhancements? Open an issue or extend the roadmap section.
