"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Folders,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Tag,
  Users,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ADMIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const ICONS = {
  LayoutDashboard,
  Image,
  MessageSquare,
  Tag,
  Newspaper,
  Folders,
  Building2,
  FileText,
  Inbox,
  Settings,
  Users,
} as const;

function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!token) router.replace("/admin/login");
  }, [ready, token, isLogin, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gvozd-gray-50)] text-sm text-[var(--gvozd-gray-500)]">
        Загрузка панели…
      </div>
    );
  }

  if (isLogin) {
    return <div className="min-h-screen bg-[var(--gvozd-gray-50)]">{children}</div>;
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gvozd-gray-50)] text-sm">
        Перенаправление на вход…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--gvozd-gray-50)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--gvozd-gray-200)] bg-[var(--gvozd-graphite)] text-white md:flex md:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gvozd-red)]">
              Гвоздь
            </p>
            <p className="mt-1 text-lg font-bold">Панель управления</p>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Разделы панели">
          {ADMIN_NAV.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS] ?? LayoutDashboard;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--gvozd-red)] text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="mb-2 block rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            На сайт
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--gvozd-gray-200)] bg-white px-4 py-3 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gvozd-red)] md:hidden">
              Панель управления
            </p>
            <h1 className="text-lg font-bold text-[var(--gvozd-black)]">
              {ADMIN_NAV.find((i) =>
                i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href),
              )?.label ?? "Панель"}
            </h1>
          </div>
          <nav className="flex gap-2 overflow-x-auto md:hidden" aria-label="Мобильная навигация админки">
            {ADMIN_NAV.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md bg-[var(--gvozd-gray-100)] px-2.5 py-1.5 text-xs font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
