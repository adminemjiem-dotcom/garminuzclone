import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Send } from "lucide-react";

const cols = [
  {
    title: "Продукция",
    links: ["Умные часы", "Беговые часы", "Outdoor", "Велокомпьютеры", "Эхолоты"],
  },
  {
    title: "Поддержка",
    links: ["Сервис-центры", "Гарантия", "Доставка", "Возврат", "FAQ"],
  },
  {
    title: "Компания",
    links: ["О Garmin", "Дистрибьютор", "Магазины", "Контакты", "Карьера"],
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
            <a href="#" aria-label="Facebook" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="YouTube" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Telegram" className="p-2 border border-background/20 rounded-full hover:bg-accent hover:border-accent transition">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-display font-semibold uppercase text-sm tracking-wider mb-5">{c.title}</h3>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <Link to="/catalog" className="text-sm text-background/70 hover:text-accent transition">
                    {l}
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
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
