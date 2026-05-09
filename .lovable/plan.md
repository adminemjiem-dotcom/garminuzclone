## 1. Fix BranchRow TypeScript error in `src/routes/admin.tsx`

The local `BranchRow` type does not line up with the generated Supabase `branches` row type — in the DB schema `address` is `text NOT NULL` (default `''`), and `name`/`sort` are non-null too, so passing a row typed with nullable fields into `.upsert(b)` fails type-checking.

Fix: align `BranchRow` with the actual schema.

```ts
type BranchRow = {
  id?: string;
  name: string;
  address: string;          // not nullable
  phone: string | null;
  hours: string | null;
  map_url: string | null;
  sort: number;
};
```

No UI changes — the form already coerces empty strings (`?? ""`) for the optional fields, so behavior is unchanged.

## 2. Read Telegram credentials from `site_settings` in `src/server/orders.functions.ts`

Today the handler reads `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` (and the Lovable gateway combo) from `process.env`. Switch the primary source to the `site_settings` row managed in the admin panel, and keep env vars only as a self-hosting fallback.

Steps inside the handler:

1. Import the admin client: `import { supabaseAdmin } from "@/integrations/supabase/client.server";`
2. Fetch settings: `supabaseAdmin.from("site_settings").select("telegram_bot_token, telegram_chat_id").eq("id", 1).maybeSingle()`.
3. Resolution order for credentials:
   - `bot_token` = `site_settings.telegram_bot_token` || `process.env.TELEGRAM_BOT_TOKEN`
   - `chat_id`   = `site_settings.telegram_chat_id`   || `process.env.TELEGRAM_CHAT_ID`
   - Lovable gateway path (`LOVABLE_API_KEY` + `TELEGRAM_API_KEY` + chat id) stays as a secondary mode.
4. If neither a direct bot token + chat id nor the gateway combo is available, keep the existing "log only" fallback so local dev still works.
5. Build URL/headers exactly as today based on which mode resolved.

No schema or RLS changes are needed — `site_settings` already exists, the columns are present, and `supabaseAdmin` bypasses RLS so the server function can read the secrets even though anon users cannot.

### Files touched
- `src/routes/admin.tsx` — adjust `BranchRow` type only.
- `src/server/orders.functions.ts` — add settings lookup + new credential resolution.
