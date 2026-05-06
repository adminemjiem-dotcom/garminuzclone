import data from "@/data/products.json";

import fenix8 from "@/assets/products/fenix-8.png";
import fenixE from "@/assets/products/fenix-e.png";
import enduro3 from "@/assets/products/enduro-3.png";
import epixPro from "@/assets/products/epix-pro.webp";
import tactix7 from "@/assets/products/tactix-7.webp";
import tactix8 from "@/assets/products/tactix-8.webp";
import instinct3 from "@/assets/products/instinct-3.webp";
import gpsmap67 from "@/assets/products/gpsmap-67.jpeg";
import fr970 from "@/assets/products/forerunner-970.webp";
import fr570 from "@/assets/products/forerunner-570.webp";
import fr265 from "@/assets/products/forerunner-265.jpeg";
import fr165 from "@/assets/products/forerunner-165.jpeg";
import venu3 from "@/assets/products/venu-3.png";
import vivoactive6 from "@/assets/products/vivoactive-6.jpeg";
import lily2 from "@/assets/products/lily-2-active.webp";
import vivosmart5 from "@/assets/products/vivosmart-5.png";
import edge1040 from "@/assets/products/edge-1040.png";
import edge540 from "@/assets/products/edge-540.png";
import varia from "@/assets/products/varia-rct715.jpeg";
import striker from "@/assets/products/striker-7sv.png";
import descentMk3i from "@/assets/products/descent-mk3i.png";
import drivesmart from "@/assets/products/drivesmart-66.png";
import approachS70 from "@/assets/products/approach-s70.jpeg";
import hrmProPlus from "@/assets/products/hrm-pro-plus.jpeg";

const imageMap: Record<string, string> = {
  "fenix-8": fenix8,
  "fenix-e": fenixE,
  "enduro-3": enduro3,
  "epix-pro": epixPro,
  "tactix-7": tactix7,
  "tactix-8": tactix8,
  "instinct-3": instinct3,
  "gpsmap-67": gpsmap67,
  "forerunner-970": fr970,
  "forerunner-570": fr570,
  "forerunner-265": fr265,
  "forerunner-165": fr165,
  "venu-3": venu3,
  "vivoactive-6": vivoactive6,
  "lily-2-active": lily2,
  "vivosmart-5": vivosmart5,
  "edge-1040": edge1040,
  "edge-540": edge540,
  "varia-rct715": varia,
  "striker-7sv": striker,
  "descent-mk3i": descentMk3i,
  "drivesmart-66": drivesmart,
  "approach-s70": approachS70,
  "hrm-pro-plus": hrmProPlus,
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
  return imageMap[key] ?? fenix8;
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
