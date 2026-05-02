import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductGrid } from "@/components/site/ProductGrid";
import { getProduct, getCategory, getImage, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { Check, Truck, ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Продукт не найден" }] };
    return {
      meta: [
        { title: `${p.name} — Garmin Uzbekistan` },
        { name: "description", content: p.description },
        { property: "og:title", content: p.name },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container-x py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Товар не найден</h1>
        <Link to="/catalog" className="mt-6 inline-block text-accent hover:underline">← В каталог</Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container-x py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Ошибка загрузки</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
      <Footer />
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, setOpen } = useCart();
  const img = getImage(product.img);
  const cat = getCategory(product.category);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-x py-6 text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-accent">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-accent">Каталог</Link>
          {cat && (
            <>
              <span>/</span>
              <Link to="/catalog" search={{ category: cat.slug }} className="hover:text-accent">
                {cat.title}
              </Link>
            </>
          )}
        </div>

        <div className="container-x grid md:grid-cols-2 gap-12 py-8 pb-20">
          <div className="bg-surface aspect-square flex items-center justify-center p-10">
            <img src={img} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">{product.tagline}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight">
              {product.name}
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8 font-display text-3xl font-bold">{formatPrice(product.price)}</div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  add({ id: product.id, name: product.name, price: formatPrice(product.price), img });
                  toast.success(`${product.name} добавлен в корзину`, {
                    action: { label: "Открыть корзину", onClick: () => setOpen(true) },
                  });
                }}
                className="flex-1 bg-accent text-accent-foreground font-display font-bold uppercase tracking-wider py-4 hover:bg-accent/90 transition"
              >
                В корзину
              </button>
              <button
                onClick={() => {
                  add({ id: product.id, name: product.name, price: formatPrice(product.price), img });
                  setOpen(true);
                }}
                className="flex-1 border border-foreground text-foreground font-display font-bold uppercase tracking-wider py-4 hover:bg-foreground hover:text-background transition"
              >
                Купить сейчас
              </button>
            </div>

            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-accent" /> Оригинал, гарантия 24 месяца</li>
              <li className="flex items-center gap-3"><Truck className="w-4 h-4 text-accent" /> Доставка по всему Узбекистану</li>
              <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-accent" /> Авторизованный сервис-центр</li>
            </ul>

            <Link to="/catalog" className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
              <ArrowLeft className="w-4 h-4" /> Назад в каталог
            </Link>
          </div>
        </div>

        <ProductGrid category={product.category} title="Похожие товары" />
      </main>
      <Footer />
    </div>
  );
}
