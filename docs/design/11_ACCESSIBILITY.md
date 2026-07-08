# Accessibility

## Purpose
Ensure the product can be used by people with different abilities and devices.

## Goals
- Support keyboard navigation.
- Maintain readable contrast.
- Use semantic HTML.
- Provide clear focus and error states.

## Best Practices
- Use labels for every form field.
- Use `aria-live` for async status updates.
- Keep focus outlines visible.
- Use buttons for actions and links for navigation.

## Examples
- Search input has a visible label.
- Delete buttons include accessible labels.
- Error banners use `role="alert"`.

## Do
- Test keyboard tab order.
- Keep touch targets comfortable.

## Don't
- Use color alone to show state.
- Remove focus styles.

## Real SaaS References
Material Design accessibility guidance, GitHub forms, Stripe dashboard controls.

## Implementation Notes
CRUD forms must show inline validation and preserve submit button disabled/loading states.
