"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { getAdminBanners, saveBanner } from "@/services/api";
import { apiDelete } from "@/lib/api";
import type { Banner } from "@/types";

const empty: Partial<Banner> = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  button_text: "Подробнее",
  starts_at: "",
  ends_at: "",
  is_active: true,
  sort_order: 0,
};

function statusOf(b: Banner): Banner["status"] {
  if (b.status) return b.status;
  if (!b.is_active) return "draft";
  const now = Date.now();
  const start = b.starts_at ? new Date(b.starts_at).getTime() : null;
  const end = b.ends_at ? new Date(b.ends_at).getTime() : null;
  if (start && start > now) return "scheduled";
  if (end && end < now) return "expired";
  return "active";
}

const statusTone = {
  draft: "gray",
  scheduled: "amber",
  active: "green",
  expired: "gray",
} as const;

const statusLabel = {
  draft: "Черновик",
  scheduled: "Запланирован",
  active: "Активен",
  expired: "Истёк",
} as const;

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState<Partial<Banner>>(empty);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    try {
      setItems(await getAdminBanners(token));
    } catch {
      setItems([]);
      setError("Не удалось загрузить баннеры из API.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const preview = useMemo(() => form, [form]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await saveBanner(token, {
        ...form,
        id: editingId ?? undefined,
      });
      setMessage(editingId ? "Баннер обновлён" : "Баннер создан");
      setForm(empty);
      setEditingId(null);
      await load();
    } catch {
      setError("Ошибка сохранения. Проверьте поля и API.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string | number) {
    if (!token || !confirm("Удалить баннер?")) return;
    try {
      await apiDelete(`/admin/banners/${id}`, { token, cache: "no-store" });
      await load();
    } catch {
      setError("Не удалось удалить баннер.");
    }
  }

  function edit(banner: Banner) {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url,
      link_url: banner.link_url ?? "",
      button_text: banner.button_text ?? "",
      starts_at: banner.starts_at?.slice(0, 16) ?? "",
      ends_at: banner.ends_at?.slice(0, 16) ?? "",
      is_active: banner.is_active ?? true,
      sort_order: banner.sort_order ?? 0,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Баннеры</h2>
        <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
          CRUD с расписанием, статусами и предпросмотром.
        </p>
      </div>

      {message ? (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-5">
          <h3 className="font-semibold">{editingId ? "Редактирование" : "Новый баннер"}</h3>
          <Input
            label="Заголовок"
            required
            value={form.title ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Textarea
            label="Подзаголовок"
            value={form.subtitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
          <Input
            label="URL изображения"
            required
            value={form.image_url ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
          />
          <Input
            label="Ссылка"
            value={form.link_url ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
          />
          <Input
            label="Текст кнопки"
            value={form.button_text ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, button_text: e.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Начало показа"
              type="datetime-local"
              value={form.starts_at ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
            />
            <Input
              label="Конец показа"
              type="datetime-local"
              value={form.ends_at ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Активен
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Сохраняем…" : editingId ? "Сохранить" : "Создать"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Отмена
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border bg-[var(--gvozd-graphite)] text-white">
            <div className="relative flex min-h-[180px] flex-col justify-end p-5">
              {preview.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.image_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              ) : null}
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-[var(--gvozd-red)]">Превью</p>
                <h3 className="mt-1 text-xl font-bold">{preview.title || "Заголовок баннера"}</h3>
                <p className="mt-1 text-sm text-white/80">
                  {preview.subtitle || "Подзаголовок"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white">
            <ul className="divide-y">
              {items.length === 0 ? (
                <li className="p-5 text-sm text-[var(--gvozd-gray-500)]">Баннеров пока нет</li>
              ) : (
                items.map((b) => {
                  const st = statusOf(b) ?? "draft";
                  return (
                    <li key={String(b.id)} className="flex items-start justify-between gap-3 p-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{b.title}</p>
                          <Badge tone={statusTone[st]}>{statusLabel[st]}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-[var(--gvozd-gray-500)]">
                          {b.starts_at || "без начала"} — {b.ends_at || "без конца"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => edit(b)}>
                          Изменить
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDelete(b.id)}>
                          Удалить
                        </Button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
