import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Users,
  Navigation,
  Clock,
  Phone,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/section";
import {
  CategoryCard,
  CompanyCard,
  NewsCard,
  PlanOfficeCard,
  PromotionCard,
} from "@/components/catalog/cards";
import { SearchAutocomplete } from "@/components/forms/search-autocomplete";
import { LeadForm } from "@/components/forms/lead-form";
import { getFeaturedPlanOffices } from "@/lib/plan-offices";
import planData from "@/lib/plan-data.json";
import type { Category, Company, NewsItem, Promotion } from "@/types";

export function HomeSearchSection() {
  return (
    <section className="relative -mt-8 z-10">
      <Container>
        <div className="rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-4 shadow-lg sm:p-5">
          <p className="mb-3 text-sm font-medium text-[var(--gvozd-graphite)]">
            Найдите товар, категорию или отдел в центре
          </p>
          <SearchAutocomplete />
        </div>
      </Container>
    </section>
  );
}

export function QuickCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="py-14">
      <Container>
        <SectionHeading
          eyebrow="Каталог"
          title="Быстрый вход в категории"
          description="13 направлений — от стройматериалов до декора и мебели."
          action={
            <Link
              href="/catalog"
              className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline"
            >
              Весь каталог
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <CategoryCard key={String(c.id)} category={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomePromotions({ items }: { items: Promotion[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--gvozd-gray-50)] py-14">
      <Container>
        <SectionHeading
          eyebrow="Акции"
          title="Выгодные предложения центра"
          action={
            <Link href="/promotions" className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
              Все акции
            </Link>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <PromotionCard key={String(item.id)} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeCompanies({ items }: { items: Company[] }) {
  const fromApi = items.length > 0;
  const featuredOffices = getFeaturedPlanOffices(6);
  const total = fromApi ? items.length : planData.offices.length;

  return (
    <section className="py-14">
      <Container>
        <SectionHeading
          eyebrow="Навигация по центру"
          title="Магазины и отделы"
          description={`${total.toLocaleString("ru-RU")} точек на плане — найдите офис по номеру, залу или категории.`}
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/companies" className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
                Все отделы
              </Link>
              <Link href="/plan" className="text-sm font-semibold text-[var(--gvozd-graphite)] hover:underline">
                План этажей
              </Link>
            </div>
          }
        />
        <div className="mb-6 flex flex-wrap gap-2">
          {planData.halls.map((hall) => (
            <Link
              key={hall.key}
              href={`/plan?hall=${hall.key}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--gvozd-gray-200)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--gvozd-graphite)] hover:border-[var(--gvozd-red)]/40"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: hall.color }}
                aria-hidden
              />
              {hall.label}
            </Link>
          ))}
        </div>
        {fromApi ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((c) => (
              <CompanyCard key={String(c.id)} company={c} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOffices.map((o) => (
              <PlanOfficeCard key={o.slug} office={o} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export function WhyGvozd() {
  const facts = [
    {
      icon: Maximize2,
      title: `${SITE.areaSqM.toLocaleString("ru-RU")} м²`,
      text: "Площадь ассортимента — всё для ремонта и дома в одном месте",
    },
    {
      icon: MapPin,
      title: "Центр Ижевска",
      text: `${SITE.address.street} — на перекрёстке основных магистралей`,
    },
    {
      icon: Users,
      title: `Более ${SITE.dailyVisitors.toLocaleString("ru-RU")}/день`,
      text: "Среднедневная проходимость торгового центра",
    },
    {
      icon: Navigation,
      title: "Удобный подъезд",
      text: SITE.stops.join("; "),
    },
    {
      icon: Clock,
      title: "Режим работы",
      text: SITE.hours.short,
    },
    {
      icon: Phone,
      title: "Служба информации",
      text: SITE.phone,
    },
  ];

  return (
    <section className="bg-[var(--gvozd-graphite)] py-14 text-white">
      <Container>
        <SectionHeading
          eyebrow="Почему Гвоздь"
          title="Факты о строительном центре"
          description="Только подтверждённые сведения с официального сайта центра."
          className="[&_h2]:text-white [&_p]:text-white/70"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <f.icon className="h-6 w-6 text-[var(--gvozd-red)]" aria-hidden />
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--gvozd-gray-50)] py-14">
      <Container>
        <SectionHeading
          eyebrow="Новости"
          title="События и мастер-классы"
          action={
            <Link href="/news" className="text-sm font-semibold text-[var(--gvozd-red)] hover:underline">
              Все новости
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <NewsCard key={String(item.id)} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeLeadCta() {
  return (
    <section className="py-14">
      <Container>
        <div className="grid gap-8 rounded-2xl border border-[var(--gvozd-gray-200)] bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gvozd-red)]">
              Не нашли, что искали?
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--gvozd-black)]">
              Звоните или оставьте заявку
            </h2>
            <p className="mt-3 text-[var(--gvozd-gray-500)]">
              Служба информации поможет сориентироваться по отделам и ассортименту.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-6 inline-flex text-2xl font-extrabold text-[var(--gvozd-red)] hover:underline"
            >
              {SITE.phone}
            </a>
            <p className="mt-2 text-sm text-[var(--gvozd-gray-500)]">{SITE.hours.short}</p>
          </div>
          <LeadForm source="home" title="Напишите нам" submitLabel="Отправить заявку" />
        </div>
      </Container>
    </section>
  );
}
