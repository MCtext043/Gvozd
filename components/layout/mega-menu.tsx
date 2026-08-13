"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-icons";
import { ROOT_CATEGORIES } from "@/lib/site";

export function MegaMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const roots =
    categories.filter((c) => !c.parent_id).length > 0
      ? categories.filter((c) => !c.parent_id).slice(0, 13)
      : ROOT_CATEGORIES.map((c, i) => ({
          id: i + 1,
          slug: c.slug,
          name: c.name,
          parent_id: null,
        }));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-[var(--gvozd-graphite)] hover:text-[var(--gvozd-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]",
          open && "text-[var(--gvozd-red)]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Каталог
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-[min(94vw,820px)] rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-5 shadow-xl"
          role="menu"
          aria-label="Категории каталога"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gvozd-red)]">
              Категории товаров
            </p>
            <Link
              href="/catalog"
              className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline"
              onClick={() => setOpen(false)}
            >
              Весь каталог
            </Link>
          </div>
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {roots.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <li key={String(cat.id ?? cat.slug)}>
                  <Link
                    role="menuitem"
                    href={`/catalog/${cat.slug}`}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-50)] hover:text-[var(--gvozd-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--gvozd-red)]/10 text-[var(--gvozd-red)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
