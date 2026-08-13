"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { Category } from "@/types";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { MegaMenu } from "@/components/layout/mega-menu";
import { SearchAutocomplete } from "@/components/forms/search-autocomplete";

export function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gvozd-gray-200)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          <MegaMenu categories={categories} />
          {NAV_LINKS.filter((l) => l.href !== "/catalog").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--gvozd-graphite)] hover:text-[var(--gvozd-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right text-sm">
            <a
              href={SITE.phoneHref}
              className="block font-bold text-[var(--gvozd-black)] hover:text-[var(--gvozd-red)]"
            >
              {SITE.phone}
            </a>
            <span className="text-xs text-[var(--gvozd-gray-500)]">{SITE.hours.short}</span>
          </div>
          <Link
            href="/contacts#lead"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
          >
            Связаться
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--gvozd-gray-200)] lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Меню</span>
        </button>
      </div>

      <div className="border-t border-[var(--gvozd-gray-100)] bg-[var(--gvozd-gray-50)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
          <SearchAutocomplete />
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-nav" className="border-t border-[var(--gvozd-gray-200)] bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-base font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SITE.phoneHref}
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-[var(--gvozd-red)] px-3 py-3 font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
