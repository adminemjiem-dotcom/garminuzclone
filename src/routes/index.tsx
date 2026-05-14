import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { ProductGrid } from "@/components/site/ProductGrid";
import { CategoryBands } from "@/components/site/CategoryBands";
import { Articles } from "@/components/site/Articles";
import { AboutSeo } from "@/components/site/AboutSeo";
import { FeatureBand } from "@/components/site/FeatureBand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garmin Uzbekistan — Умные часы, GPS навигаторы, велокомпьютеры" },
      { name: "description", content: "Официальный дистрибьютор Garmin в Узбекистане. Смарт-часы Forerunner, Instinct, Vivoactive, Lily. Гарантия и сервис." },
      { property: "og:title", content: "Garmin Uzbekistan" },
      { property: "og:description", content: "Официальный дистрибьютор Garmin в Узбекистане." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeatureBand />
        <ProductGrid featuredOnly title="Новые поступления" limit={8} />
        <CategoryBands />
        <Articles />
        <AboutSeo />
      </main>
      <Footer />
    </div>
  );
}
