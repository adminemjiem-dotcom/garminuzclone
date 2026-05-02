import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-runner.jpg";
import wForerunner from "@/assets/watch-forerunner.png";
import wInstinct from "@/assets/watch-instinct.png";
import wLily from "@/assets/watch-lily.png";
import wVivoactive from "@/assets/watch-vivoactive.png";

const slides = [
  {
    title: "Forerunner 970",
    subtitle: "Спортивные часы для триатлона с GPS",
    img: wForerunner,
    bg: heroBg,
  },
  {
    title: "Instinct 3",
    subtitle: "Прочные смарт-часы с ярким AMOLED-дисплеем",
    img: wInstinct,
    bg: heroBg,
  },
  {
    title: "Lily 2 Active",
    subtitle: "Стильные смарт-часы со встроенным GPS",
    img: wLily,
    bg: heroBg,
  },
  {
    title: "Vivoactive 6",
    subtitle: "Часы для здоровья и фитнеса с GPS",
    img: wVivoactive,
    bg: heroBg,
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="relative bg-foreground overflow-hidden">
      <div className="bg-secondary text-secondary-foreground">
        <div className="container-x py-3 text-center text-xs uppercase tracking-[0.3em] font-display">
          GARMIN
        </div>
      </div>
      <div className="relative h-[480px] md:h-[620px]">
        {slides.map((sl, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={sl.bg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority={idx === 0 ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
            <div className="container-x relative h-full flex items-center">
              <div className="max-w-xl text-background z-10">
                <h1 className="font-display text-5xl md:text-7xl font-bold leading-none">
                  {sl.title}
                </h1>
                <p className="mt-5 text-lg md:text-xl text-background/85 max-w-md">
                  {sl.subtitle}
                </p>
                <button className="mt-8 inline-flex items-center px-8 py-3.5 bg-background text-foreground font-medium uppercase tracking-wider text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                  Узнать больше
                </button>
              </div>
              <div className="hidden md:block absolute right-0 lg:right-12 top-1/2 -translate-y-1/2 w-[55%] max-w-[720px]">
                <img
                  src={sl.img}
                  alt={sl.title}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/10 hover:bg-background/25 backdrop-blur text-background rounded-full transition"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setI((v) => (v + 1) % slides.length)}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/10 hover:bg-background/25 backdrop-blur text-background rounded-full transition"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all ${
                idx === i ? "w-10 bg-background" : "w-5 bg-background/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
