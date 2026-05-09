import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { resolveImage } from "@/lib/products";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "products" | "categories" | "banners" | "branches" | "settings";

function AdminPage() {
  const { userId, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    if (!loading && !userId) navigate({ to: "/auth" });
  }, [loading, userId, navigate]);

  if (loading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (!userId) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Доступ запрещён</h1>
          <p className="text-muted-foreground mt-2">У вашего аккаунта нет роли администратора.</p>
          <button onClick={() => supabase.auth.signOut()} className="mt-4 text-accent hover:underline">Выйти</button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Товары" },
    { key: "categories", label: "Категории" },
    { key: "banners", label: "Баннеры" },
    { key: "branches", label: "Магазины" },
    { key: "settings", label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-foreground text-background">
        <div className="container-x flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-bold text-xl">GARMIN · Admin</Link>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
            className="flex items-center gap-2 text-sm hover:text-accent">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
        <nav className="container-x flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm uppercase tracking-wider transition border-b-2 ${
                tab === t.key ? "border-accent text-accent" : "border-transparent hover:text-accent"
              }`}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="container-x py-8">
        {tab === "products" && <ProductsAdmin />}
        {tab === "categories" && <CategoriesAdmin />}
        {tab === "banners" && <BannersAdmin />}
        {tab === "branches" && <BranchesAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </main>
    </div>
  );
}

// ---------- Image upload helper ----------
async function uploadImage(file: File, prefix: string): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

function ImageField({ value, onChange, prefix }: { value: string; onChange: (v: string) => void; prefix: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {value && <img src={resolveImage(value)} alt="" className="w-16 h-16 object-contain bg-surface border" />}
      <label className={`inline-flex items-center gap-2 border border-border px-3 py-2 text-sm cursor-pointer hover:border-accent ${busy ? "opacity-50" : ""}`}>
        <Upload className="w-4 h-4" />
        {busy ? "Загрузка…" : "Выбрать изображение"}
        <input type="file" accept="image/*" hidden disabled={busy}
          onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true);
            try { onChange(await uploadImage(f, prefix)); toast.success("Загружено"); }
            catch (err: any) { toast.error(err.message); }
            finally { setBusy(false); e.target.value = ""; }
          }} />
      </label>
    </div>
  );
}

// ---------- Products ----------
type ProductRow = {
  id: string; name: string; tagline: string | null; price: number;
  category: string | null; image_path: string | null; featured: boolean;
  description: string | null; sort: number;
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort");
      if (error) throw error;
      return data as ProductRow[];
    },
  });
  const { data: cats = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("slug,title").order("sort");
      if (error) throw error;
      return data;
    },
  });

  const blank: ProductRow = { id: "", name: "", tagline: "", price: 0, category: cats[0]?.slug ?? null, image_path: "", featured: false, description: "", sort: 0 };
  const [editing, setEditing] = useState<ProductRow | null>(null);

  const save = async (p: ProductRow) => {
    if (!p.id || !p.name) return toast.error("ID и название обязательны");
    const { error } = await supabase.from("products").upsert(p);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const del = async (id: string) => {
    if (!confirm(`Удалить ${id}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Удалено");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl font-bold">Товары ({products.length})</h2>
        <button onClick={() => setEditing(blank)} className="bg-accent text-accent-foreground px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="bg-background border border-border">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3 border-b border-border last:border-0">
            <img src={resolveImage(p.image_path)} alt="" className="w-12 h-12 object-contain bg-surface" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.id} · {p.category} · {p.price.toLocaleString("ru-RU")} сум {p.featured && "· ⭐"}</div>
            </div>
            <button onClick={() => setEditing(p)} className="text-sm text-accent hover:underline">Изменить</button>
            <button onClick={() => del(p.id)} className="text-destructive p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? `Редактировать: ${editing.id}` : "Новый товар"}>
          <div className="space-y-3">
            <Field label="ID (slug)"><input className="input" value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} /></Field>
            <Field label="Название"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Подзаголовок"><input className="input" value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
            <Field label="Цена (сум)"><input type="number" className="input" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            <Field label="Категория">
              <select className="input" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value || null })}>
                <option value="">—</option>
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </Field>
            <Field label="Изображение">
              <ImageField value={editing.image_path ?? ""} onChange={(v) => setEditing({ ...editing, image_path: v })} prefix="products" />
            </Field>
            <Field label="Описание"><textarea className="input min-h-24" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Сортировка"><input type="number" className="input" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} /></Field>
              <label className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border">Отмена</button>
              <button onClick={() => save(editing)} className="px-4 py-2 bg-accent text-accent-foreground">Сохранить</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Generic CRUD ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-start justify-center pt-12 p-4 overflow-auto">
      <div className="bg-background w-full max-w-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------- Categories ----------
