import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { CompanyCard } from "@/components/catalog/cards";
import { getCompanies } from "@/services/api";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Компании и отделы",
  description: `Арендаторы и отделы строительного центра «Гвоздь» в Ижевске, ${SITE.address.street}.`,
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const companies = await getCompanies({ q });

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Компании" },
          ]}
        />
        <SectionHeading
          eyebrow="Компании"
          title="Отделы строительного центра"
          description="Контакты, номера офисов и ассортимент арендаторов."
        />
        {companies.length === 0 ? (
          <EmptyState
            title="Список компаний пуст"
            description="Данные загружаются из API. Когда backend доступен, здесь появятся карточки отделов."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <CompanyCard key={String(c.id)} company={c} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
