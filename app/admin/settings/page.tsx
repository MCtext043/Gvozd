"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { apiGet, apiPut } from "@/lib/api";
import { SITE } from "@/lib/site";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [siteUrl, setSiteUrl] = useState(SITE.url);
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<{ site_url?: string; maintenance?: boolean }>("/admin/settings/app", {
      token,
      cache: "no-store",
    })
      .then((data) => {
        if (data.site_url) setSiteUrl(data.site_url);
        if (typeof data.maintenance === "boolean") setMaintenance(data.maintenance);
      })
      .catch(() => undefined);
  }, [token]);

  async function save() {
    if (!token) return;
    try {
      await apiPut(
        "/admin/settings/app",
        { site_url: siteUrl, maintenance },
        { token, cache: "no-store" },
      );
      setMessage("Настройки сохранены");
    } catch {
      setMessage("API недоступен — изменения не сохранены на сервере.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки</h2>
        <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
          Параметры сайта и режима обслуживания.
        </p>
      </div>
      {message ? (
        <p className="rounded-md bg-[var(--gvozd-gray-100)] px-4 py-3 text-sm">{message}</p>
      ) : null}
      <div className="max-w-xl space-y-4 rounded-xl border bg-white p-5">
        <Input
          label="Публичный URL сайта"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
          />
          Режим обслуживания
        </label>
        <Button onClick={save}>Сохранить настройки</Button>
      </div>
    </div>
  );
}