type CatRow = { slug: string; title: string; description: string | null; sort: number };

function CategoriesAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-categories-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort");
      if (error) throw error; return data as CatRow[];
    },
  });
  const [editing, setEditing] = useState<CatRow | null>(null);

  const save = async (c: CatRow) => {
    if (!c.slug || !c.title) return toast.error("Slug и заголовок обязательны");
    const { error } = await supabase.from("categories").upsert(c);
    if (error) return toast.error(error.message);
    toast.success("Сохранено"); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };
  const del = async (slug: string) => {
    if (!confirm(`Удалить ${slug}?`)) return;
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl font-bold">Категории</h2>
        <button onClick={() => setEditing({ slug: "", title: "", description: "", sort: 0 })} className="bg-accent text-accent-foreground px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="bg-background border border-border">
        {rows.map((c) => (
          <div key={c.slug} className="flex items-center gap-4 p-3 border-b border-border last:border-0">
            <div className="flex-1">
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.slug} · {c.description}</div>
            </div>
            <button onClick={() => setEditing(c)} className="text-sm text-accent hover:underline">Изменить</button>
            <button onClick={() => del(c.slug)} className="text-destructive p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.slug ? `Категория: ${editing.slug}` : "Новая категория"}>
          <div className="space-y-3">
            <Field label="Slug"><input className="input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
            <Field label="Название"><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Описание"><input className="input" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Сортировка"><input type="number" className="input" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} /></Field>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border">Отмена</button>
              <button onClick={() => save(editing)} className="px-4 py-2 bg-accent text-accent-foreground">Сохранить</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Banners ----------
type BannerRow = { id?: string; title: string; subtitle: string | null; image_path: string; link_product_id: string | null; sort: number; active: boolean };

function BannersAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("banners").select("*").order("sort");
      if (error) throw error; return data as BannerRow[];
    },
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products-min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id,name").order("name");
      if (error) throw error; return data;
    },
  });
  const [editing, setEditing] = useState<BannerRow | null>(null);

  const save = async (b: BannerRow) => {
    if (!b.title || !b.image_path) return toast.error("Заголовок и изображение обязательны");
    const { error } = await supabase.from("banners").upsert(b);
    if (error) return toast.error(error.message);
    toast.success("Сохранено"); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-banners"] });
    qc.invalidateQueries({ queryKey: ["banners"] });
  };
  const del = async (id: string) => {
    if (!confirm("Удалить баннер?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-banners"] });
    qc.invalidateQueries({ queryKey: ["banners"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl font-bold">Баннеры</h2>
        <button onClick={() => setEditing({ title: "", subtitle: "", image_path: "", link_product_id: null, sort: 0, active: true })}
          className="bg-accent text-accent-foreground px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((b) => (
          <div key={b.id} className="bg-background border border-border p-3">
            <img src={resolveImage(b.image_path)} alt="" className="w-full h-32 object-cover" />
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground truncate">{b.subtitle} {!b.active && "· (скрыт)"}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(b)} className="text-sm text-accent hover:underline">Изменить</button>
                <button onClick={() => del(b.id!)} className="text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Редактировать баннер" : "Новый баннер"}>
          <div className="space-y-3">
            <Field label="Заголовок"><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Подзаголовок"><input className="input" value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></Field>
            <Field label="Изображение">
              <ImageField value={editing.image_path} onChange={(v) => setEditing({ ...editing, image_path: v })} prefix="banners" />
            </Field>
            <Field label="Ссылка на товар">
              <select className="input" value={editing.link_product_id ?? ""} onChange={(e) => setEditing({ ...editing, link_product_id: e.target.value || null })}>
                <option value="">—</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Сортировка"><input type="number" className="input" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} /></Field>
              <label className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Активен
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border">Отмена</button>
              <button onClick={() => save(editing)} className="px-4 py-2 bg-accent text-accent-foreground">Сохранить</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Branches ----------
type BranchRow = { id?: string; name: string; address: string; phone: string | null; hours: string | null; map_url: string | null; sort: number };

function BranchesAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-branches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branches").select("*").order("sort");
      if (error) throw error; return data as BranchRow[];
    },
  });
  const [editing, setEditing] = useState<BranchRow | null>(null);

  const save = async (b: BranchRow) => {
    if (!b.name) return toast.error("Название обязательно");
    const { error } = await supabase.from("branches").upsert(b);
    if (error) return toast.error(error.message);
    toast.success("Сохранено"); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-branches"] });
    qc.invalidateQueries({ queryKey: ["branches"] });
  };
  const del = async (id: string) => {
    if (!confirm("Удалить?")) return;
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-branches"] });
    qc.invalidateQueries({ queryKey: ["branches"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl font-bold">Магазины / филиалы</h2>
        <button onClick={() => setEditing({ name: "", address: "", phone: "", hours: "", map_url: "", sort: 0 })}
          className="bg-accent text-accent-foreground px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="bg-background border border-border">
        {rows.map((b) => (
          <div key={b.id} className="flex items-center gap-4 p-3 border-b border-border last:border-0">
            <div className="flex-1">
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.address} · {b.phone} · {b.hours}</div>
            </div>
            <button onClick={() => setEditing(b)} className="text-sm text-accent hover:underline">Изменить</button>
            <button onClick={() => del(b.id!)} className="text-destructive p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Редактировать" : "Новый магазин"}>
          <div className="space-y-3">
            <Field label="Название"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Адрес"><input className="input" value={editing.address ?? ""} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></Field>
            <Field label="Телефон"><input className="input" value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field>
            <Field label="Часы работы"><input className="input" value={editing.hours ?? ""} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} /></Field>
            <Field label="Ссылка на карту"><input className="input" value={editing.map_url ?? ""} onChange={(e) => setEditing({ ...editing, map_url: e.target.value })} /></Field>
            <Field label="Сортировка"><input type="number" className="input" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} /></Field>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border">Отмена</button>
              <button onClick={() => save(editing)} className="px-4 py-2 bg-accent text-accent-foreground">Сохранить</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Settings ----------
function SettingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (error) throw error; return data;
    },
  });
  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading || !form) return <div>Загрузка…</div>;

  const save = async () => {
    const { error } = await supabase.from("site_settings").update(form).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold mb-6">Настройки сайта</h2>
      <div className="space-y-3 bg-background border border-border p-6">
        <Field label="Телефон"><input className="input" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Email"><input className="input" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Адрес"><input className="input" value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
        <Field label="Текст футера"><textarea className="input min-h-20" value={form.footer_text ?? ""} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} /></Field>
        <Field label="Facebook URL"><input className="input" value={form.facebook_url ?? ""} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} /></Field>
        <Field label="Instagram URL"><input className="input" value={form.instagram_url ?? ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} /></Field>
        <Field label="YouTube URL"><input className="input" value={form.youtube_url ?? ""} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} /></Field>
        <Field label="Telegram URL"><input className="input" value={form.telegram_url ?? ""} onChange={(e) => setForm({ ...form, telegram_url: e.target.value })} /></Field>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-display font-semibold mb-2">Уведомления о заказах (Telegram)</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Создайте бота через @BotFather, получите токен. Затем напишите боту — chat_id можно узнать через @userinfobot или @getmyid_bot.
          </p>
          <Field label="Telegram bot token (секретно)">
            <input type="password" className="input" value={form.telegram_bot_token ?? ""} onChange={(e) => setForm({ ...form, telegram_bot_token: e.target.value })} />
          </Field>
          <Field label="Telegram chat_id (куда слать заказы)">
            <input className="input" value={form.telegram_chat_id ?? ""} onChange={(e) => setForm({ ...form, telegram_chat_id: e.target.value })} />
          </Field>
        </div>

        <div className="pt-4">
          <button onClick={save} className="bg-accent text-accent-foreground px-6 py-3 font-display font-bold uppercase tracking-wider">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
