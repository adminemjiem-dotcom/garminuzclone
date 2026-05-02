import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { sendOrder } from "@/server/orders.functions";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Введите номер телефона")
    .max(40)
    .regex(/^[+\d\s()-]+$/, "Неверный формат телефона"),
  address: z.string().trim().max(300).optional(),
  note: z.string().trim().max(500).optional(),
});

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear, count } = useCart();
  const sendOrderFn = useServerFn(sendOrder);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await sendOrderFn({
        data: {
          ...parsed.data,
          address: parsed.data.address ?? "",
          note: parsed.data.note ?? "",
          items: items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
        },
      });
      toast.success("Заказ отправлен! Мы свяжемся с вами.");
      clear();
      setForm({ name: "", phone: "", address: "", note: "" });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Ошибка отправки заказа");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-background shadow-2xl flex flex-col animate-in slide-in-from-right">
        <header className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide">
            Корзина {count > 0 && <span className="text-accent">({count})</span>}
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Закрыть" className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <p className="text-sm">Ваша корзина пуста</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i.id} className="p-4 flex gap-3">
                  <div className="w-20 h-20 bg-surface flex items-center justify-center shrink-0">
                    <img src={i.img} alt={i.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{i.name}</h3>
                    <p className="text-sm font-display font-bold mt-1">{i.price}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="p-1 border border-border hover:border-accent rounded"
                        aria-label="Уменьшить"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="p-1 border border-border hover:border-accent rounded"
                        aria-label="Увеличить"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="ml-auto p-1 text-muted-foreground hover:text-destructive"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <form onSubmit={onSubmit} className="p-5 border-t border-border space-y-3">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider">Контактные данные</h3>
              <div>
                <input
                  type="text"
                  placeholder="Имя *"
                  value={form.name}
                  maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border bg-background focus:border-accent outline-none text-sm"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Телефон * (+998 ...)"
                  value={form.phone}
                  maxLength={40}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border bg-background focus:border-accent outline-none text-sm"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Адрес доставки"
                  value={form.address}
                  maxLength={300}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border bg-background focus:border-accent outline-none text-sm"
                />
              </div>
              <div>
                <textarea
                  placeholder="Комментарий к заказу"
                  value={form.note}
                  maxLength={500}
                  rows={2}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border bg-background focus:border-accent outline-none text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground font-display font-bold uppercase tracking-wider py-3.5 hover:bg-accent/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Отправка..." : "Оформить заказ"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь, что менеджер свяжется с вами для подтверждения.
              </p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
