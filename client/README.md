# Cresta Client (React + Vite)

Monochrome (black/white) high‑contrast ride & rental booking SPA for Cresta. Built with React, Vite, Tailwind, and a lightweight internal design system.

## Quick Start

```bash
pnpm install # or npm install / yarn
pnpm dev     # starts Vite dev server
```

Env variables (example):
```
VITE_API_BASE=http://localhost:5000/api
```

## Core Features

- Unified monochrome theme (Uber/Ola inspired) with custom tokens in `theme-mono.css`.
- Auth context + Axios interceptor (401 => toast + redirect preservation).
- Ride booking, car rental flows, cancellation, dashboard & history pages.
- Rebook flow: Book Again from history pre-fills new booking/rental forms.
- Lightweight toast system (`toastBus.js` + `ToastProvider.jsx`).
- Skeleton loading components for perceived performance.

## Design System Components

Location: `src/components/ui/`

| Component | Purpose |
|-----------|---------|
| `FormInput` | Standardized labeled input + styling |
| `StatCard` | Simple metric display with value + label |
| `StatusBadge` | Status pill with semantic color mapping |
| `Tabs` | Segmented navigation for filtering lists |
| `SectionHeader` | Consistent section titles + meta |
| `EmptyState` | Empty list placeholder with optional action |
| `Skeleton` / `SkeletonText` | Loading placeholder visuals |

Utility classes (cards, buttons, badges, shadows) defined in `theme-mono.css`.

## Rebook Flow

1. User visits `RideHistory` or `RentalHistory`.
2. Clicking Book Again triggers `navigate(path, { state: { rebook: true, ...prefill } })`.
3. Destination page (`RideBooking` or `CarRental`) inspects `location.state` on mount:
	 - If `rebook` is true, form fields are pre-populated (locations, dates, times, car(s)).
	 - Car selection section auto-opens if origin/destination (rides) or dates (rentals) exist.
4. A toast appears: “Details prefilled from previous ride/rental”.
5. User can adjust any field before confirming.

Ride rebook state fields:
```
{
	rebook: true,
	pickupLocation,
	dropoffLocation,
	pickupDate,      # YYYY-MM-DD
	pickupTime,      # HH:MM (24h)
	selectedCar      # optional car id
}
```

Rental rebook state fields:
```
{
	rebook: true,
	pickupAddress,
	startDate,       # YYYY-MM-DD
	endDate,         # YYYY-MM-DD
	carIds: ["carId1", "carId2", ...]
}
```

Prefill is resilient: missing or stale fields are ignored gracefully.

## Toast Usage

Publish from anywhere:
```js
import { toast } from '../services/toastBus'
toast.success('Saved profile')
toast.error('Failed to load data')
```
`ToastProvider` (mounted high in the app) renders transient clickable toasts.

## Key Pages

- `DashboardPage`: User metrics overview.
- `RideBooking`: New ride workflow + car selection.
- `CarRental`: Multi-day rental with cart-style car aggregation.
- `RideHistory` / `RentalHistory`: Tabbed history lists with cancel + rebook.
- `ProfilePage`: User info + stats editing shell.

## Service Layer

`src/services/bookingService.js` centralizes API calls (rides, rentals, cars, stats, cancellation). Axios instance handles auth token + 401 auto-logout redirect.

## Backend Endpoint Reference (Client Consumption)

| Purpose | Method & Path |
|---------|---------------|
| Get user dashboard summary | `GET /api/dashboard` |
| Get user stats | `GET /api/users/:id/stats` |
| List user rides | `GET /api/ride/user/:id` (example; adjust if different) |
| List user rentals | `GET /api/rental/user/:id` (example; adjust if different) |
| Create ride | `POST /api/ride` |
| Create rental | `POST /api/rental` |
| Cancel ride | `POST /api/rides/:id/cancel` |
| Cancel rental | `POST /api/rentals/:id/cancel` |
| List cars | `GET /api/cars` |

Adjust any differing actual route names to match server implementation.

## Theming

Global tokens (colors, spacing, radii, shadows, skeleton shimmer) in `theme-mono.css` unify styling. Prefer utility classes + DS components over ad hoc styles.

## Adding New UI Elements

1. Determine if an existing DS component covers the need.
2. If creating a new pattern, place it under `components/ui/` with minimal props.
3. Ensure dark-on-light contrast remains WCAG AA (>= 4.5:1 for text under 18px).
4. Use `Skeleton` for loading states over spinners where layout is known.

## Future Enhancements (Ideas)

- Multi-car ride pooling UI.
- Persisted recent locations autosuggest.
- Price estimation breakdown panel.
- Pagination or infinite scrolling for large histories.

## License

Internal project; add license details here if distributing externally.

