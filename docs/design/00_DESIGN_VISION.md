# Design Vision

## Purpose
Define the product experience for a trustworthy AI crop advisory SaaS.

## Goals
- Make agricultural data easy to scan and act on.
- Build trust with calm visual hierarchy.
- Support farmers, officers, students, and researchers.
- Look production-ready without decorative excess.

## Best Practices
- Use minimal layouts with clear grouping.
- Prioritize real crop data and transparent states.
- Keep actions visible, predictable, and keyboard accessible.

## Examples
- A farmer can search a crop and immediately see season, soil, and water needs.
- An officer can add or update crop records through clear forms.

## Do
- Use whitespace, readable type, and restrained surfaces.
- Show loading and error states near the data they affect.

## Don't
- Use glassmorphism, neon colors, heavy gradients, or oversized shadows.
- Hide important CRUD actions behind unclear interactions.

## Real SaaS References
Vercel for quiet polish, GitHub for utility, Stripe for clear page rhythm, and Notion for readable content blocks.

## Implementation Notes
Every UI component that displays data must follow the chain: MongoDB Atlas -> Mongoose Model -> Controller / Routes -> Express API -> Fetch service -> React state -> UI component -> Screen.
