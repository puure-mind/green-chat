# Green Chat

Green Chat is a minimal messenger-style Next.js application for working with chats through Green API.

## Requirements

- Node.js 20 or newer.
- pnpm 9.7.0 or newer.
- Active Green API instance with `idInstance` and `apiTokenInstance`.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Set the Green API base URL in `.env.local`:

```bash
NEXT_PUBLIC_GREEN_API_URL=<apiUrlFromGreenApiConsole>
```

## Development

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in a browser.

The app uses credentials entered in the authorization form:

- `idInstance` from the Green API console.
- `apiTokenInstance` from the Green API console.

After successful authorization, enter a phone number in international format, create or open a chat, send messages, and
keep the page open to receive incoming messages.

## Quality Checks

Run all project checks:

```bash
pnpm check
```

Run checks separately:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
```

Format files:

```bash
pnpm format
```

## Production Build

Create a production build:

```bash
pnpm build
```

Run the production server locally:

```bash
pnpm start
```

The production server also uses variables from `.env.local` or the deployment environment.
