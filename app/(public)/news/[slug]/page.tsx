import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { getNewsItem } from "@/services/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return { title: "Новость не найдена" };
  return {
    title: item.title,
    description: item.excerpt || item.title,
    alternates: { canonical: `/news/${slug}` },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Новости", href: "/news" },
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
          {item.published_at ? (
            <time
              className="text-sm font-medium text-[var(--gvozd-gray-500)]"
              dateTime={item.published_at}
            >
              {formatDate(item.published_at)}
            </time>
          ) : null}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            {item.title}
          </h1>
          {item.content ? (
            <div
              className="prose-gvozd mt-8"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : item.excerpt ? (
            <p className="mt-8 text-lg leading-relaxed">{item.excerpt}</p>
          ) : null}
        </article>
      </Container>
    </div>
  );
}
