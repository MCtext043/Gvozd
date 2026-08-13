"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { apiGet, apiPut } from "@/lib/api";
import type { SiteSettings } from "@/types";
import { SITE } from "@/lib/site";

export default function AdminContentPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<SiteSettings>({
    phone: SITE.phone,
    email: SITE.email,
    address: SITE.address.full,
    hours: SITE.hours.short,
    about_html: "",
    seo_title: SITE.fullName,
    seo_description: SITE.tagline,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiGet<SiteSettings>("/admin/settings", { token, cache: "no-store" })
      .then((data) => setForm((f) => ({ ...f, ...data })))
      .catch(() => setError("Настройки API недоступны — показаны значения по умолчанию."));
  }, [token]);

  async function onSave() {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await apiPut("/admin/settings", form, { token, cache: "no-store" });
      setMessage("Контент сохранён");
    } catch {
      setError("Не удалось сохранить.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Контент</h2>
        <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
          Тексты «О центре», контакты и SEO-поля сайта.
        </p>
      </div>
      {message ? (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>
      ) : null}
      <div className="grid max-w-3xl gap-4 rounded-xl border bg-white p-5">
        <Input
          label="Телефон"
          value={form.phone ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        <Input
          label="Email"
          value={form.email ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Адрес"
          value={form.address ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        <Input
          label="Режим работы"
          value={form.hours ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
        />
        <Input
          label="SEO заголовок"
          value={form.seo_title ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
        />
        <Textarea
          label="SEO описание"
          value={form.seo_description ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
        />
        <Textarea
          label="Текст «О центре» (HTML)"
          value={form.about_html ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, about_html: e.target.value }))}
          className="min-h-[160px]"
        />
        <Button onClick={onSave} disabled={loading}>
          {loading ? "Сохраняем…" : "Сохранить контент"}
        </Button>
      </div>
    </div>
  );
}
