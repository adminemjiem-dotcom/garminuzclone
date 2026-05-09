import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

const orderSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().max(300).optional().default(""),
  note: z.string().trim().max(500).optional().default(""),
  items: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        price: z.string().min(1).max(60),
        qty: z.number().int().min(1).max(99),
      })
    )
    .min(1)
    .max(50),
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const sendOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    // Local / self-hosted fallback: if no Telegram credentials are configured,
    // just log the order to the server console and return success so the site
    // remains fully functional when running locally with `npm run dev`.
    const hasGateway = LOVABLE_API_KEY && TELEGRAM_API_KEY && TELEGRAM_CHAT_ID;
    const hasDirectBot = TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID;
    if (!hasGateway && !hasDirectBot) {
      console.log("[order] (no Telegram configured — logging only)\n", JSON.stringify(data, null, 2));
      return { ok: true as const, mode: "log" as const };
    }

    const lines = data.items
      .map(
        (i, idx) =>
          `${idx + 1}. <b>${escapeHtml(i.name)}</b> × ${i.qty} — ${escapeHtml(i.price)}`
      )
      .join("\n");

    const text =
      `🛒 <b>Новый заказ — Garmin.uz</b>\n\n` +
      `<b>Имя:</b> ${escapeHtml(data.name)}\n` +
      `<b>Телефон:</b> ${escapeHtml(data.phone)}\n` +
      (data.address ? `<b>Адрес:</b> ${escapeHtml(data.address)}\n` : "") +
      (data.note ? `<b>Комментарий:</b> ${escapeHtml(data.note)}\n` : "") +
      `\n<b>Товары:</b>\n${lines}\n\n` +
      `<i>${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })} (Tashkent)</i>`;

    const payload = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });

    // Build target URL + headers depending on which credentials are present.
    const url = hasGateway
      ? `${GATEWAY_URL}/sendMessage`
      : `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (hasGateway) {
      headers["Authorization"] = `Bearer ${LOVABLE_API_KEY}`;
      headers["X-Connection-Api-Key"] = TELEGRAM_API_KEY!;
    }

    let lastStatus = 0;
    let lastBody: any = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await fetch(url, { method: "POST", headers, body: payload });
      lastStatus = res.status;
      lastBody = await res.json().catch(() => ({}));
      if (res.ok && (lastBody as any).ok) return { ok: true as const };
      const transient = res.status >= 502 || (lastBody as any)?.type === "upstream_request_failed";
      if (!transient) break;
      console.warn(`Telegram sendMessage attempt ${attempt} failed`, res.status, lastBody);
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }

    console.error("Telegram sendMessage failed after retries", lastStatus, lastBody);
    throw new Error(`Не удалось отправить заказ (${lastStatus})`);
  });
