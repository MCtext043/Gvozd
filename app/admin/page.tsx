"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats } from "@/services/api";
import type { DashboardStats } from "@/types";

const cards: { key: keyof DashboardStats; label: string; href: string }[] = [
  { key: "leads_new", label: "Новые заявки", href: "/admin/leads" },
  { key: "leads_total", label: "Всего заявок", href: "/admin/leads" },
  { key: "companies", label: "Компании", href: "/admin/companies" },
  { key: "categories", label: "Категории", href: "/admin/categories" },
  { key: "promotions_active", label: "Активные акции", href: "/admin/promotions" },
  { key: "news_published", label: "Новости", href: "/admin/news" },
  { key: "banners_active", label: "Баннеры", href: "/admin/banners" },
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getDashboardStats(token)
      .then(setStats)
      .catch(() => {
        setError("Не удалось загрузить статистику. Проверьте API.");
        setStats({
          leads_new: 0,
          leads_total: 0,
          companies: 0,
          categories: 13,
          promotions_active: 0,
          news_published: 0,
          banners_active: 0,
        });
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Обзор</h2>
        <p className="mt-1 text-sm text-[var(--gvozd-gray-500)]">
          Сводка по контенту и заявкам строительного центра.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-5 shadow-sm transition hover:border-[var(--gvozd-red)]/40"
          >
            <p className="text-sm text-[var(--gvozd-gray-500)]">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--gvozd-black)]">
              {stats ? stats[card.key] : "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
