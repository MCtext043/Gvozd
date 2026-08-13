import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { NewsCard } from "@/components/catalog/cards";
import { getNews } from "@/services/api";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости, события и мастер-классы строительного центра «Гвоздь».",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const items = await getNews();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Новости" },
          ]}
        />
        <SectionHeading
          eyebrow="Новости"
          title="События центра"
          description="Мастер-классы, анонсы и материалы о жизни СЦ «Гвоздь»."
        />
        {items.length === 0 ? (
          <EmptyState
            title="Публикаций пока нет"
            description="Новости появятся после публикации в панели управления."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={String(item.id)} item={item} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
