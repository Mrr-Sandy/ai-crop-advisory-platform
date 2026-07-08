# Page Layouts

## Purpose
Define page structures for the product.

## Goals
- Keep screens consistent and responsive.
- Place real data at the center of workflows.
- Support future growth without layout churn.

## Best Practices
- Use a shared navbar and footer for public pages.
- Use constrained content widths with full-width background bands.
- Use dashboard grids for scanable operational data.

## Examples
- Landing Page: hero, real crop preview, CTA.
- Dashboard: welcome section, crop statistics, search, filters, CRUD table/cards, recent crop activity.
- Crop Details: record-level crop information and edit controls.
- Login/Register: clean authentication form layouts when backend support exists.

## Do
- Include loading, empty, and error screens.
- Keep mobile actions reachable and readable.

## Don't
- Build marketing pages when a workflow is needed.
- Add visible pages for unsupported backend features.

## Real SaaS References
Vercel dashboards, Stripe settings pages, GitHub repository pages.

## Implementation Notes
Current routes are Home, About, Dashboard, and Login. Register, Profile, Settings, Crop Details, 404, Loading, Empty, and Error layouts are documented for roadmap work.
