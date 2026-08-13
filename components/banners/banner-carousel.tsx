"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;

  const next = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [count, next]);

  if (!count) {
    return (
      <section
        className="relative overflow-hidden bg-[var(--gvozd-graphite)] text-white"
        aria-label="Главный баннер"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,30,36,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0.06)_42%,transparent_42%)]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[520px] lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gvozd-red)]">
            {SITE.fullName}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {SITE.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{SITE.slogan}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center rounded-md bg-[var(--gvozd-red)] px-6 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center rounded-md border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Получить консультацию
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[index];

  return (
    <section className="relative overflow-hidden bg-[var(--gvozd-graphite)]" aria-roledescription="carousel" aria-label="Баннеры">
      <div className="relative min-h-[380px] lg:min-h-[480px]">
        {banners.map((banner, i) => (
          <div
            key={String(banner.id)}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i !== index}
          >
            {banner.image_url ? (
              <Image
                src={banner.image_url}
                alt=""
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          </div>
        ))}

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:min-h-[480px] lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gvozd-red)]">
            {SITE.name}
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
            {current.title || SITE.tagline}
          </h1>
          {current.subtitle ? (
            <p className="mt-4 max-w-xl text-lg text-white/85">{current.subtitle}</p>
          ) : (
            <p className="mt-4 max-w-xl text-lg text-white/85">{SITE.slogan}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {current.link_url ? (
              <Link
                href={current.link_url}
                className="inline-flex h-12 items-center rounded-md bg-[var(--gvozd-red)] px-6 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
              >
                {current.button_text || "Подробнее"}
              </Link>
            ) : (
              <Link
                href="/catalog"
                className="inline-flex h-12 items-center rounded-md bg-[var(--gvozd-red)] px-6 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
              >
                Смотреть каталог
              </Link>
            )}
            <Link
              href="/search"
              className="inline-flex h-12 items-center rounded-md border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Найти товар
            </Link>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Предыдущий баннер"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Следующий баннер"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Слайды баннеров">
            {banners.map((b, i) => (
              <button
                key={String(b.id)}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Слайд ${i + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  i === index ? "bg-[var(--gvozd-red)]" : "bg-white/50 hover:bg-white",
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
