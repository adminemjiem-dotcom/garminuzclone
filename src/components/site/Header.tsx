import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Каталог", to: "/catalog" },
  { label: "Карты", to: "/maps" },
  { label: "Поддержка", to: "/support" },
  { label: "Узнать о", to: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
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
          <button aria-label="Поиск" className="p-2 hover:bg-muted rounded-full transition">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Аккаунт" className="p-2 hover:bg-muted rounded-full transition hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button aria-label="Корзина" className="p-2 hover:bg-muted rounded-full transition relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              0
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
    </header>
  );
}
