import { Link } from "@tanstack/react-router";

type Band = {
  eyebrow?: string;
  title: string;
  desc: string;
  img: string;
  to: string;
  search?: Record<string, string>;
  reverse?: boolean;
  dark?: boolean;
};

const bands: Band[] = [
  {
    title: "Часы",
    desc: "Изучите все наши наручные устройства для всех возрастов, от трекеров активности до умных часов.",
    img: "https://www.garmin.com.uz/img/clocks.jpg",
    to: "/catalog",
    search: { category: "smartwatches" },
  },
  {
    title: "Камеры",
    desc: "Куда бы вы ни отправились за приключениями, наши камеры предназначены для съёмки. С 360-градусными камерами, экшн-камерами, видеорегистраторами и резервными камерами — мы обеспечим вас.",
    img: "https://www.garmin.com.uz/img/cameras.png",
    to: "/catalog",
    reverse: true,
    dark: true,
  },
  {
    eyebrow: "АВТОМОБИЛЬНЫЕ",
    title: "Управляйте уверенно",
    desc: "Персональные навигационные устройства для легковых, грузовых автомобилей, мотоциклов и внедорожников. Видеорегистраторы, камеры заднего вида и автомобильные мониторы для безопасности за рулём.",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    to: "/catalog",
    search: { category: "auto" },
  },
  {
    eyebrow: "СПОРТ И ФИТНЕС",
    title: "Не отставайте от своего ритма",
    desc: "Отслеживайте активность, гольф, плавание, походы, катание на велосипеде, бег и многое другое с продуктами, созданными для вашего образа жизни.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80",
    to: "/catalog",
    search: { category: "running" },
    reverse: true,
    dark: true,
  },
  {
    eyebrow: "ОТДЫХ НА СВЕЖЕМ ВОЗДУХЕ",
    title: "Покорите природу",
    desc: "Походы, исследование улиц, выслеживание и обучение собак с помощью прочных устройств, предназначенных для жизни на улице.",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80",
    to: "/catalog",
    search: { category: "outdoor" },
  },
  {
    eyebrow: "МОРСКОЙ",
    title: "Уверенно на воде",
    desc: "Найдите простую в использовании и надёжную электронику для вашего времени на воде — от эхолотов до картплоттеров.",
    img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
    to: "/catalog",
    search: { category: "marine" },
    reverse: true,
    dark: true,
  },
  {
    eyebrow: "АВИАЦИОННЫЙ",
    title: "Передовая авионика",
    desc: "Полная линейка авионики Garmin — от самых совершенных кабин для пилотов до портативных навигаторов. Технологии, которые модернизируют способ полёта.",
    img: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80",
    to: "/catalog",
  },
];

export function CategoryBands() {
  return (
    <section className="bg-background">
      {bands.map((b) => (
        <div
          key={b.title}
          className={b.dark ? "bg-foreground text-background" : "bg-background text-foreground"}
        >
          <div className="container-x grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24">
            <div className={b.reverse ? "md:order-2" : ""}>
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={b.img}
                  alt={b.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className={b.reverse ? "md:order-1" : ""}>
              {b.eyebrow && (
                <div className="text-xs uppercase tracking-[0.3em] font-display mb-4 opacity-70">
                  {b.eyebrow}
                </div>
              )}
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                {b.title}
              </h2>
              <p className={`mt-5 text-base md:text-lg max-w-lg ${b.dark ? "text-background/75" : "text-muted-foreground"}`}>
                {b.desc}
              </p>
              <Link
                to={b.to}
                search={b.search as never}
                className={`mt-8 inline-flex items-center px-7 py-3 font-medium uppercase tracking-wider text-xs transition-colors ${
                  b.dark
                    ? "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    : "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
