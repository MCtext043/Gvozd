import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/section";
import { PlanExplorer } from "@/components/plan/plan-explorer";

export const metadata: Metadata = {
  title: "План центра",
  description:
    "Планы этажей и номера офисов строительного центра «Гвоздь» в Ижевске: жёлтый, зелёный и синий залы.",
  alternates: { canonical: "/plan" },
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hall?: string }>;
}) {
  const { q, hall } = await searchParams;

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "План центра" },
          ]}
        />
        <SectionHeading
          eyebrow="Навигация по центру"
          title="План центра и номера офисов"
          description="Данные из буклета-путеводителя СЦ «Гвоздь»: схемы залов, список офисов и поисковая система товаров."
        />
        <PlanExplorer initialHall={hall} initialQuery={q} />
      </Container>
    </div>
  );
}
