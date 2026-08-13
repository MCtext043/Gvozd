import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
  compact = false,
}: {
  className?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)]",
        className,
      )}
      aria-label="Строительный центр Гвоздь — на главную"
    >
      <Image
        src="/brand/logo-gvozd.png"
        alt="Логотип строительного центра Гвоздь"
        width={compact ? 44 : 52}
        height={compact ? 44 : 52}
        className="h-10 w-10 rounded-md object-cover shadow-sm transition-transform group-hover:scale-[1.03] sm:h-11 sm:w-11"
        priority
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-lg font-extrabold tracking-tight",
              light ? "text-white" : "text-[var(--gvozd-black)]",
            )}
          >
            Гвоздь
          </span>
          <span
            className={cn(
              "mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
              light ? "text-white/70" : "text-[var(--gvozd-gray-500)]",
            )}
          >
            Строительный центр
          </span>
        </span>
      )}
    </Link>
  );
}
