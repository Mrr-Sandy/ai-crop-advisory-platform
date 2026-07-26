# AI Crop Advisory Platform Documentation

## Purpose
This documentation is the single source of truth for product design, frontend implementation, and UI decisions. It keeps the interface consistent while protecting the completed backend.

## Goals
- Explain the design system before implementation.
- Keep frontend changes aligned with real backend data.
- Make onboarding easier for contributors.
- Record decisions so the UI evolves intentionally.

## Folder Structure
```text
docs/
  README.md
  design/
    README.md
    00_DESIGN_VISION.md
    01_BRAND_GUIDELINES.md
    ...
    14_UI_ROADMAP.md
```

## Reading Order
Read `docs/design/00_DESIGN_VISION.md` first, then brand, color, typography, spacing, components, layouts, responsive rules, animation, accessibility, decisions, and roadmap.

## Development Workflow
1. Update the relevant design document.
2. Identify the API, React component, state, and rendered UI elements.
3. Implement the smallest frontend change that preserves backend contracts.
4. Verify API loading, search, CRUD, loading states, and error states.

## Current Implementation
- Home loads crop records through the existing crop API.
- Dashboard is protected by the existing JWT route guard and shows authenticated crop data.
- AI Assistant is protected by the same route guard and uses the existing AI chat endpoint.
- Crop CRUD includes client-side validation, loaders, success/error feedback, empty states, and delete confirmation.
- Shared UI includes Button, Input, Loader, Toast, Modal, EmptyState, and ErrorBoundary patterns.
- Mobile navigation uses a compact menu to avoid small-screen overflow.

## Best Practices
- Reuse the existing `/api/crops` backend contract.
- Bind UI to real data from MongoDB through Express APIs.
- Prefer reusable React components and Tailwind utility patterns.
- Keep documentation current with every meaningful UI decision.

## Examples
- Crop cards use `GET /api/crops`.
- Search uses `GET /api/crops/search?name=value`.
- Create, update, and delete use the existing POST, PUT, and DELETE crop endpoints.
- AI Assistant uses `POST /api/ai/chat`.

## Do
- Document first.
- Keep UI clean, accessible, and responsive.
- Derive dashboard summaries from real crop data.
- Protect authenticated workflows with the existing JWT flow.

## Don't
- Modify backend routes, models, controllers, MongoDB logic, or response shapes.
- Mock API data.
- Add visible fake features for missing backend capabilities.

## Real SaaS References
Vercel for restraint, Stripe for information hierarchy, GitHub for dense workflows, Notion for readable surfaces, and Material Design 3 for accessible component behavior.

## Implementation Notes
The backend is production-ready. Frontend code may improve structure, styling, responsiveness, and accessibility, but must preserve API URLs, request methods, and response handling. Startup API requests should avoid duplicate development-only calls so browser Network debugging remains clear.
