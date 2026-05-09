import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners, resolveImage } from "@/lib/products";

export function Hero() {
  const { data: slides = [] } = useQuery({ queryKey: ["banners"], queryFn: fetchBanners });
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="bg-foreground h-[480px] md:h-[620px] flex items-center justify-center text-background/60">
        Загрузка баннеров…
      </section>
    );
  }

  const s = slides[i] ?? slides[0];

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
            key={sl.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={resolveImage(sl.image_path)}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
              fetchPriority={idx === 0 ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/20 to-transparent pointer-events-none" />
            <div className="container-x relative h-full flex items-center">
              <div className="max-w-xl text-background z-10">
                <h1 className="font-display text-5xl md:text-7xl font-bold leading-none">
                  {sl.title}
                </h1>
                {sl.subtitle && (
                  <p className="mt-5 text-lg md:text-xl text-background/85 max-w-md">
                    {sl.subtitle}
                  </p>
                )}
                {sl.link_product_id && (
                  <Link
                    to="/product/$id"
                    params={{ id: sl.link_product_id }}
                    className="mt-8 inline-flex items-center px-8 py-3.5 bg-background text-foreground font-medium uppercase tracking-wider text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Узнать больше
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        {slides.length > 1 && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
