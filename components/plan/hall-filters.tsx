"use client";

import { useMemo, useState } from "react";
import type { Company } from "@/types";
import { CompanyCard, PlanOfficeCard } from "@/components/catalog/cards";
import { getFeaturedPlanOffices, getPlanOffices } from "@/lib/plan-offices";
import planData from "@/lib/plan-data.json";

export type HallFilter = "all" | "yellow" | "green" | "blue";

export function HallFilterChips({
  value,
  onChange,
  counts,
}: {
  value: HallFilter;
  onChange: (hall: HallFilter) => void;
  counts?: Partial<Record<HallFilter, number>>;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по залу">
      <button
        type="button"
        onClick={() => onChange("all")}
        aria-pressed={value === "all"}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
          value === "all"
            ? "border-[var(--gvozd-red)] bg-[var(--gvozd-red)] text-white"
            : "border-[var(--gvozd-gray-200)] bg-white text-[var(--gvozd-graphite)] hover:border-[var(--gvozd-red)]/40"
        }`}
      >
        Все залы
        {typeof counts?.all === "number" ? <span className="opacity-80">({counts.all})</span> : null}
      </button>
      {planData.halls.map((hall) => {
        const key = hall.key as Exclude<HallFilter, "all">;
        const active = value === key;
        return (
          <button
            key={hall.key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "border-[var(--gvozd-graphite)] bg-[var(--gvozd-graphite)] text-white"
                : "border-[var(--gvozd-gray-200)] bg-white text-[var(--gvozd-graphite)] hover:border-[var(--gvozd-red)]/40"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: hall.color }}
              aria-hidden
            />
            {hall.label}
            {typeof counts?.[key] === "number" ? (
              <span className="opacity-80">({counts[key]})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function HomeOfficesFilter({ companies }: { companies: Company[] }) {
  const [hall, setHall] = useState<HallFilter>("all");

  const planSlice = useMemo(() => {
    if (hall === "all") return getFeaturedPlanOffices(6);
    return getPlanOffices()
      .filter((o) => o.hall === hall)
      .slice(0, 6);
  }, [hall]);

  const showApi = companies.length > 0 && hall === "all";

  return (
    <div className="space-y-6">
      <HallFilterChips value={hall} onChange={setHall} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showApi
          ? companies.slice(0, 6).map((c) => <CompanyCard key={String(c.id)} company={c} />)
          : planSlice.map((o) => <PlanOfficeCard key={o.slug} office={o} />)}
      </div>
    </div>
  );
}

export function CompaniesHallFilter({
  companies,
  initialHall,
  query,
}: {
  companies: Company[];
  initialHall?: string;
  query?: string;
}) {
  const parsed: HallFilter =
    initialHall === "yellow" || initialHall === "green" || initialHall === "blue"
      ? initialHall
      : "all";
  const [hall, setHall] = useState<HallFilter>(parsed);

  const offices = useMemo(() => {
    let list = getPlanOffices(query);
    if (hall !== "all") list = list.filter((o) => o.hall === hall);
    return list;
  }, [hall, query]);

  const counts = useMemo(() => {
    const all = getPlanOffices(query);
    return {
      all: all.length,
      yellow: all.filter((o) => o.hall === "yellow").length,
      green: all.filter((o) => o.hall === "green").length,
      blue: all.filter((o) => o.hall === "blue").length,
    };
  }, [query]);

  const showApi = companies.length > 0 && hall === "all";

  return (
    <div className="space-y-6">
      <HallFilterChips value={hall} onChange={setHall} counts={counts} />
      {showApi ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <CompanyCard key={String(c.id)} company={c} />
          ))}
        </div>
      ) : offices.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((o) => (
            <PlanOfficeCard key={o.slug} office={o} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--gvozd-gray-500)]">В этом зале ничего не найдено.</p>
      )}
    </div>
  );
}
