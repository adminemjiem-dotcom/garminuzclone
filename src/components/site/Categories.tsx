import cycling from "@/assets/cat-cycling.jpg";
import outdoor from "@/assets/cat-outdoor.jpg";
import swim from "@/assets/cat-swim.jpg";

const cats = [
  { title: "Outdoor", desc: "Покоряйте вершины", img: outdoor },
  { title: "Велоспорт", desc: "Преодолевайте маршруты", img: cycling },
  { title: "Плавание", desc: "Тренируйтесь в воде", img: swim },
];

export function Categories() {
  return (
    <section className="py-20 bg-surface">
      <div className="container-x">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-3">
          Найдите часы под свой стиль
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">
          От ежедневных тренировок до экстремальных приключений — Garmin поможет достичь большего.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {cats.map((c) => (
            <a
              key={c.title}
              href="#"
              className="group relative overflow-hidden h-[420px] block"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-background">
                <h3 className="font-display text-3xl font-bold">{c.title}</h3>
                <p className="mt-2 text-background/80">{c.desc}</p>
                <span className="mt-4 inline-block text-sm uppercase tracking-wider border-b border-background/60 pb-1 group-hover:text-accent group-hover:border-accent transition-colors">
                  Смотреть →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
