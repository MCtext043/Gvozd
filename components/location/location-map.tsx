import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

function widgetSrc(lon: number, lat: number, zoom: number) {
  const ll = encodeURIComponent(`${lon},${lat}`);
  const pt = encodeURIComponent(`${lon},${lat},pm2rdm`);
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${zoom}&l=map&pt=${pt}`;
}

type Props = {
  className?: string;
  /** Высота iframe */
  height?: number;
  showActions?: boolean;
  compact?: boolean;
};

/** Мини-карта по образцу Adam: Яндекс.Карты iframe + ссылки «Как добраться» */
export function LocationMap({
  className,
  height = 280,
  showActions = true,
  compact = false,
}: Props) {
  const { lon, lat, zoom, orgUrl, directionsUrl } = SITE.map;
  const src = widgetSrc(lon, lat, zoom);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-[var(--gvozd-gray-200)] bg-white", className)}>
      {!compact ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--gvozd-gray-100)] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--gvozd-black)]">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--gvozd-red)]" aria-hidden />
              {SITE.address.street}, {SITE.address.city}
            </p>
            <p className="mt-1 text-xs text-[var(--gvozd-gray-500)]">
              Остановки: {SITE.stops.join("; ")}
            </p>
          </div>
          {showActions ? (
            <div className="flex flex-wrap gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[var(--gvozd-red)] px-3 text-xs font-semibold text-white hover:bg-[var(--gvozd-red-dark)]"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden />
                Как добраться
              </a>
              <a
                href={orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--gvozd-gray-200)] bg-white px-3 text-xs font-semibold text-[var(--gvozd-graphite)] hover:border-[var(--gvozd-red)]/40"
              >
                Открыть в Яндекс.Картах
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative w-full bg-[var(--gvozd-gray-100)]" style={{ height }}>
        <iframe
          title={`Строительный центр «Гвоздь» на Яндекс.Картах — ${SITE.address.street}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>

      {compact && showActions ? (
        <div className="flex flex-wrap gap-2 border-t border-[var(--gvozd-gray-100)] p-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--gvozd-red)] px-3 text-xs font-semibold text-white hover:bg-[var(--gvozd-red-dark)] sm:flex-none"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden />
            Как добраться
          </a>
          <a
            href={orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--gvozd-gray-200)] px-3 text-xs font-semibold text-[var(--gvozd-graphite)]"
          >
            На карте
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      ) : null}
    </div>
  );
}
