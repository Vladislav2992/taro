# Taro

Nuxt app for Tarot readings with a Telegram Mini App free-reading flow.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Telegram Mini App setup

Telegram users are identified from signed `Telegram.WebApp.initData`. Telegram's official SDK is loaded by Nuxt; the bot token is used only by server routes. The server rejects init data older than one hour.

### Environment

Set these values in `.env` locally and in the production host's server environment:

```dotenv
TELEGRAM_BOT_TOKEN=your_bot_token
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
VITE_API_BASE_URL=https://your-existing-cards-api.example
DEEPSEEK_API_KEY=your_interpretation_provider_key
```

`TELEGRAM_BOT_TOKEN` and `DATABASE_URL` are server-only. `VITE_API_BASE_URL` is used by the existing public cards/layouts client. Keep the existing YooKassa variables configured for browser payments.

Create a managed PostgreSQL database, then run [`server/database/telegram-users.sql`](server/database/telegram-users.sql) once against it. This creates only `telegram_users` with `telegram_id`, `free_readings_balance`, and `created_at`. A newly authenticated user gets one free reading. The database connection must support PostgreSQL transactions and row locks; for serverless deployment, use the provider's pooled connection URL.

### Local Telegram run

1. Set the environment variables and run `npm run dev`.
2. Expose the local HTTPS app through a tunnel such as ngrok or Cloudflare Tunnel.
3. In BotFather, configure the bot's Mini App URL to the tunnel URL (or production HTTPS URL).
4. Open the Mini App from Telegram. The app validates init data with the server and creates the user's balance row on first launch.
5. Choose a spread, select its cards, and request the free reading. If interpretation generation fails, the transaction rolls back and the balance remains available.

Browser visits continue to use the existing YooKassa payment flow. Telegram free readings use `/api/telegram/free-reading`; each request must carry fresh signed init data. The one-hour age limit is configurable in `server/utils/telegram-auth.ts`.

For production, set the Mini App URL to the deployed HTTPS origin and set the production bot token and pooled database URL in the deployment environment. The Telegram SDK / server validation alone does not configure the bot in BotFather.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
