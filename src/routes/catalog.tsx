import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductGrid } from "@/components/site/ProductGrid";
import { fetchCategories } from "@/lib/products";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Каталог Garmin — Умные часы, GPS, велокомпьютеры" },
      { name: "description", content: "Полный каталог Garmin в Узбекистане: смарт-часы Fenix, Forerunner, Venu, Instinct, велокомпьютеры Edge, эхолоты, навигаторы." },
      { property: "og:title", content: "Каталог Garmin Uzbekistan" },
      { property: "og:description", content: "Все продукты Garmin в Узбекистане с гарантией." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { category, q } = Route.useSearch();
  const active = category ?? "all";
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const current = categories.find((c) => c.slug === active);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-x py-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            {current?.title ?? "Каталог"}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {current?.description ?? "Откройте полный ассортимент устройств Garmin — от часов для бега до многоборных премиум-моделей."}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/catalog"
              search={{}}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition ${
                active === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-accent hover:text-accent"
              }`}
            >
              Все
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/catalog"
                search={{ category: c.slug }}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition ${
                  active === c.slug
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-accent hover:text-accent"
                }`}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
        {q && (
          <div className="container-x -mt-4 text-sm text-muted-foreground">
            Результаты поиска: <span className="text-foreground font-medium">«{q}»</span>
          </div>
        )}
        <ProductGrid category={active} query={q} />
      </main>
      <Footer />
    </div>
  );
}
