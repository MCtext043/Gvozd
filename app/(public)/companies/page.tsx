import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/section";
import { CompaniesHallFilter } from "@/components/plan/hall-filters";
import { getCompanies } from "@/services/api";
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
  searchParams: Promise<{ q?: string; hall?: string }>;
}) {
  const { q, hall } = await searchParams;
  const companies = await getCompanies({ q });

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
              : `${planData.offices.length} офисов — фильтруйте по залу или ищите по названию.`
          }
          action={
            <Link href="/plan" className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
              Открыть план
            </Link>
          }
        />

        <form className="mb-8" action="/companies" method="get">
          {hall ? <input type="hidden" name="hall" value={hall} /> : null}
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

        <CompaniesHallFilter companies={companies} initialHall={hall} query={q} />
      </Container>
    </div>
  );
}
