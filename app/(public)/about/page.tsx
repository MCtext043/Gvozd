import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/section";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "О центре",
  description: `О строительном центре «Гвоздь»: ${SITE.areaSqM.toLocaleString("ru-RU")} м² ассортимента в Ижевске, ${SITE.address.street}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "О центре" },
          ]}
        />
        <SectionHeading
          eyebrow="О центре"
          title={SITE.fullName}
          description={SITE.slogan}
        />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="prose-gvozd space-y-6 text-base">
            <p>
              Строительный центр «Гвоздь» — площадка для ремонта и обустройства дома в
              Ижевске. На площади ассортимента {SITE.areaSqM.toLocaleString("ru-RU")} м²
              собраны отделы с материалами, отделкой, мебелью, инструментом и товарами
              для дома.
            </p>
            <p>
              Центр расположен в центре города, на перекрёстке основных магистралей —
              {SITE.address.street}. Рядом остановки: {SITE.stops.join("; ")}.
            </p>
            <p>
              Среднедневная проходимость — более {SITE.dailyVisitors.toLocaleString("ru-RU")}{" "}
              человек в день. На сайте центра представлены арендаторы и навигация по
              отделам; посещаемость портала — свыше{" "}
              {SITE.siteVisitsPerMonth.toLocaleString("ru-RU")} в месяц.
            </p>
            <p>
              В центре действует система навигации и учёт посетителей. Управляющая
              компания работает с арендаторами и продвижением торгового центра.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/plan"
                className="inline-flex h-11 items-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold text-white"
              >
                План центра
              </Link>
              <Link
                href="/arenda"
                className="inline-flex h-11 items-center rounded-md border-2 border-[var(--gvozd-graphite)] px-5 text-sm font-semibold"
              >
                Аренда площадей
              </Link>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-50)] p-6">
            <h2 className="text-lg font-bold">Ключевые факты</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[var(--gvozd-gray-500)]">Площадь</dt>
                <dd className="font-semibold">{SITE.areaSqM.toLocaleString("ru-RU")} м²</dd>
              </div>
              <div>
                <dt className="text-[var(--gvozd-gray-500)]">Адрес</dt>
                <dd className="font-semibold">{SITE.address.full}</dd>
              </div>
              <div>
                <dt className="text-[var(--gvozd-gray-500)]">Режим</dt>
                <dd className="font-semibold">{SITE.hours.short}</dd>
              </div>
              <div>
                <dt className="text-[var(--gvozd-gray-500)]">Телефон</dt>
                <dd>
                  <a href={SITE.phoneHref} className="font-semibold text-[var(--gvozd-red)]">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Container>
    </div>
  );
}
