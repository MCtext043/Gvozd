import Link from "next/link";
import Image from "next/image";
import type { Category, Company, NewsItem, Promotion } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group relative flex min-h-[140px] flex-col justify-end overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-50)] p-5 transition-all hover:border-[var(--gvozd-red)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt=""
          fill
          className="object-cover opacity-20 transition-opacity group-hover:opacity-30"
          sizes="(max-width:768px) 50vw, 25vw"
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(227,30,36,0.08),transparent_55%)]"
          aria-hidden
        />
      )}
      <div className="relative">
        <h3 className="text-base font-bold text-[var(--gvozd-black)] group-hover:text-[var(--gvozd-red)]">
          {category.name}
        </h3>
        {typeof category.companies_count === "number" ? (
          <p className="mt-1 text-xs text-[var(--gvozd-gray-500)]">
            {category.companies_count}{" "}
            {category.companies_count === 1
              ? "компания"
              : category.companies_count < 5
                ? "компании"
                : "компаний"}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--gvozd-gray-100)] text-lg font-bold text-[var(--gvozd-red)]">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            company.name.slice(0, 1)
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--gvozd-black)] group-hover:text-[var(--gvozd-red)]">
            {company.name}
          </h3>
          {company.office_number ? (
            <p className="mt-0.5 text-xs text-[var(--gvozd-gray-500)]">
              Офис {company.office_number}
            </p>
          ) : null}
        </div>
      </div>
      {company.assortment ? (
        <p className="mt-3 line-clamp-2 text-sm text-[var(--gvozd-gray-500)]">
          {company.assortment}
        </p>
      ) : company.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-[var(--gvozd-gray-500)]">
          {company.description}
        </p>
      ) : null}
      {company.categories && company.categories.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {company.categories.slice(0, 3).map((c) => (
            <Badge key={String(c.id)} tone="gray">
              {c.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export function PromotionCard({ item }: { item: Promotion }) {
  return (
    <Link
      href={`/promotions/${item.slug}`}
      className="group overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)] bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]"
    >
      <div className="relative aspect-[16/9] bg-[var(--gvozd-gray-100)]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--gvozd-red),var(--gvozd-graphite))] opacity-80" />
        )}
        <Badge className="absolute left-3 top-3">Акция</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--gvozd-black)] group-hover:text-[var(--gvozd-red)]">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--gvozd-gray-500)]">{item.excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article>
      <Link
        href={`/news/${item.slug}`}
        className={cn(
          "group block rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]",
        )}
      >
        {item.published_at ? (
          <time className="text-xs font-medium text-[var(--gvozd-gray-500)]" dateTime={item.published_at}>
            {formatDate(item.published_at)}
          </time>
        ) : null}
        <h3 className="mt-2 font-semibold text-[var(--gvozd-black)] group-hover:text-[var(--gvozd-red)]">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-[var(--gvozd-gray-500)]">{item.excerpt}</p>
        ) : null}
      </Link>
    </article>
  );
}
