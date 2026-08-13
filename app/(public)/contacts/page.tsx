import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Контакты СЦ «Гвоздь»: ${SITE.address.full}, тел. ${SITE.phone}.`,
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Контакты" },
          ]}
        />
        <SectionHeading
          eyebrow="Контакты"
          title="Как связаться с центром"
          description="Служба информации, администрация и заявка через форму."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--gvozd-gray-200)] p-6">
              <h2 className="text-lg font-bold">Адрес и режим</h2>
              <p className="mt-3 text-[var(--gvozd-graphite)]">{SITE.address.full}</p>
              <p className="mt-2 text-sm text-[var(--gvozd-gray-500)]">{SITE.hours.short}</p>
              <a
                href={SITE.phoneHref}
                className="mt-4 inline-flex text-2xl font-extrabold text-[var(--gvozd-red)] hover:underline"
              >
                {SITE.phone}
              </a>
              <p className="mt-2">
                <a href={`mailto:${SITE.email}`} className="text-sm hover:underline">
                  {SITE.email}
                </a>
              </p>
            </div>

            <div className="rounded-xl border border-[var(--gvozd-gray-200)] p-6">
              <h2 className="text-lg font-bold">Администрация</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li>
                  <p className="font-semibold">Администратор</p>
                  <p>{SITE.admin.name}</p>
                  <a href={`tel:${SITE.admin.phone.replace(/\D/g, "")}`} className="text-[var(--gvozd-red)]">
                    {SITE.admin.phone}
                  </a>
                </li>
                <li>
                  <p className="font-semibold">Управляющая</p>
                  <p>{SITE.manager.name}</p>
                  <a href={`tel:${SITE.manager.phone.replace(/\D/g, "")}`} className="text-[var(--gvozd-red)]">
                    {SITE.manager.phone}
                  </a>
                </li>
                <li>
                  <p className="font-semibold">Маркетинг / реклама</p>
                  <p>{SITE.marketing.company}</p>
                  <p>{SITE.marketing.name}</p>
                  <a href={`tel:${SITE.marketing.phone.replace(/\D/g, "")}`} className="text-[var(--gvozd-red)]">
                    {SITE.marketing.phone}
                  </a>
                  <p>
                    <a href={`mailto:${SITE.marketing.email}`} className="hover:underline">
                      {SITE.marketing.email}
                    </a>
                  </p>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)] bg-[var(--gvozd-gray-100)]">
              <div className="flex aspect-[16/10] items-center justify-center p-6 text-center text-sm text-[var(--gvozd-gray-500)]">
                Карта: Ижевск, ул. Удмуртская, 304
                <span className="sr-only">Адрес строительного центра Гвоздь</span>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-xl border border-[var(--gvozd-gray-200)] bg-white p-6 shadow-sm">
            <LeadForm
              mode="contact"
              source="contacts"
              title="Форма обратной связи"
              submitLabel="Отправить сообщение"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
