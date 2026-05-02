import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (!TELEGRAM_CHAT_ID) throw new Error("TELEGRAM_CHAT_ID is not configured");

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

    const res = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok || !(body as any).ok) {
      console.error("Telegram sendMessage failed", res.status, body);
      throw new Error(`Не удалось отправить заказ (${res.status})`);
    }

    return { ok: true as const };
  });
