import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { CatalogFilters } from "@/components/catalog/filters";
import { CategoryCard } from "@/components/catalog/cards";
import { getCategories } from "@/services/api";

export const metadata: Metadata = {
  title: "Каталог категорий",
  description:
    "Каталог товаров строительного центра «Гвоздь»: 13 направлений — стройматериалы, сантехника, плитка, мебель и другое.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const categories = await getCategories();
  const roots = categories.filter((c) => !c.parent_id);

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
          ]}
        />
        <SectionHeading
          eyebrow="Каталог"
          title="Категории товаров"
          description="Выберите направление — найдёте отделы и компании с нужным ассортиментом."
        />
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <CatalogFilters categories={categories} />
          <div>
            {roots.length === 0 ? (
              <EmptyState
                title="Категории пока недоступны"
                description="Данные появятся после подключения API."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {roots.map((c) => (
                  <CategoryCard key={String(c.id)} category={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
