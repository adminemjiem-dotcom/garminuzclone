# Garmin.uz clone — TanStack Start + Vite

Full-stack React 19 app built with TanStack Start and Vite 7. Runs locally on
plain Node.js — no Lovable Cloud or Cloudflare account required.

## Requirements

- Node.js 20+ (or Bun 1.1+)
- npm (or pnpm / bun)

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure Telegram order notifications
cp .env.example .env
# edit .env and set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
# (leaving them blank works too — orders will be logged to the terminal)

# 3. Start the dev server
npm run dev
```

Open http://localhost:8080 (or whatever port Vite prints).

## Build for production

```bash
npm run build
npm run preview
```

The default build targets Cloudflare Workers (see `wrangler.jsonc`). To deploy
to a normal Node.js server instead, you can run the preview server, or wrap the
Vite SSR output with any Node host — TanStack Start is runtime-agnostic.

## Data

All product data lives in `src/data/products.json`. Edit that file to change
the catalog. Switching to a real database later only requires replacing the
loaders in `src/lib/products.ts`.

## Telegram orders

The checkout sends orders via `src/server/orders.functions.ts`. It works in
three modes:

1. `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` set → calls Telegram API directly.
2. `LOVABLE_API_KEY` + `TELEGRAM_API_KEY` + `TELEGRAM_CHAT_ID` set → uses the
   Lovable connector gateway (only available when deployed on Lovable).
3. None set → logs the order to the server console and returns success.
   This keeps the UI fully working when running locally without secrets.
