"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import planData from "@/lib/plan-data.json";

type HallKey = "all" | "yellow" | "green" | "blue";

const floorLabel = (floor: number | null) => {
  if (floor === null || floor === undefined) return "—";
  if (floor === -1) return "−1 этаж";
  if (floor === 0) return "Парковка";
  return `${floor} этаж`;
};

function parseHall(value?: string | null): HallKey {
  if (value === "yellow" || value === "green" || value === "blue") return value;
  return "all";
}

export function PlanExplorer({
  initialHall,
  initialQuery,
}: {
  initialHall?: string;
  initialQuery?: string;
} = {}) {
  const [hall, setHall] = useState<HallKey>(() => parseHall(initialHall));
  const [q, setQ] = useState(initialQuery ?? "");
  const [tab, setTab] = useState<"map" | "offices" | "directory">(
    initialQuery || (initialHall && initialHall !== "all") ? "offices" : "map",
  );

  const offices = useMemo(() => {
    const query = q.trim().toLowerCase();
    return planData.offices
      .filter((o) => (hall === "all" ? true : o.hall === hall))
      .filter((o) => {
        if (!query) return true;
        return (
          o.name.toLowerCase().includes(query) ||
          String(o.number).toLowerCase().includes(query) ||
          o.categories.some((c) => c.toLowerCase().includes(query))
        );
      })
      .sort((a, b) =>
        String(a.number).localeCompare(String(b.number), "ru", { numeric: true }),
      );
  }, [hall, q]);

  const directory = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return planData.product_directory;
    return planData.product_directory
      .map((block) => ({
        ...block,
        items: block.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.offices.some((n) => String(n).includes(query)),
        ),
      }))
      .filter((block) => block.items.length > 0);
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["map", "Планы этажей"],
            ["offices", "Офисы"],
            ["directory", "Поиск по товарам"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === key
                ? "bg-[var(--gvozd-red)] text-white"
                : "bg-[var(--gvozd-gray-100)] text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-200)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <label className="block">
          <span className="sr-only">Поиск по офису или товару</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Например: ламинат, двери, офис 40…"
            className="h-11 w-full rounded-md border border-[var(--gvozd-gray-200)] px-3 text-sm outline-none focus:border-[var(--gvozd-red)] focus:ring-2 focus:ring-[var(--gvozd-red)]/20"
          />
        </label>
        <p className="text-sm text-[var(--gvozd-gray-500)]">
          Информатор:{" "}
          <a className="font-semibold text-[var(--gvozd-red)]" href="tel:+73412908546">
            {planData.phone}
          </a>
        </p>
      </div>

      {tab === "map" && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-50)]">
            <Image
              src={planData.images.floors}
              alt="Планы этажей строительного центра Гвоздь: жёлтый, зелёный и синий залы"
              width={1600}
              height={1100}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {(
              [
                ["all", "Все залы", null],
                ...planData.halls.map((h) => [h.key, h.label, h.color] as const),
              ] as const
            ).map(([key, label, color]) => {
              const active = hall === key || (key === "all" && hall === "all");
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setHall(key as HallKey);
                    setTab("offices");
                  }}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-[var(--gvozd-graphite)] bg-[var(--gvozd-graphite)] text-white"
                      : "border-[var(--gvozd-gray-200)] bg-white hover:border-[var(--gvozd-red)]/40"
                  }`}
                >
                  {color ? (
                    <span className="h-3 w-3 rounded-full" style={{ background: color }} aria-hidden />
                  ) : null}
                  {label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {planData.entrances.map((e) => (
              <div key={e} className="rounded-lg border border-[var(--gvozd-gray-200)] bg-white px-3 py-2 text-sm">
                {e}
              </div>
            ))}
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {planData.legend.map((item) => (
              <li key={item.key} className="text-sm text-[var(--gvozd-gray-500)]">
                • {item.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "offices" && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "Все залы"],
                ["yellow", "Жёлтый"],
                ["green", "Зелёный"],
                ["blue", "Синий"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setHall(key)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  hall === key
                    ? "bg-[var(--gvozd-graphite)] text-white"
                    : "bg-[var(--gvozd-gray-100)] hover:bg-[var(--gvozd-gray-200)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--gvozd-gray-500)]">Найдено офисов: {offices.length}</p>
          <div className="overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--gvozd-gray-50)] text-[var(--gvozd-gray-500)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Офис</th>
                  <th className="px-4 py-3 font-semibold">Компания</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Зал</th>
                  <th className="hidden px-4 py-3 font-semibold lg:table-cell">Этаж</th>
                </tr>
              </thead>
              <tbody>
                {offices.map((o) => (
                  <tr key={`${o.number}-${o.name}`} className="border-t border-[var(--gvozd-gray-200)]">
                    <td className="px-4 py-3 font-semibold text-[var(--gvozd-red)]">{o.number}</td>
                    <td className="px-4 py-3">
                      <Link href={`/companies/${o.slug}`} className="font-medium hover:text-[var(--gvozd-red)]">
                        {o.name}
                      </Link>
                      {o.categories.length > 0 && (
                        <p className="mt-1 text-xs text-[var(--gvozd-gray-500)]">
                          {o.categories.slice(0, 4).join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">{o.hall_label}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">{floorLabel(o.floor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "directory" && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--gvozd-gray-200)]">
            <Image
              src={planData.images.directory}
              alt="Поисковая система товаров строительного центра Гвоздь"
              width={1600}
              height={1100}
              className="h-auto w-full"
            />
          </div>
          <div className="space-y-5">
            {directory.map((block) => (
              <div key={block.letter}>
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--gvozd-red)] text-sm font-black text-white">
                  {block.letter}
                </div>
                <ul className="grid gap-2 md:grid-cols-2">
                  {block.items.map((item) => (
                    <li
                      key={item.name}
                      className={`rounded-lg border px-3 py-2 ${
                        "highlight" in item && item.highlight
                          ? "border-[var(--gvozd-red)]/30 bg-[var(--gvozd-red)]/5"
                          : "border-[var(--gvozd-gray-200)] bg-white"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[var(--gvozd-graphite)]">{item.name}</p>
                      <p className="mt-1 text-xs text-[var(--gvozd-gray-500)]">
                        Офисы: {item.offices.join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
