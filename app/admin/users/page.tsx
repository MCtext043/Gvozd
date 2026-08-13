"use client";

import { AdminEntityList } from "@/components/admin/entity-list";

export default function AdminUsersPage() {
  return (
    <AdminEntityList
      title="Пользователи"
      description="Доступ к панели: SUPERADMIN, ADMIN, EDITOR."
      endpoint="/admin/users"
      publicHref="/admin"
      renderItem={(item) => (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{String(item.name || item.email || "")}</p>
            <p className="text-xs text-[var(--gvozd-gray-500)]">{String(item.email ?? "")}</p>
          </div>
          <span className="rounded bg-[var(--gvozd-gray-100)] px-2 py-1 text-xs font-semibold">
            {String(item.role ?? "")}
          </span>
        </div>
      )}
    />
  );
}
