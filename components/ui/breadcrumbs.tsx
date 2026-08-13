import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Хлебные крошки" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--gvozd-gray-500)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden /> : null}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--gvozd-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)] rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? "text-[var(--gvozd-graphite)] font-medium" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
