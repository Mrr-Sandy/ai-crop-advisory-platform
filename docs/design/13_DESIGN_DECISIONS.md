# Design Decisions

## Purpose
Record important UI decisions and their rationale.

## Goals
- Make changes explainable.
- Prevent design drift.
- Connect choices to UX principles.

## Best Practices
- Explain why a decision helps users.
- Reference constraints such as backend availability.
- Update this file before major UI changes.

## Examples
- Decision: Use text-first crop cards because the API provides no image field.
- Why: It avoids fake visuals and keeps the UI truthful.

## Do
- Justify decisions with usability, accessibility, maintainability, or data integrity.
- Keep decisions dated when useful.

## Don't
- Write "because it looks good" as rationale.
- Add unsupported interface promises.

## Real SaaS References
GitHub favors transparent dense data views; Stripe uses clear hierarchy for complex products; Vercel avoids unnecessary decoration.

## Implementation Notes
Current decisions: preserve backend contracts, use real crop data only, protect Dashboard and AI Assistant with the existing JWT flow, hide weather UI until backend support exists, use Lucide React for icon consistency, keep dashboard summaries derived from fetched crop records, use confirmation dialogs for destructive actions, and keep mobile navigation compact to avoid small-screen overflow.
