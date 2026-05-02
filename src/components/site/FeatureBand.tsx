import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const items = [
  { icon: Truck, title: "Бесплатная доставка", desc: "По всему Узбекистану" },
  { icon: ShieldCheck, title: "Официальная гарантия", desc: "До 24 месяцев" },
  { icon: Headphones, title: "Поддержка 24/7", desc: "Сервис-центр в Ташкенте" },
  { icon: CreditCard, title: "Garmin Pay", desc: "Оплата касанием" },
];

export function FeatureBand() {
  return (
    <section className="border-y border-border">
      <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-full">
              <it.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-sm">{it.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
