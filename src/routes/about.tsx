import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О Garmin — Garmin Uzbekistan" },
      { name: "description", content: "Узнайте больше о бренде Garmin и его инновациях в области GPS-технологий." },
      { property: "og:title", content: "О Garmin" },
      { property: "og:description", content: "Бренд Garmin в Узбекистане." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold">О Garmin</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Garmin — мировой лидер в области GPS-навигации и носимых устройств. С 1989 года компания
          создаёт инновационные продукты для спорта, фитнеса, авиации, морского дела и автомобильной навигации.
        </p>
      </main>
      <Footer />
    </div>
  );
}
