# Spacing System

## Purpose
Define consistent spacing for components and pages.

## Goals
- Create predictable rhythm.
- Improve scanability.
- Keep layouts responsive.

## Best Practices
- Use a 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Use tighter spacing inside controls and larger spacing between sections.
- Keep page gutters responsive.

## Examples
- Button padding: 8px 16px.
- Card padding: 20px or 24px.
- Grid gap: 16px mobile, 24px desktop.
- Section padding: 48px to 80px.

## Do
- Use consistent `gap`, `space-y`, and padding classes.
- Keep forms aligned and compact.

## Don't
- Stack unrelated content without separation.
- Use random pixel values.

## Real SaaS References
Vercel and Linear for structured spacing, Material Design for touch targets.

## Implementation Notes
Tailwind spacing maps to this scale through `p-1`, `p-2`, `p-3`, `p-4`, `p-5`, `p-6`, `p-8`, `p-10`, `p-12`, `p-16`, `p-20`, and `p-24`.
