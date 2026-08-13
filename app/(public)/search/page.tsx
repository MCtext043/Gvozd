import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { SearchAutocomplete } from "@/components/forms/search-autocomplete";
import { SearchFilters } from "@/components/catalog/filters";
import { CategoryCard, CompanyCard, NewsCard, PromotionCard } from "@/components/catalog/cards";
import { searchAll } from "@/services/api";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск по категориям, компаниям, акциям и новостям СЦ «Гвоздь».",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = "", type } = await searchParams;
  const results = await searchAll(q, { type });

  const showCategories = !type || type === "categories";
  const showCompanies = !type || type === "companies";
  const showPromotions = !type || type === "promotions";
  const showNews = !type || type === "news";

  const total =
    results.total ||
    results.categories.length +
      results.companies.length +
      results.promotions.length +
      results.news.length;

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Поиск" },
          ]}
        />
        <SectionHeading
          eyebrow="Поиск"
          title={q ? `Результаты по запросу «${q}»` : "Поиск по центру"}
          description="Категории, компании, акции и новости."
        />

        <div className="mb-6 max-w-2xl">
          <SearchAutocomplete initialQuery={q} autoFocus={!q} />
        </div>

        <Suspense fallback={null}>
          <SearchFilters type={type} />
        </Suspense>

        {!q.trim() ? (
          <EmptyState
            className="mt-8"
            title="Введите запрос"
            description="Например: плитка, сантехника, офис или название компании."
          />
        ) : total === 0 ? (
          <EmptyState
            className="mt-8"
            title="Ничего не найдено"
            description="Попробуйте другой запрос или свяжитесь со службой информации."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contacts" className="text-sm font-semibold text-[var(--gvozd-red)]">
                  Связаться с нами
                </Link>
                <a href={SITE.phoneHref} className="text-sm font-semibold">
                  {SITE.phone}
                </a>
              </div>
            }
          />
        ) : (
          <div className="mt-10 space-y-12">
            {showCategories && results.categories.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-bold">Категории</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.categories.map((c) => (
                    <CategoryCard key={String(c.id)} category={c} />
                  ))}
                </div>
              </section>
            ) : null}
            {showCompanies && results.companies.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-bold">Компании</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.companies.map((c) => (
                    <CompanyCard key={String(c.id)} company={c} />
                  ))}
                </div>
              </section>
            ) : null}
            {showPromotions && results.promotions.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-bold">Акции</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.promotions.map((c) => (
                    <PromotionCard key={String(c.id)} item={c} />
                  ))}
                </div>
              </section>
            ) : null}
            {showNews && results.news.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-bold">Новости</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.news.map((c) => (
                    <NewsCard key={String(c.id)} item={c} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </Container>
    </div>
  );
}
