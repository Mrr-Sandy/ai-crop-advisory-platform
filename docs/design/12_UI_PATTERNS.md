# UI Patterns

## Purpose
Define common interaction patterns.

## Goals
- Make workflows predictable.
- Keep data operations transparent.
- Avoid unsupported fake features.

## Best Practices
- Fetch data on page load with loading and error states.
- Use explicit buttons for create, edit, delete, and retry.
- Use confirmation patterns for destructive actions.

## Examples
- Search: user input -> `GET /api/crops/search?name=value` -> React state -> crop list.
- Create: form submit -> `POST /api/crops` -> refresh list.
- Update: edit form -> `PUT /api/crops/:id` -> refresh list.
- Delete: delete button -> `DELETE /api/crops/:id` -> remove from UI state.

## Do
- Show empty states when the backend returns an empty array.
- Keep controls close to the data they affect.

## Don't
- Pretend a request succeeded before the backend confirms it.
- Add filters that cannot be backed by real data or derived local data.

## Real SaaS References
GitHub issue lists, Stripe resource tables, Notion search patterns.

## Implementation Notes
Client-side season filters may operate on the real response already stored in state. Search must use the existing search endpoint.
