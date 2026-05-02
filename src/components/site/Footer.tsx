import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Send } from "lucide-react";

type Col = {
  title: string;
  links: { label: string; to: string; search?: { category: string } }[];
};

const cols: Col[] = [
  {
    title: "Продукция",
    links: [
      { label: "Умные часы", to: "/catalog", search: { category: "smartwatches" } },
      { label: "Беговые часы", to: "/catalog", search: { category: "running" } },
      { label: "Outdoor", to: "/catalog", search: { category: "outdoor" } },
      { label: "Велокомпьютеры", to: "/catalog", search: { category: "cycling" } },
      { label: "Эхолоты", to: "/catalog", search: { category: "marine" } },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { label: "Сервис-центры", to: "/support" },
      { label: "Гарантия", to: "/support" },
      { label: "Доставка", to: "/support" },
      { label: "Возврат", to: "/support" },
      { label: "FAQ", to: "/support" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О Garmin", to: "/about" },
      { label: "Garmin Pay", to: "/garmin-pay" },
      { label: "Карты", to: "/maps" },
      { label: "Контакты", to: "/about" },
      { label: "Каталог", to: "/catalog" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container-x py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display font-bold text-2xl">GARMIN</div>
          <div className="text-[8px] tracking-[0.2em] text-background/60 mt-1">
            AUTHORISED DISTRIBUTOR
          </div>
          <p className="text-sm text-background/70 mt-6 leading-relaxed">
            Официальный дистрибьютор Garmin в Узбекистане. Гарантия на всю продукцию.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="https://facebook.com" aria-label="Facebook" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://t.me/garmin_uz" aria-label="Telegram" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-display font-semibold uppercase text-sm tracking-wider mb-5">{c.title}</h3>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    search={l.search ?? {}}
                    className="text-sm text-background/70 hover:text-accent transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10">
        <div className="container-x py-6 flex flex-col sm:flex-row gap-2 justify-between text-xs text-background/50">
          <div>© {new Date().getFullYear()} Garmin Uzbekistan. Все права защищены.</div>
          <div className="flex gap-6">
            <Link to="/about">Политика конфиденциальности</Link>
            <Link to="/about">Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
