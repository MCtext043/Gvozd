export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type Category = {
  id: number | string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: number | string | null;
  children?: Category[];
  companies_count?: number;
  sort_order?: number;
};

export type Company = {
  id: number | string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  office_number?: string | null;
  assortment?: string | null;
  services?: string | null;
  categories?: Category[];
  is_active?: boolean;
};

export type Promotion = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  published_at?: string | null;
};

export type NewsItem = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  is_published?: boolean;
};

export type Banner = {
  id: number | string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  button_text?: string | null;
  sort_order?: number;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  status?: "draft" | "scheduled" | "active" | "expired";
};

export type PopupConfig = {
  id: number | string;
  title: string;
  content?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  delay_ms?: number;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type LeadStatus = "new" | "in_progress" | "done" | "spam";

export type Lead = {
  id: number | string;
  name: string;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  source?: string | null;
  company_slug?: string | null;
  status: LeadStatus;
  created_at: string;
  honeypot?: string | null;
};

export type SiteSettings = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  about_html?: string;
  seo_title?: string;
  seo_description?: string;
};

export type SearchResult = {
  categories: Category[];
  companies: Company[];
  promotions: Promotion[];
  news: NewsItem[];
  query: string;
  total: number;
};

export type DashboardStats = {
  leads_new: number;
  leads_total: number;
  companies: number;
  categories: number;
  promotions_active: number;
  news_published: number;
  banners_active: number;
};

export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
};

export type AdminUser = {
  id: number | string;
  email: string;
  name?: string | null;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR";
  is_active?: boolean;
};

export type ApiError = {
  detail?: string | { msg: string }[];
  message?: string;
};
