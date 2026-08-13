import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { CatalogFilters } from "@/components/catalog/filters";
import { CompanyCard, CategoryCard } from "@/components/catalog/cards";
import { getCategories, getCategory, getCompanies } from "@/services/api";
import { ROOT_CATEGORIES } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category =
    (await getCategory(slug)) ??
    ROOT_CATEGORIES.find((c) => c.slug === slug) ??
    null;
  if (!category) return { title: "Категория не найдена" };
  return {
    title: category.name,
    description: `Категория «${category.name}» в строительном центре «Гвоздь» — компании и ассортимент.`,
    alternates: { canonical: `/catalog/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [allCategories, apiCategory, companies] = await Promise.all([
    getCategories(),
    getCategory(slug),
    getCompanies({ category: slug }),
  ]);

  const fallback = ROOT_CATEGORIES.find((c) => c.slug === slug);
  const category =
    apiCategory ??
    (fallback
      ? { id: fallback.slug, slug: fallback.slug, name: fallback.name }
      : null);

  if (!category) notFound();

  const children =
    category.children ??
    allCategories.filter((c) => String(c.parent_id) === String(category.id));

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: category.name },
          ]}
        />
        <SectionHeading
          eyebrow="Категория"
          title={category.name}
          description={
            category.description ||
            `Компании и отделы центра с ассортиментом в направлении «${category.name}».`
          }
          action={
            <Link
              href="/companies"
              className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline"
            >
              Смотреть компании
            </Link>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <CatalogFilters categories={allCategories} activeSlug={slug} />
          <div className="space-y-10">
            {children.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-bold">Подкатегории</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {children.map((c) => (
                    <CategoryCard key={String(c.id)} category={c} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="mb-4 text-lg font-bold">Компании в категории</h2>
              {companies.length === 0 ? (
                <EmptyState
                  title="Пока нет компаний в этой категории"
                  description="Список появится из API. Вы можете оставить заявку или позвонить в службу информации."
                  action={
                    <Link
                      href="/contacts"
                      className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline"
                    >
                      Связаться с нами
                    </Link>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {companies.map((c) => (
                    <CompanyCard key={String(c.id)} company={c} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
