"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { getAdminLeads, updateLeadStatus } from "@/services/api";
import { unwrapList } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";

const statuses: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Закрыта" },
  { value: "spam", label: "Спам" },
];

export default function AdminLeadsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function load(status?: string) {
    if (!token) return;
    try {
      const data = await getAdminLeads(token, { status: status || undefined });
      setItems(unwrapList(data as Lead[] | { items: Lead[] }));
      setError(null);
    } catch {
      setItems([]);
      setError("Не удалось загрузить заявки.");
    }
  }

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filter]);

  async function changeStatus(id: string | number, status: LeadStatus) {
    if (!token) return;
    try {
      await updateLeadStatus(token, id, status);
      await load(filter);
    } catch {
      setError("Не удалось обновить статус.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Заявки</h2>
          <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
            Обращения с сайта, карточек компаний и формы аренды.
          </p>
        </div>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--gvozd-gray-500)]">Статус</span>
          <select
            className="h-10 rounded-md border border-[var(--gvozd-gray-300)] bg-white px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Все</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--gvozd-gray-50)] text-[var(--gvozd-gray-500)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Имя</th>
              <th className="px-4 py-3 font-semibold">Контакты</th>
              <th className="px-4 py-3 font-semibold">Источник</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--gvozd-gray-500)]">
                  Заявок пока нет
                </td>
              </tr>
            ) : (
              items.map((lead) => (
                <tr key={String(lead.id)} className="border-t align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(lead.created_at) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lead.name}</p>
                    {lead.message ? (
                      <p className="mt-1 max-w-xs text-xs text-[var(--gvozd-gray-500)] line-clamp-2">
                        {lead.message}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <p>{lead.phone || "—"}</p>
                    <p className="text-xs text-[var(--gvozd-gray-500)]">{lead.email || ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="gray">{lead.source || "сайт"}</Badge>
                    {lead.company_slug ? (
                      <p className="mt-1 text-xs">{lead.company_slug}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="h-9 rounded-md border border-[var(--gvozd-gray-300)] px-2"
                      value={lead.status}
                      onChange={(e) => changeStatus(lead.id, e.target.value as LeadStatus)}
                      aria-label={`Статус заявки ${lead.name}`}
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
