import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/site";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--gvozd-gray-200)] bg-[var(--gvozd-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            {SITE.tagline}. {SITE.areaSqM.toLocaleString("ru-RU")} м² ассортимента в центре Ижевска.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-white/50">Разделы</h2>
          <ul className="space-y-2 text-sm text-white/85">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--gvozd-red)]">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/arenda" className="hover:text-[var(--gvozd-red)]">
                Аренда
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-white/50">Контакты</h2>
          <p className="text-sm text-white/85">{SITE.address.full}</p>
          <p className="mt-3">
            <a className="text-lg font-bold hover:text-[var(--gvozd-red)]" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:text-[var(--gvozd-red)]" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-white/60">{SITE.hours.short}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {SITE.fullName}
      </div>
    </footer>
  );
}
