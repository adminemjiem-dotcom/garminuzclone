import { Link } from "@tanstack/react-router";
import { products, getImage, formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

type Props = {
  category?: string;
  featuredOnly?: boolean;
  title?: string;
  limit?: number;
  query?: string;
};

export function ProductGrid({ category, featuredOnly, title, limit, query }: Props) {
  const { add, setOpen } = useCart();

  let list: Product[] = products;
  if (category && category !== "all") list = list.filter((p) => p.category === category);
  if (featuredOnly) list = list.filter((p) => p.featured);
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }
  if (limit) list = list.slice(0, limit);

  return (
    <section className="py-16">
      {title && (
        <div className="bg-secondary py-4 -mx-4 md:-mx-8 mb-12">
          <div className="container-x text-center">
            <h2 className="font-display text-sm md:text-base font-semibold uppercase tracking-[0.3em]">
              {title}
            </h2>
          </div>
        </div>
      )}
      <div className="container-x">
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">В этой категории пока нет товаров.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {list.map((p) => {
              const img = getImage(p.img);
              return (
                <div
                  key={p.id}
                  className="group flex flex-col bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-xl"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="aspect-square bg-surface overflow-hidden flex items-center justify-center p-6"
                  >
                    <img
                      src={img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <Link to="/product/$id" params={{ id: p.id }} className="hover:text-accent transition-colors">
                      <h3 className="font-display font-semibold text-lg leading-tight">{p.name}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{p.tagline}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-base">{formatPrice(p.price)}</span>
                      <button
                        onClick={() => {
                          add({ id: p.id, name: p.name, price: formatPrice(p.price), img });
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
