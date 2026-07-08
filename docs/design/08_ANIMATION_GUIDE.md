# Animation Guide

## Purpose
Define subtle motion rules.

## Goals
- Make interactions feel responsive.
- Avoid distraction.
- Respect reduced motion preferences.

## Best Practices
- Use 150ms to 250ms transitions.
- Animate color, border, shadow, and transform lightly.
- Keep modal transitions quick and calm.

## Examples
- Button hover: 150ms color change.
- Card hover: small shadow and border shift.
- Loading: spinner or skeleton only while API request is pending.

## Do
- Use `transition-colors`, `transition-shadow`, and `duration-200`.
- Keep loading states visible.

## Don't
- Use long page transitions.
- Animate important data in ways that reduce readability.

## Real SaaS References
Vercel and Linear for restrained microinteractions, Material Design for modal motion.

## Implementation Notes
Animations must not change API timing assumptions. Reduced motion support should be added for complex motion if introduced.
