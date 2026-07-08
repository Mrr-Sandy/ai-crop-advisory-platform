# Component Library

## Purpose
Define reusable components and their expected behavior.

## Goals
- Make UI consistent.
- Reduce duplication.
- Preserve data binding to existing APIs.

## Best Practices
- Components receive data through props.
- API calls live in reusable frontend services or page-level hooks.
- Loading, empty, and error states are first-class.

## Examples
- `CropCard`: renders `name`, `season`, `soil`, `water`.
- `Button`: supports primary, secondary, outline, ghost, danger, loading, and disabled states.
- `Input`: supports label, helper text, error text, focus, disabled.

## Components
Navbar, Button, Input, Card, Badge, Chip, Modal, Dialog, Drawer, Sidebar, Footer, Table, Toast, Dropdown, Pagination, Search, Filter, Loader, Skeleton, Weather Card, Crop Card, Analytics Card.

## Component States
Default, hover, focus, disabled, loading, success, error, empty, and responsive collapsed states.

## Do
- Use icons in action buttons where useful.
- Use semantic HTML and accessible labels.
- Keep cards at 8px radius unless a pattern needs less.

## Don't
- Nest cards inside cards.
- Render fake analytics, weather, or recommendations.

## Real SaaS References
GitHub forms, Stripe cards, Material Design dialogs, Vercel navigation.

## Implementation Notes
Weather Card is hidden until backend support exists. Crop Card and Analytics Card must use real crop API response data or values derived from it.
