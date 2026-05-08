import { supabase } from "@/integrations/supabase/client";

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

import banner1 from "@/assets/banners/sH7jI6PGyR.webp";
import banner2 from "@/assets/banners/ojGAVN8WBn.jpeg";
import banner3 from "@/assets/banners/m4mo215yov.webp";
import banner4 from "@/assets/banners/BOgiKIwsdY.webp";
import banner5 from "@/assets/banners/xRcMN6V2Bp.jpeg";

const seedImages: Record<string, string> = {
  "fenix-8": fenix8, "fenix-e": fenixE, "enduro-3": enduro3, "epix-pro": epixPro,
  "tactix-7": tactix7, "tactix-8": tactix8, "instinct-3": instinct3, "gpsmap-67": gpsmap67,
  "forerunner-970": fr970, "forerunner-570": fr570, "forerunner-265": fr265, "forerunner-165": fr165,
  "venu-3": venu3, "vivoactive-6": vivoactive6, "lily-2-active": lily2, "vivosmart-5": vivosmart5,
  "edge-1040": edge1040, "edge-540": edge540, "varia-rct715": varia, "striker-7sv": striker,
  "descent-mk3i": descentMk3i, "drivesmart-66": drivesmart, "approach-s70": approachS70,
  "hrm-pro-plus": hrmProPlus,
};

const seedBanners: Record<string, string> = {
  "sH7jI6PGyR.webp": banner1,
  "ojGAVN8WBn.jpeg": banner2,
  "m4mo215yov.webp": banner3,
  "BOgiKIwsdY.webp": banner4,
  "xRcMN6V2Bp.jpeg": banner5,
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  sort: number;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string | null;
  image_path: string;
  featured: boolean;
  description: string;
  sort: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image_path: string;
  link_product_id: string | null;
  sort: number;
  active: boolean;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  map_url: string;
  sort: number;
};

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  telegram_url: string;
  footer_text: string;
};

/** Resolve an image path from DB into a URL the browser can load. */
export function resolveImage(path: string | null | undefined): string {
  if (!path) return fenix8;
  if (path.startsWith("seed:")) return seedImages[path.slice(5)] ?? fenix8;
  if (path.startsWith("seed-banner:")) return seedBanners[path.slice(12)] ?? fenix8;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Otherwise treat as a path inside the `media` storage bucket.
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/,/g, " ")} сум`;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug,title,description,sort")
    .order("sort");
  if (error) throw error;
  return data ?? [];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,tagline,price,category,image_path,featured,description,sort")
    .order("sort");
  if (error) throw error;
  return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as Product[];
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,tagline,price,category,image_path,featured,description,sort")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? ({ ...data, price: Number(data.price) } as Product) : null;
}

export async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("id,title,subtitle,image_path,link_product_id,sort,active")
    .eq("active", true)
    .order("sort");
  if (error) throw error;
  return data ?? [];
}

export async function fetchBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from("branches")
    .select("id,name,address,phone,hours,map_url,sort")
    .order("sort");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings_public")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return {
    phone: data?.phone ?? "",
    email: data?.email ?? "",
    address: data?.address ?? "",
    facebook_url: data?.facebook_url ?? "",
    instagram_url: data?.instagram_url ?? "",
    youtube_url: data?.youtube_url ?? "",
    telegram_url: data?.telegram_url ?? "",
    footer_text: data?.footer_text ?? "",
  };
}
