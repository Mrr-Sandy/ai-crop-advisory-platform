# UI Roadmap

## Purpose
Plan UI improvements without faking backend functionality.

## Goals
- Sequence improvements by product value.
- Track hidden components waiting for backend support.
- Keep implementation honest.

## Best Practices
- Ship real API-backed workflows first.
- Keep future UI documented and hidden until data exists.
- Revisit accessibility and responsiveness in every phase.

## Phase 1: Foundation
Design tokens, reusable components, documentation, navigation, loading, error, and empty states.

## Phase 2: Landing Page
Premium public homepage with real crop preview from `GET /api/crops`.

## Phase 3: Dashboard
Completed API-backed dashboard with crop statistics, search, filters, crop cards, create, update, delete, validation, feedback states, and confirmation before delete.

## Phase 4: Authentication
Completed login, register, profile verification, protected Dashboard, protected AI Assistant, logout, and Google OAuth entry point using the existing auth endpoints.

## Phase 5: Analytics
Charts and insights after backend analytics endpoints exist. Until then, only safe derived counts from crop records are visible.

## Phase 6: Future Features
Weather, recommendations, crop images, role-based workflows, export, pagination, and notifications after backend support exists.

## Hidden Components
`WeatherWidget` is a reusable hidden component because the backend does not currently expose weather data. It must remain hidden until a real endpoint exists.

## Examples
- Supported now: authenticated crop CRUD, search, protected AI Assistant, empty states, responsive mobile navigation, and error boundary fallback.
- Not supported now: live weather and analytics charts.

## Do
- Promote hidden components only after API contracts exist.
- Document new contracts before rendering new data.

## Don't
- Hardcode weather, analytics, or recommendation results.
- Create fake JSON.

## Real SaaS References
Linear roadmap sequencing, GitHub issue-driven delivery, Stripe progressive product surfaces.

## Implementation Notes
Before modifying any data component, identify API dependency, consuming component, state store, and rendering elements.
