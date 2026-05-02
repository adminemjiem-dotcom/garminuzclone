import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "Карты — Garmin Uzbekistan" },
      { name: "description", content: "Карты для устройств Garmin: топографические, дорожные, морские." },
      { property: "og:title", content: "Карты Garmin" },
      { property: "og:description", content: "Загрузите карты для вашего устройства Garmin." },
    ],
  }),
  component: MapsPage,
});

function MapsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold">Карты</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Топографические, дорожные и морские карты для всех устройств Garmin.
        </p>
      </main>
      <Footer />
    </div>
  );
}
