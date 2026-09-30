# Project info

## Stack

- Next.js
- Zustand
- TailwindCss
- Axios
- TanStack Query

## Code Style

- prefer small focused code files
- use fsd v2 architecture
- prefer low coupling high cohesion
- keep business logic separate from ui

## Code Quality

After making code changes:

1. Run `pnpm format`.
2. Run `pnpm check`.
3. If any check fails because of your changes, fix the issue and run
   `pnpm check` again.
4. Do not finish the task until `pnpm check` passes.

Never:
- disable ESLint rules to bypass an error;
- add `@ts-ignore` or `@ts-nocheck` to bypass type errors;
- change lint/format/typecheck configuration just to make checks pass,
  unless the task explicitly requires it.
- if verification cannot pass because of a pre-existing or environment issue,
  report the failing command and error instead of silently ignoring it.
- never use any in typing
