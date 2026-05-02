import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/garmin-pay")({
  head: () => ({
    meta: [
      { title: "Garmin Pay — Garmin Uzbekistan" },
      { name: "description", content: "Оплачивайте покупки касанием с Garmin Pay прямо со своих часов." },
      { property: "og:title", content: "Garmin Pay" },
      { property: "og:description", content: "Бесконтактная оплата с Garmin Pay." },
    ],
  }),
  component: PayPage,
});

function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold">Garmin Pay</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Оплачивайте покупки касанием прямо со своих часов Garmin. Быстро, удобно и безопасно.
        </p>
      </main>
      <Footer />
    </div>
  );
}
