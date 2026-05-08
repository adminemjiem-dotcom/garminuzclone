import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Вход — Garmin Uzbekistan" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Аккаунт создан. Войдите.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Добро пожаловать!");
        navigate({ to: "/admin" });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Ошибка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-x py-16 max-w-md">
        <h1 className="font-display text-3xl font-bold">
          {mode === "signin" ? "Вход в админ-панель" : "Регистрация"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Первый зарегистрированный аккаунт автоматически становится администратором.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-border px-3 py-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider">Пароль</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-border px-3 py-2 bg-transparent" />
          </div>
          <button disabled={busy} className="w-full bg-accent text-accent-foreground py-3 font-display font-bold uppercase tracking-wider disabled:opacity-50">
            {busy ? "..." : mode === "signin" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-accent hover:underline">
          {mode === "signin" ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти"}
        </button>
        <Link to="/" className="block mt-6 text-sm text-muted-foreground hover:text-accent">← На главную</Link>
      </main>
      <Footer />
    </div>
  );
}
