import Link from "next/link";
import { getVisibleNavLinks, SITE, type NavVisibility } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { LocationMap } from "@/components/location/location-map";

export function Footer({ navVisibility }: { navVisibility?: NavVisibility }) {
  const links = getVisibleNavLinks(navVisibility);

  return (
    <footer className="mt-auto border-t border-[var(--gvozd-gray-200)] bg-[var(--gvozd-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            {SITE.tagline}. {SITE.areaSqM.toLocaleString("ru-RU")} м² ассортимента в центре Ижевска.
          </p>
          <p className="mt-4 text-sm text-white/85">{SITE.address.full}</p>
          <p className="mt-3">
            <a className="text-lg font-bold hover:text-[var(--gvozd-red)]" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <a
            href={SITE.map.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-[var(--gvozd-red)] px-4 text-sm font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
          >
            Как добраться
          </a>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-white/50">Разделы</h2>
          <ul className="space-y-2 text-sm text-white/85">
            {links.map((link) => (
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
          <p className="mt-6 text-sm text-white/60">{SITE.hours.short}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-white/50">Карта</h2>
          <div className="overflow-hidden rounded-xl border border-white/10 [&_a]:text-[var(--gvozd-graphite)]">
            <LocationMap compact height={220} className="border-0" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {SITE.fullName}
      </div>
    </footer>
  );
}
