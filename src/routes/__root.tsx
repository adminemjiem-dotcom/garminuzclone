import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Garmin Uzbekistan — Официальный дистрибьютор" },
      { name: "description", content: "Официальный дистрибьютор Garmin в Узбекистане. Смарт-часы, GPS навигаторы, велокомпьютеры, эхолоты с гарантией." },
      { name: "author", content: "Garmin Uzbekistan" },
      { property: "og:title", content: "Garmin Uzbekistan — Официальный дистрибьютор" },
      { property: "og:description", content: "Официальный дистрибьютор Garmin в Узбекистане. Смарт-часы, GPS навигаторы, велокомпьютеры, эхолоты с гарантией." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Garmin Uzbekistan — Официальный дистрибьютор" },
      { name: "twitter:description", content: "Официальный дистрибьютор Garmin в Узбекистане. Смарт-часы, GPS навигаторы, велокомпьютеры, эхолоты с гарантией." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/toHlq3DeeUe5MhHhhsa8LIuHEBx1/social-images/social-1778307372119-Screenshot_2026-05-09_111539.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/toHlq3DeeUe5MhHhhsa8LIuHEBx1/social-images/social-1778307372119-Screenshot_2026-05-09_111539.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
        <CartDrawer />
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </QueryClientProvider>
  );
}
