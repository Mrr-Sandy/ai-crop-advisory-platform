# Design Documentation

## Purpose
This folder defines the product design system for AI Crop Advisory Platform.

## Goals
- Create a professional SaaS interface.
- Maintain consistency across pages and components.
- Ensure every visible data component is backed by real API data.
- Prevent random redesigns.

## Best Practices
- Start with vision, then tokens, then components, then pages.
- Update `13_DESIGN_DECISIONS.md` when a major choice changes.
- Use `14_UI_ROADMAP.md` for future UI that lacks backend support.

## Examples
- Weather widgets remain hidden until a real weather endpoint exists.
- Crop analytics are derived from fetched crop records, not mocked.

## Do
- Read `00_DESIGN_VISION.md` before styling.
- Follow color, typography, spacing, and accessibility rules.
- Use Lucide React icons for interface actions.

## Don't
- Use fake JSON, hardcoded backend responses, or mock charts.
- Create visual patterns that are absent from the design system.

## Real SaaS References
Vercel, Stripe, GitHub, Notion, Linear, and Material Design 3.

## Implementation Notes
Documents connect in order: vision defines intent, brand defines tone, tokens define primitives, components define reusable parts, layouts define pages, and roadmap captures future work.
