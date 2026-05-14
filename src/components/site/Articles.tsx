const articles = [
  {
    title: "10 самых больших ошибок силовых тренировок",
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    title: "Основные причины, почему гонщики предпочитают zūmo",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    title: "Новые улучшения в программе планирования FltLogic",
    img: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    title: "Борец за свободу на открытом воздухе",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
];

export function Articles() {
  return (
    <section className="py-20 bg-surface">
      <div className="container-x">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
          Блог
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((a) => (
            <a
              key={a.title}
              href={a.href}
              className="group block bg-background overflow-hidden border border-border hover:border-accent transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold leading-snug">
                  {a.title}
                </h3>
                <span className="mt-3 inline-block text-xs uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors">
                  Узнать больше →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
