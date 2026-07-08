# Color System

## Purpose
Define accessible color tokens for light and dark modes.

## Goals
- Provide a professional agriculture-inspired palette.
- Support hierarchy, feedback, and status.
- Avoid one-note green-only screens.

## Best Practices
- Use green as primary, slate as neutral, amber as accent.
- Keep backgrounds quiet and borders subtle.
- Reserve red, amber, and green for status meaning.

## Examples
- Primary: `#166534`
- Secondary: `#0f766e`
- Accent: `#b45309`
- Success: `#15803d`
- Warning: `#b45309`
- Error: `#b91c1c`
- Background: `#f8fafc`
- Surface: `#ffffff`
- Border: `#dfe7df`
- Muted: `#64748b`
- Dark background: `#0f172a`
- Dark surface: `#111827`
- Dark border: `#334155`

## Do
- Use contrast ratios suitable for readable UI.
- Use muted text for secondary metadata.

## Don't
- Use neon greens or heavy gradients.
- Encode meaning with color alone.

## Real SaaS References
Material Design 3 status colors, GitHub borders, Vercel neutral surfaces.

## Implementation Notes
Tailwind utility classes map directly to these tokens. Prefer `bg-slate-50`, `text-slate-900`, `border-slate-200`, and green action states.
