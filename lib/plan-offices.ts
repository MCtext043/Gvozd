import planData from "@/lib/plan-data.json";

export type PlanOffice = (typeof planData.offices)[number];

export function getPlanOffices(query?: string): PlanOffice[] {
  const q = query?.trim().toLowerCase() ?? "";
  const list = [...planData.offices].sort((a, b) =>
    String(a.number).localeCompare(String(b.number), "ru", { numeric: true }),
  );
  if (!q) return list;
  return list.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      String(o.number).toLowerCase().includes(q) ||
      o.categories.some((c) => c.toLowerCase().includes(q)) ||
      o.hall_label.toLowerCase().includes(q),
  );
}

/** Разнообразный срез для главной: по одному из каждого зала + известные точки */
export function getFeaturedPlanOffices(limit = 6): PlanOffice[] {
  const picked: PlanOffice[] = [];
  const seen = new Set<string>();
  for (const hall of ["green", "yellow", "blue"] as const) {
    const hit = planData.offices.find((o) => o.hall === hall && !seen.has(o.slug));
    if (hit) {
      picked.push(hit);
      seen.add(hit.slug);
    }
  }
  for (const o of planData.offices) {
    if (picked.length >= limit) break;
    if (seen.has(o.slug)) continue;
    picked.push(o);
    seen.add(o.slug);
  }
  return picked.slice(0, limit);
}

export function hallDotClass(hall: string) {
  if (hall === "yellow") return "bg-[#F5C518]";
  if (hall === "green") return "bg-[#2E9B4F]";
  if (hall === "blue") return "bg-[#2F6FED]";
  return "bg-[var(--gvozd-gray-400)]";
}

export function floorLabel(floor: number | null | undefined) {
  if (floor === null || floor === undefined) return null;
  if (floor === -1) return "−1 этаж";
  if (floor === 0) return "Парковка";
  return `${floor} этаж`;
}
