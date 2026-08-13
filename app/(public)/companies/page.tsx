import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { CompanyCard, PlanOfficeCard } from "@/components/catalog/cards";
import { getCompanies } from "@/services/api";
import { getPlanOffices } from "@/lib/plan-offices";
import planData from "@/lib/plan-data.json";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Магазины и отделы",
  description: `Отделы и офисы строительного центра «Гвоздь» в Ижевске, ${SITE.address.street}.`,
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const companies = await getCompanies({ q });
  const offices = companies.length === 0 ? getPlanOffices(q) : [];

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Отделы" },
          ]}
        />
        <SectionHeading
          eyebrow="Навигация по центру"
          title="Магазины и отделы"
          description={
            companies.length > 0
              ? "Контакты, номера офисов и ассортимент."
              : `${planData.offices.length} офисов с плана этажей — ищите по названию, номеру или категории.`
          }
          action={
            <Link href="/plan" className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
              Открыть план
            </Link>
          }
        />

        <form className="mb-8" action="/companies" method="get">
          <label className="block max-w-xl">
            <span className="sr-only">Поиск отдела</span>
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Название, номер офиса или категория…"
              className="h-12 w-full rounded-lg border border-[var(--gvozd-gray-200)] bg-white px-4 text-sm outline-none ring-[var(--gvozd-red)] placeholder:text-[var(--gvozd-gray-500)] focus:ring-2"
            />
          </label>
        </form>

        <div className="mb-6 flex flex-wrap gap-2">
          {planData.halls.map((hall) => (
            <Link
              key={hall.key}
              href={`/plan?hall=${hall.key}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--gvozd-gray-200)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--gvozd-graphite)] hover:border-[var(--gvozd-red)]/40"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: hall.color }}
                aria-hidden
              />
              {hall.label}
            </Link>
          ))}
        </div>

        {companies.length > 0 ? (
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
          <EmptyState
            title="Ничего не найдено"
            description="Попробуйте другой запрос или откройте план этажей."
            action={
              <Link href="/plan" className="text-sm font-semibold text-[var(--gvozd-red)]">
                План центра
              </Link>
            }
          />
        )}
      </Container>
    </div>
  );
}
