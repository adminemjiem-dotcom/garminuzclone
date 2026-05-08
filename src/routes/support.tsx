import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { fetchBranches, fetchSiteSettings } from "@/lib/products";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Поддержка — Garmin Uzbekistan" },
      { name: "description", content: "Сервис, гарантия и техподдержка Garmin в Узбекистане." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: fetchBranches });
  const { data: s } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold">Поддержка</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Мы поможем с настройкой, гарантией и обслуживанием вашего устройства.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-6">Контакты</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {s?.address && (
            <div className="border border-border p-6">
              <div className="font-display font-semibold">Адрес</div>
              <div className="text-muted-foreground mt-2 text-sm">{s.address}</div>
            </div>
          )}
          {s?.phone && (
            <div className="border border-border p-6">
              <div className="font-display font-semibold">Телефон</div>
              <div className="text-muted-foreground mt-2 text-sm">{s.phone}</div>
            </div>
          )}
          {s?.email && (
            <div className="border border-border p-6">
              <div className="font-display font-semibold">Email</div>
              <div className="text-muted-foreground mt-2 text-sm">{s.email}</div>
            </div>
          )}
        </div>

        {branches.length > 0 && (
          <>
            <h2 className="font-display text-2xl font-bold mt-16 mb-6">Наши магазины и сервис-центры</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((b) => (
                <div key={b.id} className="border border-border p-6">
                  <div className="font-display font-semibold text-lg">{b.name}</div>
                  {b.address && <div className="text-sm text-muted-foreground mt-2">{b.address}</div>}
                  {b.phone && <div className="text-sm text-muted-foreground mt-1">{b.phone}</div>}
                  {b.hours && <div className="text-sm text-muted-foreground mt-1">{b.hours}</div>}
                  {b.map_url && (
                    <a href={b.map_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-accent hover:underline">
                      На карте →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
