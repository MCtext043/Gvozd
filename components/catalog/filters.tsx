"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, X } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CatalogFilters({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const roots = categories.filter((c) => !c.parent_id);

  const content = (
    <nav aria-label="Фильтр категорий">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gvozd-red)]">
        Категории
      </p>
      <ul className="space-y-1">
        <li>
          <Link
            href="/catalog"
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium",
              !activeSlug
                ? "bg-[var(--gvozd-red)] text-white"
                : "text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-50)]",
            )}
            onClick={() => setOpen(false)}
          >
            Все категории
          </Link>
        </li>
        {roots.map((cat) => (
          <li key={String(cat.id)}>
            <Link
              href={`/catalog/${cat.slug}`}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                activeSlug === cat.slug
                  ? "bg-[var(--gvozd-red)] text-white"
                  : "text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-50)]",
              )}
              onClick={() => setOpen(false)}
              aria-current={activeSlug === cat.slug ? "page" : undefined}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="mb-4 lg:hidden">
        <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-4">
          {content}
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Фильтры">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Закрыть фильтры"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-auto rounded-t-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-[var(--gvozd-gray-50)]"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SearchFilters({
  type,
}: {
  type?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const options = [
    { value: "", label: "Все" },
    { value: "categories", label: "Категории" },
    { value: "companies", label: "Компании" },
    { value: "promotions", label: "Акции" },
    { value: "news", label: "Новости" },
  ];

  function setType(value: string) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (value) next.set("type", value);
    router.push(`/search?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Тип результатов">
      {options.map((opt) => (
        <button
          key={opt.value || "all"}
          type="button"
          onClick={() => setType(opt.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
            (type ?? "") === opt.value
              ? "bg-[var(--gvozd-red)] text-white"
              : "bg-[var(--gvozd-gray-100)] text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-200)]",
          )}
          aria-pressed={(type ?? "") === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
