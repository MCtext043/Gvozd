import catalogIndex from "@/lib/catalog-index.json";
import type { Category, Company } from "@/types";
import { ROOT_CATEGORIES } from "@/lib/site";

type IndexCompany = {
  id: string;
  slug: string;
  name: string;
  office_number: string;
  categories: { id: string; slug: string; name: string }[];
};

function toCompany(c: IndexCompany): Company {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    office_number: c.office_number,
    assortment: c.categories.map((x) => x.name).join(", "),
    categories: c.categories,
  };
}

export function catalogIndexRoots(): Category[] {
  const counts = catalogIndex.totals.by_root as Record<string, number>;
  return ROOT_CATEGORIES.map((c, i) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    companies_count: counts[c.slug] ?? 0,
    sort_order: i,
    children: (catalogIndex.subcategories as { name: string; slug: string; parent_slug: string; companies_count: number }[])
      .filter((s) => s.parent_slug === c.slug && s.companies_count > 0)
      .map((s) => ({
        id: s.slug,
        slug: s.slug,
        name: s.name,
        parent_id: c.slug,
        companies_count: s.companies_count,
      })),
  }));
}

export function companiesForCatalogSlug(slug: string): Company[] {
  const byRoot = catalogIndex.by_root as Record<string, IndexCompany[]>;
  const byLabel = catalogIndex.by_label_slug as Record<string, IndexCompany[]>;
  if (byRoot[slug]) return byRoot[slug].map(toCompany);
  if (byLabel[slug]) return byLabel[slug].map(toCompany);
  return [];
}

export function categoryFromCatalogIndex(slug: string): Category | null {
  const root = ROOT_CATEGORIES.find((c) => c.slug === slug);
  if (root) {
    const tree = catalogIndexRoots().find((c) => c.slug === slug);
    return tree ?? { id: root.slug, slug: root.slug, name: root.name };
  }
  const sub = (catalogIndex.subcategories as { name: string; slug: string; parent_slug: string; companies_count: number }[]).find(
    (s) => s.slug === slug,
  );
  if (!sub) return null;
  return {
    id: sub.slug,
    slug: sub.slug,
    name: sub.name,
    parent_id: sub.parent_slug,
    companies_count: sub.companies_count,
  };
}
