"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchSuggest } from "@/services/api";
import type { Category, Company } from "@/types";
import { cn } from "@/lib/utils";

export function SearchAutocomplete({
  className,
  compact = false,
  initialQuery = "",
  autoFocus = false,
}: {
  className?: string;
  compact?: boolean;
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = [
    ...categories.map((c) => ({
      type: "category" as const,
      href: `/catalog/${c.slug}`,
      label: c.name,
    })),
    ...companies.map((c) => ({
      type: "company" as const,
      href: `/companies/${c.slug}`,
      label: c.name,
      hint: c.office_number ? `Офис ${c.office_number}` : undefined,
    })),
  ];

  const fetchSuggest = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setCategories([]);
      setCompanies([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchSuggest(q);
      setCategories(data.categories ?? []);
      setCompanies(data.companies ?? []);
    } catch {
      setCategories([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchSuggest(query), 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, fetchSuggest]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goSearch(q = query) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        router.push(items[activeIndex].href);
        setOpen(false);
      } else {
        e.preventDefault();
        goSearch();
      }
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <label className="sr-only" htmlFor="global-search">
        Поиск по центру
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gvozd-gray-500)]"
          aria-hidden
        />
        <input
          id="global-search"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={compact ? "Поиск…" : "Найти товар, категорию или отдел"}
          className={cn(
            "h-11 w-full rounded-md border border-[var(--gvozd-gray-300)] bg-white pl-10 pr-10 text-sm text-[var(--gvozd-black)] placeholder:text-[var(--gvozd-gray-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]",
            compact && "h-10",
          )}
        />
        {query ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--gvozd-gray-500)] hover:text-[var(--gvozd-black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
            aria-label="Очистить поиск"
            onClick={() => {
              setQuery("");
              setCategories([]);
              setCompanies([]);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open && query.trim().length >= 2 ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-[var(--gvozd-gray-200)] bg-white py-2 shadow-lg"
        >
          {loading ? (
            <p className="px-4 py-3 text-sm text-[var(--gvozd-gray-500)]">Ищем…</p>
          ) : items.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-sm text-[var(--gvozd-gray-500)]">Ничего не найдено в подсказках</p>
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-[var(--gvozd-red)] hover:underline"
                onClick={() => goSearch()}
              >
                Искать «{query}» по сайту
              </button>
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <Link
                  key={`${item.type}-${item.href}`}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[var(--gvozd-gray-50)]",
                    activeIndex === index && "bg-[var(--gvozd-gray-50)]",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className="font-medium text-[var(--gvozd-black)]">{item.label}</span>
                  <span className="text-xs text-[var(--gvozd-gray-500)]">
                    {item.type === "category" ? "Категория" : item.hint ?? "Компания"}
                  </span>
                </Link>
              ))}
              <button
                type="button"
                className="mt-1 w-full border-t border-[var(--gvozd-gray-100)] px-4 py-2.5 text-left text-sm font-semibold text-[var(--gvozd-red)] hover:bg-[var(--gvozd-gray-50)]"
                onClick={() => goSearch()}
              >
                Все результаты по запросу «{query}»
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
