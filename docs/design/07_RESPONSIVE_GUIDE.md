# Responsive Guide

## Purpose
Define how layouts adapt across screen sizes.

## Goals
- Make the app usable on phones, tablets, laptops, and desktops.
- Prevent clipped text and overlapping controls.
- Preserve data density on larger screens.

## Best Practices
- Mobile first.
- Use single-column forms and cards on mobile.
- Use grids only when width supports scanning.

## Examples
- Mobile: 1 column, 16px gutters.
- Tablet: 2 columns where cards are short.
- Laptop/Desktop: dashboard grid with summary cards and crop management table.

## Do
- Let buttons wrap or stack when space is limited.
- Use stable dimensions for controls and table cells.

## Don't
- Scale fonts with viewport width.
- Hide required actions on mobile.

## Real SaaS References
GitHub responsive repository pages, Notion mobile pages, Material Design breakpoints.

## Implementation Notes
Use Tailwind breakpoints: base, `sm`, `md`, `lg`, and `xl`. Avoid absolute positioning for core layout.
