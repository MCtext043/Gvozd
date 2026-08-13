import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { PromotionCard } from "@/components/catalog/cards";
import { getPromotions } from "@/services/api";

export const metadata: Metadata = {
  title: "Акции",
  description: "Акции и специальные предложения строительного центра «Гвоздь» в Ижевске.",
  alternates: { canonical: "/promotions" },
};

export default async function PromotionsPage() {
  const items = await getPromotions();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Акции" },
          ]}
        />
        <SectionHeading
          eyebrow="Акции"
          title="Специальные предложения"
          description="Актуальные акции арендаторов и центра."
        />
        {items.length === 0 ? (
          <EmptyState
            title="Активных акций сейчас нет"
            description="Следите за обновлениями или позвоните в службу информации."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PromotionCard key={String(item.id)} item={item} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
