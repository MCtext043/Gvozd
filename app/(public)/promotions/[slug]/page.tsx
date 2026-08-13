import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { getPromotion } from "@/services/api";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPromotion(slug);
  if (!item) return { title: "Акция не найдена" };
  return {
    title: item.title,
    description: item.excerpt || item.title,
    alternates: { canonical: `/promotions/${slug}` },
    openGraph: { title: item.title, description: item.excerpt || undefined },
  };
}

export default async function PromotionDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPromotion(slug);
  if (!item) notFound();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Акции", href: "/promotions" },
            { label: item.title },
          ]}
        />
        <article className="mx-auto max-w-3xl">
          {item.image_url ? (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl bg-[var(--gvozd-gray-100)]">
              <Image
                src={item.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 768px"
                priority
              />
            </div>
          ) : null}
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{item.title}</h1>
          {(item.starts_at || item.ends_at) && (
            <p className="mt-3 text-sm text-[var(--gvozd-gray-500)]">
              {item.starts_at ? formatDate(item.starts_at) : ""}
              {item.ends_at ? ` — ${formatDate(item.ends_at)}` : ""}
            </p>
          )}
          {item.content ? (
            <div
              className="prose-gvozd mt-8"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : item.excerpt ? (
            <p className="mt-8 text-lg leading-relaxed text-[var(--gvozd-graphite)]">
              {item.excerpt}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className="inline-flex h-11 items-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold text-white"
            >
              Связаться
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-11 items-center rounded-md border border-[var(--gvozd-graphite)] px-5 text-sm font-semibold"
            >
              Позвонить
            </a>
          </div>
        </article>
      </Container>
    </div>
  );
}
