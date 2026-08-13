import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/section";
import { ArendaForm } from "@/components/forms/arenda-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Аренда",
  description:
    "Заявка на аренду площади в строительном центре «Гвоздь» в Ижевске.",
  alternates: { canonical: "/arenda" },
};

export default function ArendaPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Аренда" },
          ]}
        />
        <SectionHeading
          eyebrow="Арендаторам"
          title="Заявка на аренду"
          description={`Разместите отдел в СЦ «Гвоздь» — ${SITE.address.street}. Площадь ассортимента центра ${SITE.areaSqM.toLocaleString("ru-RU")} м², проходимость более ${SITE.dailyVisitors.toLocaleString("ru-RU")} человек в день.`}
        />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="h-fit space-y-4 rounded-xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-50)] p-6 text-sm">
            <h2 className="text-lg font-bold">Контакты по аренде</h2>
            <p>
              <span className="text-[var(--gvozd-gray-500)]">Управляющая:</span>
              <br />
              {SITE.manager.name}
              <br />
              <a href={`tel:${SITE.manager.phone.replace(/\D/g, "")}`} className="font-semibold text-[var(--gvozd-red)]">
                {SITE.manager.phone}
              </a>
            </p>
            <p>
              <span className="text-[var(--gvozd-gray-500)]">Администратор:</span>
              <br />
              {SITE.admin.name}
              <br />
              <a href={`tel:${SITE.admin.phone.replace(/\D/g, "")}`} className="font-semibold text-[var(--gvozd-red)]">
                {SITE.admin.phone}
              </a>
            </p>
            <p>
              <span className="text-[var(--gvozd-gray-500)]">Реклама:</span>
              <br />
              {SITE.marketing.name}, {SITE.marketing.phone}
            </p>
          </aside>

          <div className="rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-6 shadow-sm md:p-8">
            <ArendaForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
