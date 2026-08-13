"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getAdminPopup, savePopup } from "@/services/api";
import type { PopupConfig } from "@/types";

export default function AdminPopupPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<Partial<PopupConfig>>({
    title: "",
    content: "",
    image_url: "",
    button_text: "Подробнее",
    button_url: "",
    delay_ms: 2500,
    is_active: false,
    starts_at: "",
    ends_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getAdminPopup(token)
      .then((data) => {
        const item = Array.isArray(data) ? data[0] : data;
        if (item) {
          setForm({
            ...item,
            starts_at: item.starts_at?.slice(0, 16) ?? "",
            ends_at: item.ends_at?.slice(0, 16) ?? "",
          });
        }
      })
      .catch(() => setError("Не удалось загрузить popup из API."));
  }, [token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await savePopup(token, form);
      setMessage("Popup сохранён");
    } catch {
      setError("Ошибка сохранения popup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Popup</h2>
        <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
          Всплывающее окно на сайте: задержка, расписание, показ один раз (localStorage).
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
          <Input
            label="Заголовок"
            required
            value={form.title ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Textarea
            label="Текст"
            value={form.content ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          />
          <Input
            label="URL изображения"
            value={form.image_url ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
          />
          <Input
            label="Текст кнопки"
            value={form.button_text ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, button_text: e.target.value }))}
          />
          <Input
            label="Ссылка кнопки"
            value={form.button_url ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, button_url: e.target.value }))}
          />
          <Input
            label="Задержка, мс"
            type="number"
            value={String(form.delay_ms ?? 2500)}
            onChange={(e) => setForm((f) => ({ ...f, delay_ms: Number(e.target.value) }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Начало"
              type="datetime-local"
              value={form.starts_at ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
            />
            <Input
              label="Конец"
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
            Активен на сайте
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохраняем…" : "Сохранить popup"}
          </Button>
        </form>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gvozd-red)]">
            Превью
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border shadow-lg">
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="" className="h-36 w-full object-cover" />
            ) : (
              <div className="flex h-36 items-center justify-center bg-[var(--gvozd-gray-100)] text-sm text-[var(--gvozd-gray-500)]">
                Без изображения
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-bold">{form.title || "Заголовок popup"}</h3>
              <p className="mt-2 text-sm text-[var(--gvozd-gray-500)]">
                {form.content || "Текст сообщения"}
              </p>
              <div className="mt-4 inline-flex h-10 items-center rounded-md bg-[var(--gvozd-red)] px-4 text-sm font-semibold text-white">
                {form.button_text || "Подробнее"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
