import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/forms/lead-form";
import { getCompany } from "@/services/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Компания не найдена" };
  return {
    title: company.name,
    description:
      company.assortment ||
      company.description ||
      `${company.name} в строительном центре «Гвоздь».`,
    alternates: { canonical: `/companies/${slug}` },
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Компании", href: "/companies" },
            { label: company.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article>
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {company.name}
              </h1>
              {company.office_number ? (
                <Badge>Офис {company.office_number}</Badge>
              ) : null}
            </div>

            {company.categories && company.categories.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {company.categories.map((c) => (
                  <Link key={String(c.id)} href={`/catalog/${c.slug}`}>
                    <Badge tone="gray">{c.name}</Badge>
                  </Link>
                ))}
              </div>
            ) : null}

            {company.description ? (
              <p className="mt-6 text-[var(--gvozd-gray-500)] leading-relaxed">
                {company.description}
              </p>
            ) : null}

            {company.assortment ? (
              <section className="mt-8">
                <h2 className="text-lg font-bold">Ассортимент</h2>
                <p className="mt-2 whitespace-pre-line text-[var(--gvozd-graphite)]">
                  {company.assortment}
                </p>
              </section>
            ) : null}

            {company.services ? (
              <section className="mt-8">
                <h2 className="text-lg font-bold">Услуги</h2>
                <p className="mt-2 whitespace-pre-line text-[var(--gvozd-graphite)]">
                  {company.services}
                </p>
              </section>
            ) : null}

            <section className="mt-8 rounded-xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-50)] p-5">
              <h2 className="text-lg font-bold">Контакты</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {company.office_number ? (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--gvozd-red)]" aria-hidden />
                    Офис {company.office_number}
                    <Link href="/plan" className="text-[var(--gvozd-red)] hover:underline">
                      на плане
                    </Link>
                  </li>
                ) : null}
                {company.phone ? (
                  <li>
                    <a
                      href={`tel:${company.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-2 font-semibold hover:text-[var(--gvozd-red)]"
                    >
                      <Phone className="h-4 w-4 text-[var(--gvozd-red)]" aria-hidden />
                      {company.phone}
                    </a>
                  </li>
                ) : null}
                {company.email ? (
                  <li>
                    <a
                      href={`mailto:${company.email}`}
                      className="inline-flex items-center gap-2 hover:text-[var(--gvozd-red)]"
                    >
                      <Mail className="h-4 w-4 text-[var(--gvozd-red)]" aria-hidden />
                      {company.email}
                    </a>
                  </li>
                ) : null}
                {company.website ? (
                  <li>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[var(--gvozd-red)]"
                    >
                      <ExternalLink className="h-4 w-4 text-[var(--gvozd-red)]" aria-hidden />
                      Сайт компании
                    </a>
                  </li>
                ) : null}
                {!company.phone && !company.email && !company.website ? (
                  <li className="text-[var(--gvozd-gray-500)]">
                    Контакты уточняйте в службе информации центра.
                  </li>
                ) : null}
              </ul>
            </section>
          </article>

          <aside className="h-fit rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-6 shadow-sm">
            <LeadForm
              source="company"
              companySlug={company.slug}
              title="Узнать наличие / оставить заявку"
              submitLabel="Отправить"
            />
          </aside>
        </div>
      </Container>
    </div>
  );
}
