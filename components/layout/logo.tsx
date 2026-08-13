import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)] rounded-md",
        className,
      )}
      aria-label="Строительный центр Гвоздь — на главную"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md bg-[var(--gvozd-red)] text-lg font-black text-white shadow-sm transition-transform group-hover:scale-[1.03]",
        )}
        aria-hidden
      >
        Г
      </span>
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
    </Link>
  );
}
