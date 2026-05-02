import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Каталог — Garmin Uzbekistan" },
      { name: "description", content: "Полный каталог продукции Garmin: смарт-часы, GPS навигаторы, велокомпьютеры, эхолоты." },
      { property: "og:title", content: "Каталог Garmin" },
      { property: "og:description", content: "Все продукты Garmin в Узбекистане." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-x py-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold">Каталог</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Откройте полный ассортимент устройств Garmin — от часов для бега до многоборных премиум-моделей.
          </p>
        </div>
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
