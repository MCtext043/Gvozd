import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, EmptyState, SectionHeading } from "@/components/ui/section";
import { getCompanies } from "@/services/api";

export const metadata: Metadata = {
  title: "План центра",
  description:
    "План этажей и список офисов строительного центра «Гвоздь» в Ижевске.",
  alternates: { canonical: "/plan" },
};

export default async function PlanPage() {
  const companies = await getCompanies();
  const withOffice = companies
    .filter((c) => c.office_number)
    .sort((a, b) => String(a.office_number).localeCompare(String(b.office_number), "ru", { numeric: true }));

  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "План центра" },
          ]}
        />
        <SectionHeading
          eyebrow="Навигация"
          title="План центра и офисы"
          description="Ориентируйтесь по номерам кабинетов. Интерактивная схема подключается к данным API."
        />

        <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-graphite)]">
          <div className="relative flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center text-white">
            <div
              className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]"
              aria-hidden
            />
            <p className="relative text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gvozd-red)]">
              Схема этажей
            </p>
            <h2 className="relative mt-3 max-w-xl text-2xl font-bold">
              План этажей доступен при печати и на стойке информации
            </h2>
            <p className="relative mt-3 max-w-lg text-sm text-white/70">
              Ниже — список офисов из API. Для печати используйте функцию печати браузера.
            </p>
            <Link
              href="#offices"
              className="relative mt-6 inline-flex h-11 items-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold"
            >
              К списку офисов
            </Link>
          </div>
        </div>

        <section id="offices">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Офисы и компании</h2>
            <p className="text-sm text-[var(--gvozd-gray-500)] print:hidden">
              Найдено: {withOffice.length || companies.length}
            </p>
          </div>

          {companies.length === 0 ? (
            <EmptyState
              title="Список офисов пока пуст"
              description="После импорта данных из API здесь появятся номера кабинетов и названия компаний."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--gvozd-gray-50)] text-[var(--gvozd-gray-500)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Офис</th>
                    <th className="px-4 py-3 font-semibold">Компания</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">Телефон</th>
                  </tr>
                </thead>
                <tbody>
                  {(withOffice.length ? withOffice : companies).map((c) => (
                    <tr key={String(c.id)} className="border-t border-[var(--gvozd-gray-200)]">
                      <td className="px-4 py-3 font-semibold text-[var(--gvozd-red)]">
                        {c.office_number || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/companies/${c.slug}`} className="font-medium hover:text-[var(--gvozd-red)]">
                          {c.name}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {c.phone || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
