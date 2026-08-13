import type { ApiError } from "@/types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

export class ApiClientError extends Error {
  status: number;
  body: ApiError | null;

  constructor(message: string, status: number, body: ApiError | null = null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

type FetchOptions = RequestInit & {
  token?: string | null;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]) {
  const url = new URL(
    path.startsWith("http")
      ? path
      : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { token, searchParams, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const res = await fetch(buildUrl(path, searchParams), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    next: init.cache === "no-store" ? undefined : init.next,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!res.ok) {
    const body = (data as ApiError) ?? null;
    const message =
      typeof body?.detail === "string"
        ? body.detail
        : Array.isArray(body?.detail)
          ? body.detail.map((d) => d.msg).join(", ")
          : body?.message || `Ошибка запроса (${res.status})`;
    throw new ApiClientError(message, res.status, body);
  }

  return data as T;
}

export async function apiGet<T>(
  path: string,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(
  path: string,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "DELETE" });
}

/** Безопасный GET: при ошибке сети/API возвращает fallback */
export async function safeGet<T>(
  path: string,
  fallback: T,
  options?: Omit<FetchOptions, "method" | "body">,
): Promise<T> {
  try {
    return await apiGet<T>(path, {
      ...options,
      next: options?.next ?? { revalidate: 60 },
    });
  } catch {
    return fallback;
  }
}

export function unwrapList<T>(data: T[] | { items: T[] } | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}
