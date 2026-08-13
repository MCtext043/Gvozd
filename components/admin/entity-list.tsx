"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { apiGet, unwrapList } from "@/lib/api";

export function AdminEntityList({
  title,
  description,
  endpoint,
  publicHref,
  renderItem,
}: {
  title: string;
  description: string;
  endpoint: string;
  publicHref: string;
  renderItem: (item: Record<string, unknown>, index: number) => React.ReactNode;
}) {
  const { token } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet(endpoint, { token, cache: "no-store" })
      .then((data) => setItems(unwrapList(data as never) as Record<string, unknown>[]))
      .catch(() => {
        setItems([]);
        setError("Данные недоступны — запустите API или проверьте права доступа.");
      });
  }, [token, endpoint]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">{description}</p>
        </div>
        <Link href={publicHref} className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
          Открыть на сайте
        </Link>
      </div>
      {error ? (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>
      ) : null}
      <div className="overflow-hidden rounded-xl border bg-white">
        <ul className="divide-y">
          {items.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-[var(--gvozd-gray-500)]">
              Записей пока нет
            </li>
          ) : (
            items.map((item, i) => (
              <li key={String(item.id ?? i)} className="px-5 py-4">
                {renderItem(item, i)}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
