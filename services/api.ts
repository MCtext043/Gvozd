import { apiGet, apiPost, apiPut, apiPatch, safeGet, unwrapList } from "@/lib/api";
import {
  catalogIndexRoots,
  categoryFromCatalogIndex,
  companiesForCatalogSlug,
} from "@/lib/catalog-from-plan";
import catalogIndex from "@/lib/catalog-index.json";
import type {
  AuthTokens,
  Banner,
  Category,
  Company,
  DashboardStats,
  Lead,
  NewsItem,
  Paginated,
  PopupConfig,
  Promotion,
  SearchResult,
  SiteSettings,
} from "@/types";

function asList<T>(data: T[] | Paginated<T> | null | undefined): T[] {
  return unwrapList(data as T[] | { items: T[] } | null | undefined);
}

export async function getCategories(): Promise<Category[]> {
  const data = await safeGet<Category[] | Paginated<Category>>("/categories", []);
  const list = asList(data);
  if (list.length > 0) return list;
  return catalogIndexRoots();
}

export async function getCategory(slug: string): Promise<Category | null> {
  const fromApi = await safeGet<Category | null>(`/categories/${slug}`, null);
  if (fromApi) return fromApi;
  return categoryFromCatalogIndex(slug);
}

export async function getCompanies(params?: {
  category?: string;
  q?: string;
  page?: number;
}): Promise<Company[]> {
  const data = await safeGet<Company[] | Paginated<Company>>(
    "/companies",
    [],
    { searchParams: params },
  );
  const list = asList(data);
  if (list.length > 0) return list;
  if (params?.category) {
    let items = companiesForCatalogSlug(params.category);
    if (params.q) {
      const q = params.q.trim().toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          String(c.office_number ?? "").includes(q) ||
          (c.assortment ?? "").toLowerCase().includes(q),
      );
    }
    return items;
  }
  if (params?.q) {
    const q = params.q.trim().toLowerCase();
    return Object.values(
      Object.fromEntries(
        catalogIndexRoots().flatMap((root) =>
          companiesForCatalogSlug(root.slug).map((c) => [c.slug, c]),
        ),
      ),
    ).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        String(c.office_number ?? "").includes(q),
    );
  }
  return [];
}

export async function getCompany(slug: string): Promise<Company | null> {
  const fromApi = await safeGet<Company | null>(`/companies/${slug}`, null);
  if (fromApi) return fromApi;
  const byRoot = catalogIndex.by_root as Record<string, { id: string; slug: string; name: string; office_number: string; categories: { id: string; slug: string; name: string }[] }[]>;
  for (const list of Object.values(byRoot)) {
    const hit = list.find((c) => c.slug === slug);
    if (hit) {
      return {
        id: hit.id,
        slug: hit.slug,
        name: hit.name,
        office_number: hit.office_number,
        assortment: hit.categories.map((x) => x.name).join(", "),
        categories: hit.categories,
      };
    }
  }
  return null;
}

export async function getPromotions(): Promise<Promotion[]> {
  return asList(await safeGet<Promotion[] | Paginated<Promotion>>("/promotions", []));
}

export async function getPromotion(slug: string): Promise<Promotion | null> {
  return safeGet<Promotion | null>(`/promotions/${slug}`, null);
}

export async function getNews(): Promise<NewsItem[]> {
  return asList(await safeGet<NewsItem[] | Paginated<NewsItem>>("/news", []));
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  return safeGet<NewsItem | null>(`/news/${slug}`, null);
}

export async function getBanners(): Promise<Banner[]> {
  return asList(await safeGet<Banner[] | Paginated<Banner>>("/banners/active", []));
}

export async function getActivePopup(): Promise<PopupConfig | null> {
  const data = await safeGet<PopupConfig[] | PopupConfig | null>("/popups/active", null);
  if (!data) return null;
  if (Array.isArray(data)) {
    const first = data[0];
    if (!first) return null;
    return {
      ...first,
      delay_ms: (first as PopupConfig).delay_ms ?? (first as { display_delay?: number }).display_delay ?? 2500,
    };
  }
  return data;
}

export async function getSettings(): Promise<SiteSettings> {
  return safeGet<SiteSettings>("/settings", {});
}

export async function searchAll(q: string, filters?: {
  type?: string;
  category?: string;
}): Promise<SearchResult> {
  const empty: SearchResult = {
    query: q,
    total: 0,
    categories: [],
    companies: [],
    promotions: [],
    news: [],
  };
  if (!q.trim()) return empty;
  return safeGet<SearchResult>("/search", empty, {
    searchParams: { q, ...filters },
  });
}

export async function searchSuggest(q: string): Promise<{
  categories: Category[];
  companies: Company[];
}> {
  if (!q.trim() || q.trim().length < 2) {
    return { categories: [], companies: [] };
  }
  return safeGet("/search/suggest", { categories: [], companies: [] }, {
    searchParams: { q },
    cache: "no-store",
  });
}

export async function submitLead(payload: Record<string, unknown>) {
  return apiPost<{ id: number | string; ok?: boolean }>("/leads", payload, {
    cache: "no-store",
  });
}

export async function submitArenda(payload: Record<string, unknown>) {
  return apiPost<{ id: number | string; ok?: boolean }>("/leads/arenda", payload, {
    cache: "no-store",
  });
}

export async function adminLogin(email: string, password: string) {
  return apiPost<AuthTokens>("/admin/auth/login", { email, password }, {
    cache: "no-store",
  });
}

export async function getDashboardStats(token: string) {
  return apiGet<DashboardStats>("/admin/dashboard", {
    token,
    cache: "no-store",
  });
}

export async function getAdminLeads(token: string, params?: { status?: string; page?: number }) {
  return apiGet<Lead[] | Paginated<Lead>>("/admin/leads", {
    token,
    cache: "no-store",
    searchParams: params,
  });
}

export async function updateLeadStatus(
  token: string,
  id: string | number,
  status: string,
) {
  return apiPatch(`/admin/leads/${id}`, { status }, { token, cache: "no-store" });
}

export async function getAdminBanners(token: string) {
  return asList(
    await apiGet<Banner[] | Paginated<Banner>>("/admin/banners", {
      token,
      cache: "no-store",
    }),
  );
}

export async function saveBanner(
  token: string,
  data: Partial<Banner> & { id?: string | number },
) {
  if (data.id) {
    return apiPut(`/admin/banners/${data.id}`, data, { token, cache: "no-store" });
  }
  return apiPost("/admin/banners", data, { token, cache: "no-store" });
}

export async function deleteBanner(token: string, id: string | number) {
  const { apiDelete } = await import("@/lib/api");
  return apiDelete(`/admin/banners/${id}`, { token, cache: "no-store" });
}

export async function getAdminPopup(token: string) {
  return apiGet<PopupConfig | PopupConfig[]>("/admin/popups", {
    token,
    cache: "no-store",
  });
}

export async function savePopup(token: string, data: Partial<PopupConfig>) {
  if (data.id) {
    return apiPut(`/admin/popups/${data.id}`, data, { token, cache: "no-store" });
  }
  return apiPost("/admin/popups", data, { token, cache: "no-store" });
}
