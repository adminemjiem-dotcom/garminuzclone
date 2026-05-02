import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Поддержка — Garmin Uzbekistan" },
      { name: "description", content: "Сервис, гарантия и техподдержка Garmin в Узбекистане." },
      { property: "og:title", content: "Поддержка Garmin" },
      { property: "og:description", content: "Сервис и гарантия Garmin в Узбекистане." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold">Поддержка</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Мы поможем с настройкой, гарантией и обслуживанием вашего устройства.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { t: "Сервис-центр", d: "Ташкент, ул. Амира Темура 15" },
            { t: "Телефон", d: "+998 (71) 200-00-00" },
            { t: "Email", d: "support@garmin.uz" },
          ].map((c) => (
            <div key={c.t} className="border border-border p-6">
              <div className="font-display font-semibold">{c.t}</div>
              <div className="text-muted-foreground mt-2 text-sm">{c.d}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
