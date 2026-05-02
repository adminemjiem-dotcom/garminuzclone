import wForerunner from "@/assets/watch-forerunner.png";
import wInstinct from "@/assets/watch-instinct.png";
import wLily from "@/assets/watch-lily.png";
import wVivoactive from "@/assets/watch-vivoactive.png";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

type Product = { id: string; name: string; tagline: string; price: string; img: string };

const products: Product[] = [
  { id: "vivoactive-6", name: "Vivoactive 6", tagline: "Здоровье и фитнес", price: "3 990 000 сум", img: wVivoactive },
  { id: "forerunner-970", name: "Forerunner 970", tagline: "Триатлон GPS", price: "8 490 000 сум", img: wForerunner },
  { id: "lily-2-active", name: "Lily 2 Active", tagline: "Стиль и GPS", price: "2 790 000 сум", img: wLily },
  { id: "instinct-3-amoled", name: "Instinct 3 AMOLED", tagline: "Прочные с GPS", price: "5 290 000 сум", img: wInstinct },
];

export function ProductGrid() {
  const { add, setOpen } = useCart();
  return (
    <section className="py-20">
      <div className="bg-secondary py-4 -mx-4 md:-mx-8 mb-12">
        <div className="container-x text-center">
          <h2 className="font-display text-sm md:text-base font-semibold uppercase tracking-[0.3em]">
            Новые поступления
          </h2>
        </div>
      </div>
      <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-xl"
          >
            <div className="aspect-square bg-surface overflow-hidden flex items-center justify-center p-6">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-lg">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{p.tagline}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-display font-bold text-base">{p.price}</span>
                <button
                  onClick={() => {
                    add({ id: p.id, name: p.name, price: p.price, img: p.img });
                    toast.success(`${p.name} добавлен в корзину`, {
                      action: { label: "Открыть", onClick: () => setOpen(true) },
                    });
                  }}
                  className="text-xs text-accent font-medium uppercase tracking-wide hover:underline"
                >
                  Купить →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
