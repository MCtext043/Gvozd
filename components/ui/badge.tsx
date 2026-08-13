import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "red",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "red" | "gray" | "green" | "amber";
}) {
  const tones = {
    red: "bg-[var(--gvozd-red)] text-white",
    gray: "bg-[var(--gvozd-gray-200)] text-[var(--gvozd-graphite)]",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
