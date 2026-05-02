import data from "@/data/products.json";

import wForerunner from "@/assets/watch-forerunner.png";
import wInstinct from "@/assets/watch-instinct.png";
import wLily from "@/assets/watch-lily.png";
import wVivoactive from "@/assets/watch-vivoactive.png";
import fenix8 from "@/assets/products/fenix-8.png";
import epixPro from "@/assets/products/epix-pro.png";
import venu3 from "@/assets/products/venu-3.png";
import fr265 from "@/assets/products/forerunner-265.png";
import fr165 from "@/assets/products/forerunner-165.png";
import tactix7 from "@/assets/products/tactix-7.png";
import edge1040 from "@/assets/products/edge-1040.png";
import edge540 from "@/assets/products/edge-540.png";
import varia from "@/assets/products/varia-rct715.png";
import striker from "@/assets/products/striker-7sv.png";
import drivesmart from "@/assets/products/drivesmart-66.png";
import gpsmap67 from "@/assets/products/gpsmap-67.png";
import approachS70 from "@/assets/products/approach-s70.png";
import vivosmart5 from "@/assets/products/vivosmart-5.png";
import hrmPro from "@/assets/products/hrm-pro.png";
import descentMk3 from "@/assets/products/descent-mk3.png";

const imageMap: Record<string, string> = {
  "watch-forerunner": wForerunner,
  "watch-instinct": wInstinct,
  "watch-lily": wLily,
  "watch-vivoactive": wVivoactive,
  "fenix-8": fenix8,
  "epix-pro": epixPro,
  "venu-3": venu3,
  "forerunner-265": fr265,
  "forerunner-165": fr165,
  "tactix-7": tactix7,
  "edge-1040": edge1040,
  "edge-540": edge540,
  "varia-rct715": varia,
  "striker-7sv": striker,
  "drivesmart-66": drivesmart,
  "gpsmap-67": gpsmap67,
  "approach-s70": approachS70,
  "vivosmart-5": vivosmart5,
  "hrm-pro": hrmPro,
  "descent-mk3": descentMk3,
};

export type Category = {
  slug: string;
  title: string;
  desc: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string;
  img: string;
  featured: boolean;
  description: string;
};

export const categories: Category[] = data.categories;
export const products: Product[] = data.products;

export function getImage(key: string): string {
  return imageMap[key] ?? wForerunner;
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/,/g, " ")} сум`;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
