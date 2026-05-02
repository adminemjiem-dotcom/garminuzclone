import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, Menu, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const nav = [
  { label: "Каталог", to: "/catalog" },
  { label: "Карты", to: "/maps" },
  { label: "Поддержка", to: "/support" },
  { label: "Узнать о", to: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { count, setOpen: setCartOpen } = useCart();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate({ to: "/catalog", search: { q } as any });
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="bg-secondary text-secondary-foreground text-xs">
        <div className="container-x flex justify-end items-center gap-2 py-1.5">
          <span className="inline-block w-4 h-3 bg-gradient-to-b from-sky-400 via-white to-emerald-500 rounded-sm" aria-hidden />
          <span>Узбекистан</span>
        </div>
      </div>
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="font-display font-bold text-2xl tracking-tight leading-none">
            GARMIN
            <div className="text-[8px] font-sans tracking-[0.2em] text-muted-foreground mt-0.5">
              AUTHORISED DISTRIBUTOR
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors flex items-center gap-1"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
              <ChevronDown className="w-3 h-3" />
            </Link>
          ))}
          <Link
            to="/garmin-pay"
            className="text-sm font-medium uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            Garmin Pay
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            aria-label="Поиск"
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            aria-label="Корзина"
            onClick={() => setCartOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          </button>
          <button
            aria-label="Меню"
            className="p-2 hover:bg-muted rounded-full lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-2.5 text-sm font-medium uppercase tracking-wide"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/garmin-pay" className="py-2.5 text-sm font-medium uppercase tracking-wide" onClick={() => setOpen(false)}>
              Garmin Pay
            </Link>
          </div>
        </div>
      )}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <button
            type="button"
            aria-label="Закрыть поиск"
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 -z-10"
          />
          <div className="w-full max-w-2xl">
            <form onSubmit={submitSearch} className="flex items-center gap-2 border-b-2 border-foreground pb-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск товаров Garmin…"
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setSearchOpen(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">Нажмите Enter для поиска</p>
          </div>
        </div>
      )}
    </header>
  );
}
